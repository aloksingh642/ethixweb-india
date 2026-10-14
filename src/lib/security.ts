import 'server-only';

import { createHash, createHmac, randomInt, timingSafeEqual } from 'node:crypto';

/**
 * Salt for IP hashing and the timestamp token. Falls back to a fixed dev value
 * so local runs work before env is configured — but production must set
 * ADMIN_SESSION_SECRET, and we warn loudly if it is missing.
 */
function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[security] ADMIN_SESSION_SECRET is missing or too short in production. ' +
        'Set it to a random 32+ byte string.',
    );
  }
  return s || 'ethixweb-insecure-dev-secret-change-me';
}

/** Constant-time string comparison that tolerates unequal lengths. */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

/**
 * One-way hash of a visitor IP. We never persist raw IPs — the DPDP Act treats
 * them as personal data, and we only need enough to rate-limit and spot abuse.
 */
export function hashIp(ip: string): string {
  return createHash('sha256').update(`${secret()}|${ip}`).digest('hex').slice(0, 32);
}

/** Best-effort client IP from proxy headers. Never trusted for auth. */
export function clientIp(headers: Headers): string {
  const xff = headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return (
    headers.get('x-real-ip') ??
    headers.get('cf-connecting-ip') ??
    headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ??
    '0.0.0.0'
  );
}

/** Compact, human-quotable lead reference: EW-2510-7QK4 */
export function leadReference(now = new Date()): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1
  const yy = String(now.getUTCFullYear()).slice(2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  let tail = '';
  for (let i = 0; i < 4; i += 1) tail += alphabet[randomInt(alphabet.length)];
  return `EW-${yy}${mm}-${tail}`;
}

/* ── Signed "form rendered at" token ────────────────────────────────────────
   Bots POST straight to the endpoint and finish in milliseconds. A real user
   needs several seconds to fill the form. The timestamp is HMAC-signed so a
   bot cannot simply claim it rendered the form an hour ago.                  */

export function signTimestamp(ts: number = Date.now()): string {
  const mac = createHmac('sha256', secret()).update(String(ts)).digest('base64url');
  return `${ts}.${mac}`;
}

/** Returns the signed timestamp in ms, or null if it was forged / malformed. */
export function verifySignedTimestamp(token: unknown): number | null {
  if (typeof token !== 'string') return null;
  const dot = token.indexOf('.');
  if (dot <= 0) return null;
  const ts = Number(token.slice(0, dot));
  if (!Number.isFinite(ts) || ts <= 0) return null;

  const expected = createHmac('sha256', secret()).update(String(ts)).digest('base64url');
  const provided = token.slice(dot + 1);
  if (provided.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(provided), Buffer.from(expected))) return null;

  return ts;
}

/** Strips control characters that break email clients and CSV exports. */
export function sanitiseText(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\r\n/g, '\n')
    .trim();
}

/** Counts http(s) links — a blunt but effective spam signal on enquiry forms. */
export function countLinks(value: string): number {
  return (value.match(/https?:\/\/|www\./gi) ?? []).length;
}
