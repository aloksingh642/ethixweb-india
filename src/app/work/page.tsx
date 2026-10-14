import type { Metadata } from 'next';
import Link from 'next/link';

import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { WebMotif } from '@/components/ui/WebMotif';
import { caseStudies } from '@/lib/content/work';

export const metadata: Metadata = {
  title: 'Featured work',
  description:
    'Case studies from Ethixweb India: 71% fewer missed calls for a 14-clinic chain, 44% lower cost per qualified lead for a Jaipur developer, and checkout conversion from 0.9% to 2.6% for a D2C grocery brand.',
  alternates: { canonical: '/work' },
};

const ACCENT: Record<string, string> = {
  brand: 'text-brand-300',
  saffron: 'text-saffron',
  jade: 'text-jade',
  ink: 'text-ink-200',
};

export default function WorkPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-ink-100 bg-white">
        <WebMotif className="pointer-events-none absolute -left-24 -top-32 -z-10 text-brand-200/40" size={400} anchor="top-left" />
        <div className="container-page py-14 sm:py-20">
          <p className="eyebrow">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-saffron" />
            Featured work
          </p>
          <h1 className="text-display-sm mt-4 max-w-3xl font-extrabold text-ink-950">
            Six engagements.{' '}
            <span className="font-serif font-normal italic text-brand-500">Six numbers that moved.</span>
          </h1>
          <p className="lead mt-5 max-w-2xl">
            Every figure below comes from the client&apos;s own analytics or CRM, measured against a
            baseline we recorded before starting. No vanity metrics, no “engagement”.
          </p>
        </div>
      </section>

      <div className="container-page py-14 sm:py-20">
        {caseStudies.map((study, index) => {
          const accent = ACCENT[study.accent] ?? ACCENT.brand;
          return (
            <Reveal
              as="article"
              key={study.slug}
              id={study.slug}
              className="scroll-mt-28 border-b border-ink-100 py-12 first:pt-0 last:border-b-0 sm:py-16"
            >
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
                {/* ── Left: who + results ── */}
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
                      {study.industry}
                    </span>
                    <span className="text-xs text-ink-400">{study.city}</span>
                  </div>

                  <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
                    {study.client}
                  </h2>
                  <p className={`mt-2 text-lg font-semibold ${accent}`}>{study.headline}</p>

                  <dl className="mt-8 grid grid-cols-2 gap-4">
                    {study.results.map((result) => (
                      <div key={result.label} className="rounded-xl border border-ink-100 bg-white p-4">
                        <dd className="tnum text-2xl font-extrabold tracking-tight text-ink-950">
                          {result.value}
                        </dd>
                        <dt className="mt-1 text-xs leading-snug text-ink-500">{result.label}</dt>
                      </div>
                    ))}
                  </dl>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {study.services.map((service) => (
                      <li
                        key={service}
                        className="rounded-full bg-bone px-3 py-1 text-xs font-medium text-ink-600 ring-1 ring-inset ring-ink-100"
                      >
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ── Right: the story ── */}
                <div>
                  <div>
                    <h3 className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink-400">
                      The problem
                    </h3>
                    <p className="mt-2 text-[1.0625rem] leading-relaxed text-ink-700">
                      {study.challenge}
                    </p>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink-400">
                      What we did
                    </h3>
                    <ol className="mt-3 space-y-2.5">
                      {study.approach.map((step, i) => (
                        <li key={step} className="flex items-start gap-3">
                          <span className="tnum mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink-950 text-[0.625rem] font-bold text-white">
                            {i + 1}
                          </span>
                          <span className="text-[0.9375rem] leading-relaxed text-ink-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {study.quote && (
                    <figure className="mt-8 rounded-2xl bg-bone p-6">
                      <span aria-hidden="true" className="font-serif text-3xl leading-none text-brand-200">
                        &ldquo;
                      </span>
                      <blockquote className="mt-1 text-[0.9375rem] leading-relaxed text-ink-800">
                        {study.quote.text}
                      </blockquote>
                      <figcaption className="mt-4 text-sm">
                        <span className="font-bold text-ink-950">{study.quote.author}</span>
                        <span className="block text-ink-500">{study.quote.role}</span>
                      </figcaption>
                    </figure>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <section className="container-page pb-16 sm:pb-24">
        <Reveal className="relative overflow-hidden rounded-3xl bg-ink-950 px-6 py-12 text-center sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl"
          />
          <h2 className="section-title relative text-white">Your case study next?</h2>
          <p className="mx-auto mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-ink-300">
            We take on a small number of new engagements each quarter so that senior people stay on
            the work. Tell us what is broken and we will tell you honestly whether we can fix it.
          </p>
          <Link href="/contact" className="btn btn-light relative mt-8 px-6 py-3.5 text-base">
            Start a project
            <Icon name="arrow-right" size={18} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
