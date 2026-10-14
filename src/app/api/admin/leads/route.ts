import { getRepository } from '@/lib/db';
import { getSession } from '@/lib/auth';
import type { LeadFilters } from '@/lib/db/types';
import { LEAD_STATUSES } from '@/lib/db/types';
import { fail, handle, ok } from '@/lib/api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return handle(async () => {
    const session = await getSession();
    if (!session) return fail('Not signed in.', 401, { code: 'UNAUTHORIZED' });

    const url = new URL(request.url);
    const statusParam = url.searchParams.get('status') ?? 'all';
    const status = (LEAD_STATUSES as readonly string[]).includes(statusParam)
      ? (statusParam as LeadFilters['status'])
      : 'all';

    const limit = Number(url.searchParams.get('limit') ?? 25);
    const offset = Number(url.searchParams.get('offset') ?? 0);

    const repo = getRepository();
    const [list, stats] = await Promise.all([
      repo.list({
        status,
        q: url.searchParams.get('q') ?? undefined,
        limit: Number.isFinite(limit) ? limit : 25,
        offset: Number.isFinite(offset) ? offset : 0,
      }),
      repo.stats(),
    ]);

    return ok(
      {
        leads: list.rows,
        total: list.total,
        stats,
        backend: repo.kind,
      },
      200,
    );
  });
}
