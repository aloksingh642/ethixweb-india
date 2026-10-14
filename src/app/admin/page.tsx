import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { LeadsDashboard } from '@/components/admin/LeadsDashboard';
import { getSession } from '@/lib/auth';
import { isDatabaseConfigured } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Lead dashboard',
  description: 'Protected area for managing Ethixweb India enquiries.',
  // Never let this surface in search results.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The page itself is the gate. Rendering happens only after a valid signed
 * session cookie is verified server-side — an unauthenticated request is
 * redirected before any lead data is ever serialised into the response.
 */
export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  return (
    <>
      {!isDatabaseConfigured() && (
        <div className="border-b border-saffron/30 bg-saffron-soft">
          <div className="container-page py-3 text-sm text-ink-800">
            <span className="font-semibold">Development mode.</span> No <code>DATABASE_URL</code> is
            set, so leads are stored in a local file. Configure Postgres before going live — see the
            README.
          </div>
        </div>
      )}
      <LeadsDashboard email={session.email} />
    </>
  );
}
