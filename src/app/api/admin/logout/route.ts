import { destroySession } from '@/lib/auth';
import { handle, ok } from '@/lib/api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  return handle(async () => {
    await destroySession();
    return ok({ signedOut: true });
  });
}
