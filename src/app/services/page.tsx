import type { Metadata } from 'next';
import Link from 'next/link';

import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { WebMotif } from '@/components/ui/WebMotif';
import { categories, services, serviceCount } from '@/lib/content/services';
import { servicesByCategory } from '@/lib/content/services';

export const metadata: Metadata = {
  title: 'Services',
  description: `All ${serviceCount} Ethixweb India services — website design and development, ecommerce, AI voice receptionists, WhatsApp automation, SEO, Google and Meta ads, analytics, accessibility and support. Fixed-price, INR pricing.`,
  alternates: { canonical: '/services' },
};

const ENGAGEMENTS = [
  {
    name: 'Fixed-price project',
    detail: 'One scope, one price, milestone payments. Best for website and app builds.',
    from: 'from ₹85,000',
  },
  {
    name: 'Monthly retainer',
    detail: 'Ongoing SEO, ads, support and improvement. Cancel with one month’s notice.',
    from: 'from ₹12,000/mo',
  },
  {
    name: 'Audit & roadmap',
    detail: 'A one-week deep dive that ends in a costed, prioritised plan you own outright.',
    from: 'from ₹35,000',
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-ink-100 bg-white">
        <WebMotif className="pointer-events-none absolute -right-24 -top-32 -z-10 text-brand-200/40" size={420} />
        <div className="container-page py-14 sm:py-20">
          <p className="eyebrow">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-saffron" />
            Services
          </p>
          <h1 className="text-display-sm mt-4 max-w-3xl font-extrabold text-ink-950">
            {serviceCount} services.{' '}
            <span className="font-serif font-normal italic text-brand-500">One accountable team.</span>
          </h1>
          <p className="lead mt-5 max-w-2xl">
            Everything below is delivered by the same senior team, priced in rupees and run in IST.
            Take one service, or hand us the whole operation — the handoffs are ours to manage
            either way.
          </p>

          {/* Jump nav */}
          <nav aria-label="Service categories" className="mt-9 flex flex-wrap gap-2">
            {categories.map((category) => (
              <a
                key={category.slug}
                href={`#${category.slug}`}
                className="rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              >
                {category.name}
                <span className="tnum ml-1.5 text-xs text-ink-400">
                  {servicesByCategory(category.slug).length}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* ── Categories ── */}
      {categories.map((category) => {
        const items = servicesByCategory(category.slug);
        return (
          <section
            key={category.slug}
            id={category.slug}
            className="container-page scroll-mt-28 border-b border-ink-100 py-14 last:border-b-0 sm:py-20"
          >
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p className="tnum text-xs font-bold tracking-[0.14em] text-brand-600">
                  {category.index}
                </p>
                <h2 className="section-title mt-3">{category.name}</h2>
                <div className="rule-saffron mt-4" />
                <p className="lead mt-4">{category.blurb}</p>
                <p className="mt-4 text-sm text-ink-400">
                  {items.length} service{items.length === 1 ? '' : 's'} in this group
                </p>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2">
                {items.map((service, i) => (
                  <Reveal as="li" key={service.slug} delay={i * 40}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift"
                    >
                      <h3 className="text-[1.0625rem] font-bold leading-snug tracking-tight text-ink-950">
                        {service.name}
                      </h3>
                      <p className="mt-2 flex-1 text-[0.875rem] leading-relaxed text-ink-600">
                        {service.tagline}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink-100 pt-3.5">
                        <span className="text-xs font-semibold text-ink-500">
                          {service.priceFrom}
                          <span className="ml-1 font-normal text-ink-400">
                            · {service.timeline}
                          </span>
                        </span>
                        <Icon
                          name="arrow-right"
                          size={16}
                          className="shrink-0 text-brand-500 transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      {/* ── How we price ── */}
      <section className="border-t border-ink-100 bg-white py-16 sm:py-20">
        <div className="container-page">
          <h2 className="section-title">How we price</h2>
          <div className="rule-saffron mt-5" />
          <p className="lead mt-5 max-w-2xl">
            Three ways to work with us. Everything is quoted in rupees, in writing, before anything
            starts — and GST invoices come as standard.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {ENGAGEMENTS.map((engagement, i) => (
              <Reveal key={engagement.name} delay={i * 70}>
                <div className="flex h-full flex-col rounded-2xl border border-ink-100 bg-bone p-6">
                  <p className="text-lg font-bold tracking-tight text-ink-950">{engagement.name}</p>
                  <p className="mt-2 flex-1 text-[0.875rem] leading-relaxed text-ink-600">
                    {engagement.detail}
                  </p>
                  <p className="mt-4 text-sm font-bold text-brand-600">{engagement.from}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-6 text-sm text-ink-500">
            Payment by UPI, NEFT, IMPS or card.{' '}
            <Link href="/contact" className="font-semibold text-brand-600 hover:text-brand-700">
              Ask for a fixed quote →
            </Link>
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container-page py-16 sm:py-20">
        <Reveal className="relative overflow-hidden rounded-3xl bg-ink-950 px-6 py-12 text-center sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl"
          />
          <h2 className="section-title relative text-white">
            Not sure which of these you need?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-ink-300">
            That is the most common question we get, and it is the easiest one to answer. Describe
            the problem and we will tell you what to buy — including if the answer is “nothing yet”.
          </p>
          <Link href="/contact" className="btn btn-light relative mt-8 px-6 py-3.5 text-base">
            Book a discovery call
            <Icon name="arrow-right" size={18} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
