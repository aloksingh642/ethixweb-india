import Link from 'next/link';

import { Icon } from '@/components/ui/Icon';
import { WebMotif } from '@/components/ui/WebMotif';

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <WebMotif className="pointer-events-none absolute -right-20 -top-20 -z-10 text-brand-200/40" size={360} />
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="tnum text-sm font-bold tracking-[0.2em] text-brand-500">404</p>
        <h1 className="text-display-sm mt-4 max-w-xl font-extrabold text-ink-950">
          This page has gone <span className="font-serif font-normal italic text-brand-500">missing</span>.
        </h1>
        <p className="lead mt-5 max-w-md">
          The link may be old, or the page may have moved. Everything is still here — just not at
          this address.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary px-6 py-3.5 text-base">
            Back to home
            <Icon name="arrow-right" size={18} />
          </Link>
          <Link href="/services" className="btn btn-ghost px-6 py-3.5 text-base">
            Browse services
          </Link>
        </div>
      </div>
    </section>
  );
}
