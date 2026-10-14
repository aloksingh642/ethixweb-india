'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { Icon } from '@/components/ui/Icon';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Reported without dumping the raw error into the UI.
    console.error('[app] unhandled error', { digest: error.digest, message: error.message });
  }, [error]);

  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Icon name="alert" size={26} />
      </span>
      <h1 className="text-display-sm mt-6 max-w-xl font-extrabold text-ink-950">
        Something went wrong on our side.
      </h1>
      <p className="lead mt-5 max-w-md">
        The page hit an unexpected error. Trying again usually sorts it — if not, call us on{' '}
        <a href="tel:+919829012345" className="font-semibold text-brand-600">
          +91 98290 12345
        </a>{' '}
        and we will fix it.
      </p>
      {error.digest && (
        <p className="tnum mt-3 text-xs text-ink-400">Reference: {error.digest}</p>
      )}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button onClick={reset} className="btn btn-primary px-6 py-3.5 text-base">
          Try again
          <Icon name="arrow-right" size={18} />
        </button>
        <Link href="/" className="btn btn-ghost px-6 py-3.5 text-base">
          Back to home
        </Link>
      </div>
    </section>
  );
}
