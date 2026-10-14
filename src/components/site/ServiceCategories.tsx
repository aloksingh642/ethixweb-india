import Link from 'next/link';

import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { categories, services, serviceCount } from '@/lib/content/services';
import { SectionHead } from './SectionHead';

export function ServiceCategories() {
  return (
    <section id="services" className="scroll-mt-28 bg-white py-20 sm:py-24">
      <div className="container-page">
        <SectionHead
          eyebrow={`${serviceCount} services, one team`}
          title={
            <>
              Everything your digital operation needs,{' '}
              <span className="font-serif font-normal italic text-brand-500">under one roof</span>.
            </>
          }
          lead="From the website to the AI that answers your phone to the dashboard that tells you which channel is working. Pick one, or hand us the lot."
          aside={
            <Link href="/services" className="btn btn-dark px-5 py-3 text-sm">
              See all {serviceCount} services
              <Icon name="arrow-right" size={16} />
            </Link>
          }
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => {
            const count = services.filter((s) => s.category === category.slug).length;
            return (
              <Reveal key={category.slug} delay={i * 60}>
                <Link
                  href={`/services#${category.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-ink-100 bg-bone p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-white hover:shadow-lift"
                >
                  <div className="flex items-start justify-between">
                    <span className="tnum text-xs font-bold tracking-[0.14em] text-brand-300">
                      {category.index}
                    </span>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[0.6875rem] font-semibold text-ink-500 ring-1 ring-inset ring-ink-100">
                      {count} service{count === 1 ? '' : 's'}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-bold tracking-tight text-ink-950">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">
                    {category.blurb}
                  </p>

                  <p className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-semibold text-brand-600 transition-colors group-hover:text-brand-700">
                    Explore {category.name.toLowerCase()}
                    <Icon
                      name="arrow-right"
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
