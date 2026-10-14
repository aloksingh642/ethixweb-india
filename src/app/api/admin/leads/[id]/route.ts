import { getRepository } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { leadPatchSchema } from '@/lib/validation';
import { fail, handle, ok, readJson } from '@/lib/api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PATCH(request: Request, ctx: Ctx) {
  return handle(async () => {
    const session = await getSession();
    if (!session) return fail('Not signed in.', 401, { code: 'UNAUTHORIZED' });

    const { id } = await ctx.params;
    if (!UUID_RE.test(id)) return fail('Invalid lead id.', 400, { code: 'BAD_ID' });

    const body = await readJson(request);
    const parsed = leadPatchSchema.safeParse(body);
    if (!parsed.success) {
      return fail('Provide a valid status or note.', 422, { code: 'VALIDATION' });
    }

    const repo = getRepository();
    const lead = await repo.update(id, parsed.data, session.email);
    if (!lead) return fail('Lead not found.', 404, { code: 'NOT_FOUND' });

    return ok({ lead });
  });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  return handle(async () => {
    const session = await getSession();
    if (!session) return fail('Not signed in.', 401, { code: 'UNAUTHORIZED' });

    const { id } = await ctx.params;
    if (!UUID_RE.test(id)) return fail('Invalid lead id.', 400, { code: 'BAD_ID' });

    const repo = getRepository();
    const removed = await repo.remove(id, session.email);
    if (!removed) return fail('Lead not found.', 404, { code: 'NOT_FOUND' });

    return ok({ deleted: id });
  });
}
