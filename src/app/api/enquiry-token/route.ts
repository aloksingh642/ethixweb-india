import { signTimestamp } from '@/lib/security';
import { json } from '@/lib/api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Issues a fresh signed "form rendered at" timestamp.
 *
 * The contact page is statically prerendered for speed, which means the token
 * baked into its HTML is only as fresh as the last build. The browser swaps it
 * for a fresh one on mount so the time-to-submit check measures the real user
 * rather than the deploy — and so the form still works a month after launch.
 */
export async function GET() {
  return json({ ts: signTimestamp() }, { status: 200 });
}
