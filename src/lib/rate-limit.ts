import 'server-only';

type Bucket = { count: number; resetAt: number };

/**
 * Process-local sliding window. On serverless this is per-instance and
 * therefore best-effort; the durable throttles (per-IP and per-email counts)
 * live in Postgres via the repository. We use both: this one absorbs bursts
 * cheaply, the DB one is authoritative across instances.
 */
declare global {
  // eslint-disable-next-line no-var
  var __ethixRateLimit: Map<string, Bucket> | undefined;
}

const store = (): Map<string, Bucket> => (globalThis.__ethixRateLimit ??= new Map());

export type RateLimitResult = {
  ok: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the window resets, when throttled. */
  retryAfter: number;
};

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const buckets = store();

  // Opportunistic sweep so the map cannot grow without bound.
  if (buckets.size > 5_000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, limit, remaining: limit - 1, retryAfter: 0 };
  }

  existing.count += 1;
  const ok = existing.count <= limit;
  return {
    ok,
    limit,
    remaining: Math.max(0, limit - existing.count),
    retryAfter: ok ? 0 : Math.ceil((existing.resetAt - now) / 1000),
  };
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
  };
  if (!result.ok) headers['Retry-After'] = String(result.retryAfter);
  return headers;
}
