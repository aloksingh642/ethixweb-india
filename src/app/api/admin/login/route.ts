import { getRepository } from '@/lib/db';
import { createSession, verifyCredentials } from '@/lib/auth';
import { clientIp, hashIp } from '@/lib/security';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { loginSchema } from '@/lib/validation';
import { fail, handle, ok, readJson } from '@/lib/api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WINDOW_MINUTES = 15;
const MAX_ATTEMPTS = 8;
const MAX_FAILED = 6;

export async function POST(request: Request) {
  return handle(async () => {
    const ip = clientIp(request.headers);
    const ipHash = hashIp(ip);
    const repo = getRepository();

    // Durable attempt counter first, so a distributed brute force cannot just
    // hop between warm instances to reset the in-memory bucket.
    const prior = await repo.loginAttemptsSince(ipHash, WINDOW_MINUTES);
    if (prior.failed >= MAX_FAILED) {
      return fail(
        `Too many failed sign-in attempts. Please wait ${WINDOW_MINUTES} minutes and try again.`,
        429,
        { code: 'LOCKED' },
      );
    }

    const burst = rateLimit(`admin:login:${ipHash}`, MAX_ATTEMPTS, WINDOW_MINUTES * 60_000);
    if (!burst.ok) {
      return fail('Too many sign-in attempts. Please wait a few minutes.', 429, {
        code: 'RATE_LIMITED',
        headers: rateLimitHeaders(burst),
      });
    }

    const body = await readJson(request);
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      await repo.recordLoginAttempt(ipHash, null, false);
      return fail('Enter your email and password.', 422, { code: 'VALIDATION' });
    }

    const { email, password } = parsed.data;
    if (!verifyCredentials(email, password)) {
      await repo.recordLoginAttempt(ipHash, email, false);
      // Deliberately identical message for both failure modes.
      return fail('Those credentials are not correct.', 401, { code: 'INVALID' });
    }

    await repo.recordLoginAttempt(ipHash, email, true);
    await createSession(email);

    return ok({ email: email.trim().toLowerCase() });
  });
}
