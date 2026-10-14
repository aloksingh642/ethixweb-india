import { getRepository } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { fail, handle, ok } from '@/lib/api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Audit trail for a single lead — who changed what, and when. */
export async function GET(_request: Request, ctx: Ctx) {
  return handle(async () => {
    const session = await getSession();
    if (!session) return fail('Not signed in.', 401, { code: 'UNAUTHORIZED' });

    const { id } = await ctx.params;
    if (!UUID_RE.test(id)) return fail('Invalid lead id.', 400, { code: 'BAD_ID' });

    const events = await getRepository().events(id);
    return ok({ events });
  });
}
