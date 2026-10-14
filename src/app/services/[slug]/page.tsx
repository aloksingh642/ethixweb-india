import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { WebMotif } from '@/components/ui/WebMotif';
import { jsonLd } from '@/lib/jsonld';
import { getCategory, getService, services, servicesByCategory } from '@/lib/content/services';
import { siteUrl } from '@/lib/content/site';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: 'Service not found' };

  const category = getCategory(service.category);
  return {
    title: service.name,
    description: `${service.tagline} ${service.summary.slice(0, 150)}`,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.name} · Ethixweb India`,
      description: service.tagline,
      url: `/services/${service.slug}`,
      type: 'article',
    },
    keywords: [service.name, category.name, 'India', 'Ethixweb'],
  };
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const category = getCategory(service.category);
  const related = servicesByCategory(service.category)
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);
  const fallbackRelated = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const alsoConsider = related.length > 0 ? related : fallbackRelated;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.summary,
    serviceType: category.name,
    provider: { '@type': 'Organization', name: 'Ethixweb India', url: siteUrl() },
    areaServed: { '@type': 'Country', name: 'India' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: service.priceFrom.replace(/[^0-9]/g, ''),
      description: service.priceNote,
    },
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-ink-100 bg-white">
        <WebMotif
          className="pointer-events-none absolute -right-24 -top-32 -z-10 text-brand-200/35"
          size={400}
        />
        <div className="container-page py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-sm">
            <ol className="flex flex-wrap items-center gap-1.5 text-ink-400">
              <li>
                <Link href="/" className="hover:text-brand-600">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/services" className="hover:text-brand-600">
                  Services
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/services#${category.slug}`} className="hover:text-brand-600">
                  {category.name}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-ink-700" aria-current="page">
                {service.name}
              </li>
            </ol>
          </nav>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
            <div>
              <p className="eyebrow">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-saffron" />
                {category.name}
              </p>
              <h1 className="text-display-sm mt-4 font-extrabold text-ink-950">{service.name}</h1>
              <p className="lead mt-5">{service.tagline}</p>
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-600">
                {service.summary}
              </p>
            </div>

            {/* Pricing card */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-ink-100 bg-bone p-6">
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink-400">
                  Starting at
                </p>
                <p className="mt-1 text-3xl font-extrabold tracking-tight text-ink-950">
                  {service.priceFrom}
                </p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-500">
                  {service.priceNote}
                </p>

                <dl className="mt-5 space-y-3 border-t border-ink-100 pt-5 text-sm">
                  <div>
                    <dt className="text-ink-400">Typical timeline</dt>
                    <dd className="mt-0.5 font-semibold text-ink-900">{service.timeline}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-400">Best for</dt>
                    <dd className="mt-0.5 font-semibold text-ink-900">{service.bestFor}</dd>
                  </div>
                </dl>

                <Link href="/contact" className="btn btn-primary mt-6 w-full px-5 py-3 text-sm">
                  Enquire about this
                  <Icon name="arrow-right" size={16} />
                </Link>
                <p className="mt-3 text-center text-xs text-ink-400">
                  Fixed price, quoted in writing, GST invoice included.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="container-page grid gap-12 py-14 sm:py-20 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
        <div>
          {/* What you get */}
          <Reveal>
            <h2 className="section-title">What you get</h2>
            <div className="rule-saffron mt-4" />
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {service.deliverables.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 rounded-xl border border-ink-100 bg-white p-4 text-[0.9375rem] leading-relaxed text-ink-700"
                >
                  <Icon name="check" size={17} className="mt-0.5 shrink-0 text-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Outcomes */}
          <Reveal delay={60} className="mt-14">
            <h2 className="section-title">What it delivers</h2>
            <div className="rule-saffron mt-4" />
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {service.outcomes.map((outcome) => (
                <div key={outcome.label} className="rounded-2xl bg-ink-950 p-5">
                  <p className="tnum text-3xl font-extrabold tracking-tight text-white">
                    {outcome.label}
                  </p>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-300">
                    {outcome.detail}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* India note */}
          <Reveal delay={100} className="mt-14">
            <div className="relative overflow-hidden rounded-2xl border border-saffron/25 bg-saffron-soft p-6">
              <p className="flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-terracotta">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-saffron" />
                Built for India
              </p>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-800">{service.indiaNote}</p>
            </div>
          </Reveal>

          {/* FAQ */}
          <Reveal delay={140} className="mt-14">
            <h2 className="section-title">Common questions</h2>
            <div className="rule-saffron mt-4" />
            <div className="mt-7 divide-y divide-ink-100 border-y border-ink-100">
              {service.faqs.map((faq) => (
                <details key={faq.q} className="group py-1">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 text-[1.0625rem] font-semibold tracking-tight text-ink-950 transition-colors hover:text-brand-600 [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-ink-300 transition-transform duration-300 group-open:rotate-45"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </summary>
                  <p className="pb-5 pr-8 text-[0.9375rem] leading-relaxed text-ink-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>

        {/* ── Sidebar ── */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl bg-ink-950 p-6">
            <p className="text-sm font-bold text-white">Talk to a senior engineer</p>
            <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-300">
              Not a sales rep. Ask the awkward technical questions on the first call — that is what
              it is for.
            </p>
            <Link href="/contact" className="btn btn-light mt-5 w-full px-5 py-3 text-sm">
              Book a 45-minute call
              <Icon name="arrow-right" size={16} />
            </Link>
            <a
              href="https://wa.me/919829012345"
              className="btn mt-2.5 w-full px-5 py-3 text-sm text-white ring-1 ring-inset ring-white/20 hover:bg-white/10"
            >
              <Icon name="whatsapp" size={16} />
              WhatsApp us
            </a>
          </div>

          <div className="mt-4 rounded-2xl border border-ink-100 bg-white p-6">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink-400">
              Also consider
            </p>
            <ul className="mt-4 space-y-1">
              {alsoConsider.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/services/${item.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-lg py-2 text-[0.9375rem] font-medium text-ink-800 transition-colors hover:text-brand-600"
                  >
                    {item.name}
                    <Icon
                      name="arrow-right"
                      size={15}
                      className="shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500"
                    />
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/services"
              className="mt-3 inline-block border-t border-ink-100 pt-3 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              View all {services.length} services →
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
      />
    </>
  );
}
