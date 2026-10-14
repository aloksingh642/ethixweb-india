import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { LoginForm } from '@/components/admin/LoginForm';
import { getSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Admin sign in',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  // Already signed in? Skip the form.
  if (await getSession()) redirect('/admin');

  return (
    <section className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="card p-7 sm:p-9">
          <p className="eyebrow">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-saffron" />
            Protected area
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink-950">Lead dashboard</h1>
          <p className="mt-2 text-sm text-ink-500">
            Sign in to view and manage enquiries from the website.
          </p>

          <div className="mt-7">
            <LoginForm />
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-ink-400">
          Trouble signing in? Ask whoever set up the dashboard for the credentials — they are
          environment variables on the server, not stored in the database.
        </p>

        <p className="mt-3 text-center text-sm">
          <Link href="/" className="text-ink-500 hover:text-brand-600">
            ← Back to ethixweb.in
          </Link>
        </p>
      </div>
    </section>
  );
}
