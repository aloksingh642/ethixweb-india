import { NextResponse } from 'next/server';
import { getRepository } from '@/lib/db';
import { clientIp, hashIp, leadReference, verifySignedTimestamp } from '@/lib/security';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { enquirySchema, looksLikeSpam } from '@/lib/validation';
import { fail, handle, ok, readJson } from '@/lib/api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* ── Throttle policy ─────────────────────────────────────────────────────────
   Calibrated for Indian networks specifically. Most mobile and broadband users
   here sit behind carrier-grade NAT, so a single public IP can represent
   thousands of real people — an aggressive per-IP limit would block legitimate
   enquiries from entire cities.

   So the per-IP ceilings are deliberately generous and act only as a blunt
   abuse brake. The signal that actually catches a spammer is the per-email
   window, which is user-specific rather than network-specific, backed by the
   honeypot and the time-to-submit check.                                     */
const IP_WINDOW_MINUTES = 60;
const IP_MAX_PER_WINDOW = 12;
const EMAIL_WINDOW_MINUTES = 60;
const EMAIL_MAX_PER_WINDOW = 3;
const BURST_LIMIT = 20;
const BURST_WINDOW_MS = 60_000;

/** A human needs at least this long to fill the form. Bots do not. */
const MIN_FILL_MS = 2_500;
const MAX_FILL_MS = 24 * 60 * 60 * 1000;

/** Optional Cloudflare Turnstile — only active when both keys are configured. */
async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!secret || !siteKey) return true; // feature disabled
  if (!token) return false;

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    // Never let the challenge provider hang the enquiry form.
    signal: AbortSignal.timeout(5000),
  }).catch(() => null);

  if (!res?.ok) return false;
  const data = (await res.json().catch(() => ({}))) as { success?: boolean };
  return data.success === true;
}

export async function POST(request: Request) {
  return handle(async () => {
    const ip = clientIp(request.headers);
    const ipHash = hashIp(ip);

    /* 1. Burst protection (cheap, in-memory) — before any parsing. */
    const burst = rateLimit(`enq:burst:${ipHash}`, BURST_LIMIT, BURST_WINDOW_MS);
    if (!burst.ok) {
      return fail('Too many enquiries from this connection. Please try again shortly.', 429, {
        code: 'RATE_LIMITED',
        headers: rateLimitHeaders(burst),
      });
    }

    /* 2. Parse + validate. */
    const body = await readJson(request);
    const parsed = enquirySchema.safeParse(body);
    if (!parsed.success) {
      const flat: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join('.') || '_';
        if (!flat[key]) flat[key] = issue.message;
      }
      return fail('Please check the highlighted fields.', 422, { fieldErrors: flat, code: 'VALIDATION' });
    }
    const input = parsed.data;

    /* 3. Honeypot: hidden field that must be empty. */
    if (input.website && input.website.length > 0) {
      // Pretend to succeed so naive bots do not retry with a different payload.
      return ok({ reference: leadReference(), message: 'Thanks — we will be in touch.' });
    }

    /* 4. Time-to-submit check against the signed render token. */
    const renderedAt = verifySignedTimestamp(input.ts);
    if (renderedAt === null) {
      return fail('This form has expired. Please refresh the page and try again.', 400, {
        code: 'STALE_FORM',
      });
    }
    const elapsed = Date.now() - renderedAt;
    if (elapsed < MIN_FILL_MS) {
      return fail('That was submitted very quickly. Please review your answers and try again.', 422, {
        code: 'TOO_FAST',
      });
    }
    if (elapsed > MAX_FILL_MS) {
      return fail('This form has expired. Please refresh the page and try again.', 400, {
        code: 'STALE_FORM',
      });
    }

    /* 5. Content heuristics. */
    if (looksLikeSpam(input.message)) {
      return fail('Your message looks like automated spam. Please call us on +91 98290 12345 instead.', 422, {
        code: 'SPAM',
      });
    }

    /* 6. Turnstile, when configured. */
    const turnstileToken = (body as Record<string, unknown>)?.['cf-turnstile-response'];
    if (typeof turnstileToken === 'string') {
      if (!(await verifyTurnstile(turnstileToken, ip))) {
        return fail('Security check failed. Please refresh and try again.', 422, { code: 'CAPTCHA' });
      }
    } else if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      return fail('Security check failed. Please refresh and try again.', 422, { code: 'CAPTCHA' });
    }

    /* 7. Durable throttles (survive across serverless instances). */
    const repo = getRepository();
    const [recentByIp, recentByEmail] = await Promise.all([
      repo.countRecentByIp(ipHash, IP_WINDOW_MINUTES),
      repo.countRecentByEmail(input.email, EMAIL_WINDOW_MINUTES),
    ]);

    if (recentByIp >= IP_MAX_PER_WINDOW) {
      return fail(
        `We have received a few enquiries from this connection already. Please WhatsApp us on +91 98290 12345 for a faster reply.`,
        429,
        { code: 'RATE_LIMITED' },
      );
    }
    if (recentByEmail >= EMAIL_MAX_PER_WINDOW) {
      return fail(
        `We already have a recent enquiry from ${input.email}. We will reply within one business day — no need to send another.`,
        429,
        { code: 'DUPLICATE' },
      );
    }

    /* 8. Persist. Retry once on a duplicate reference (vanishingly rare). */
    let lead;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        lead = await repo.create({
          reference: leadReference(),
          name: input.name,
          email: input.email,
          phone: input.phone,
          company: input.company ?? null,
          city: input.city ?? null,
          service: input.service,
          budget: input.budget ?? null,
          message: input.message,
          source: 'website',
          pagePath: input.pagePath ?? null,
          ipHash,
          userAgent: request.headers.get('user-agent')?.slice(0, 300) ?? null,
          referrer: request.headers.get('referer')?.slice(0, 300) ?? null,
        });
        break;
      } catch (err) {
        const message = err instanceof Error ? err.message : '';
        if (!message.includes('leads_reference_key') && !message.includes('duplicate key')) throw err;
      }
    }
    if (!lead) throw new Error('Could not allocate a lead reference');

    return ok(
      {
        reference: lead.reference,
        message: `Thanks ${lead.name.split(' ')[0]} — your enquiry is in. Reference ${lead.reference}.`,
      },
      201,
    );
  });
}

/** Enquiries are created via POST only; anything else is a clear 405. */
export function GET() {
  return NextResponse.json(
    { ok: false, error: 'Method not allowed. POST a JSON enquiry to this endpoint.' },
    { status: 405, headers: { Allow: 'POST' } },
  );
}
