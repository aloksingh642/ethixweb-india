import { getRepository, isDatabaseConfigured } from '@/lib/db';
import { handle, json } from '@/lib/api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Liveness + configuration probe. Returns no secrets: only whether the pieces
 * are wired up. Useful after deploying to confirm DATABASE_URL took effect.
 */
export async function GET() {
  return handle(async () => {
    const configured = isDatabaseConfigured();
    let database: 'up' | 'unconfigured' | 'down' = 'unconfigured';

    if (configured) {
      try {
        const { total } = await getRepository().stats();
        database = Number.isInteger(total) ? 'up' : 'down';
      } catch {
        database = 'down';
      }
    }

    return json({
      ok: database !== 'down',
      database,
      backend: getRepository().kind,
      turnstile: Boolean(
        process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      ),
      adminConfigured: Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD),
      time: new Date().toISOString(),
    });
  });
}
