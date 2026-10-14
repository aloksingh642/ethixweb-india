import Link from 'next/link';

import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { featuredCaseStudies } from '@/lib/content/work';
import { SectionHead } from './SectionHead';

const ACCENT: Record<string, { ring: string; glow: string; text: string }> = {
  brand: { ring: 'ring-brand-500/20', glow: 'from-brand-500/25', text: 'text-brand-300' },
  saffron: { ring: 'ring-saffron/25', glow: 'from-saffron/25', text: 'text-saffron' },
  jade: { ring: 'ring-jade/25', glow: 'from-jade/25', text: 'text-jade' },
  ink: { ring: 'ring-white/15', glow: 'from-ink-400/20', text: 'text-ink-200' },
};

export function FeaturedWork() {
  return (
    <section className="container-page py-20 sm:py-24">
      <SectionHead
        eyebrow="Featured work"
        title={
          <>
            Results, not <span className="font-serif font-normal italic text-brand-500">showreels</span>.
          </>
        }
        lead="Three engagements where the numbers moved. Every figure below came from the client's own analytics or CRM, not ours."
        aside={
          <Link href="/work" className="btn btn-ghost px-5 py-3 text-sm">
            All case studies
            <Icon name="arrow-right" size={16} />
          </Link>
        }
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {featuredCaseStudies.map((study, i) => {
          const accent = ACCENT[study.accent] ?? ACCENT.brand;
          return (
            <Reveal key={study.slug} delay={i * 80}>
              <article
                className={`group relative flex h-full flex-col overflow-hidden rounded-2xl bg-ink-950 p-6 ring-1 ring-inset ${accent.ring}`}
              >
                {/* Corner glow */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${accent.glow} to-transparent blur-2xl transition-opacity duration-500 group-hover:opacity-140`}
                />

                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink-dim">
                      {study.industry}
                    </span>
                    <span className="text-[0.6875rem] text-ink-dim">{study.city}</span>
                  </div>

                  <h3 className="mt-5 text-2xl font-bold tracking-tight text-white">
                    {study.client}
                  </h3>

                  <p className={`mt-1.5 text-[0.9375rem] font-medium ${accent.text}`}>
                    {study.headline}
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-ink-dim">{study.summary}</p>

                  <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-white/10 pt-5">
                    {study.results.slice(0, 4).map((result) => (
                      <div key={result.label}>
                        <dd className="tnum text-xl font-bold tracking-tight text-white">
                          {result.value}
                        </dd>
                        <dt className="mt-0.5 text-[0.6875rem] leading-snug text-ink-dim">
                          {result.label}
                        </dt>
                      </div>
                    ))}
                  </dl>

                  <Link
                    href={`/work#${study.slug}`}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-colors hover:text-brand-300"
                  >
                    Read the case study
                    <Icon
                      name="arrow-right"
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
