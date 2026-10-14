import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { Icon, type IconName } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { WebMotif } from '@/components/ui/WebMotif';
import { IndiaCoverage } from '@/components/site/IndiaCoverage';
import { MAP_CITIES } from '@/lib/content/india-map';

export const metadata: Metadata = {
  title: 'About — our India story',
  description:
    'Ethixweb started as a US digital operations team. This is why we built a India practice headquartered in Jaipur — IST-first, rupee-priced, and engineered for how India actually browses.',
  alternates: { canonical: '/about' },
};

const TIMELINE = [
  {
    year: '2019',
    title: 'Ethixweb is founded',
    body: 'A small senior team in the US built to run digital operations end to end — websites, automation, search and reporting — instead of handing clients five vendors.',
  },
  {
    year: '2021',
    title: 'The first India engagements',
    body: 'Founders in Jaipur, Ahmedabad and Bengaluru started finding us. They wanted the same senior capability, but in their working hours and on payment rails their finance teams could use.',
  },
  {
    year: '2023',
    title: 'A studio in Jaipur',
    body: 'We stopped flying people in and opened an engineering studio in C-Scheme, Jaipur. Design, engineering and the support desk all moved to IST.',
  },
  {
    year: '2025',
    title: 'India becomes a practice',
    body: 'Rupee pricing, GST invoicing, UPI payments, Hindi and Hinglish agents, and a release checklist that assumes 4G and a mid-range Android phone.',
  },
  {
    year: '2026',
    title: 'Nine cities, one team',
    body: 'Clients from Kochi to Kolkata, 120+ projects delivered, and a support desk with a 47-minute median first response during Indian business hours.',
  },
];

const NUMBERS = [
  { value: '9', label: 'Cities with active clients', detail: 'Jaipur to Kochi' },
  { value: '5', label: 'Languages supported', detail: 'English, Hindi, Hinglish + regional partners' },
  { value: '78%', label: 'Of Indian web traffic is mobile', detail: 'So that is what we test on first' },
  { value: '47 min', label: 'Median first response', detail: '9:30 AM – 7:00 PM IST, Mon–Sat' },
];

const KEPT = [
  {
    title: 'Senior people on the work',
    body: 'Whoever scopes your project builds it. No junior handoff after the sales call, no account manager reading from a script.',
  },
  {
    title: 'You own everything',
    body: 'Code, design files, domain, analytics, ad accounts — all in your name from day one. Leave and you take all of it.',
  },
  {
    title: 'One accountable team',
    body: 'Website, search, ads, automation and reporting under one roof. No vendor able to blame another vendor.',
  },
  {
    title: 'Plain-language reporting',
    body: 'A monthly note that says what changed, why, and what we are doing next. Not a dashboard you never open.',
  },
];

const CHANGED = [
  {
    title: 'IST is the working day, not an accommodation',
    body: 'Answers at 6 PM on a Friday in Jaipur, not a ticket waiting twelve hours for another timezone to wake up.',
  },
  {
    title: 'Priced in rupees, invoiced under GST',
    body: 'Fixed-price quotes, milestone payments, proper tax invoices, and UPI, NEFT or card.',
  },
  {
    title: 'Engineered for Indian networks',
    body: 'Every build is tested on mid-range Android over 4G. A site that only works on a MacBook over fibre is not finished.',
  },
  {
    title: 'Built for how India actually types',
    body: 'Agents handle Hindi, English and romanised Hinglish. Forms accept the number formats people really enter.',
  },
  {
    title: 'Compliance is part of the build',
    body: 'DPDP Act 2023 data handling, TRAI-registered SMS, and accessibility aligned to the RPwD Act — included, not upsold.',
  },
  {
    title: 'Planned around the Indian calendar',
    body: 'Budgets and launches scheduled around Diwali, wedding season, Onam, Pujo and regional new years.',
  },
];

const WONT = [
  'Guarantee Google rankings. Nobody controls the algorithm, and anyone promising otherwise is lying.',
  'Lock you into a twelve-month contract to get a sensible price.',
  'Sell you a retainer for work you do not need yet. We will tell you when the answer is “not yet”.',
  'Publish AI-generated content unedited. We use it for research and outlining; humans write and edit.',
  'Hold your domain, hosting or analytics hostage. It is yours, and we hand over the keys on day one.',
];

const PRINCIPLES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'shield',
    title: 'Honest before impressive',
    body: 'If something is not worth doing, we say so — even when it costs us the project. That is the whole reason clients stop shopping around.',
  },
  {
    icon: 'signal',
    title: 'Measure what matters',
    body: 'Enquiries, qualified leads and revenue. Not impressions, not “engagement”, not a graph that only goes up because we picked it.',
  },
  {
    icon: 'layers',
    title: 'Boring and reliable',
    body: 'Documented handovers, version control, staging environments and rollback plans. Excitement is for the launch, not the process.',
  },
  {
    icon: 'key',
    title: 'Leave-able by design',
    body: 'We would rather earn your business every month than make it expensive to walk away. If it is hard to leave, it is not a partnership.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-ink-100 bg-white">
        <WebMotif className="pointer-events-none absolute -right-24 -top-32 -z-10 text-brand-200/40" size={420} />
        <div className="container-page py-14 sm:py-20">
          <p className="eyebrow">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-saffron" />
            Our India story
          </p>
          <h1 className="text-display-sm mt-4 max-w-4xl font-extrabold text-ink-950">
            We did not translate a US agency.{' '}
            <span className="font-serif font-normal italic text-brand-500">We rebuilt it here.</span>
          </h1>
          <p className="lead mt-6 max-w-2xl">
            Ethixweb began as a digital operations team in the United States. Over four years, more
            and more of the people who found us were Indian founders — and the way they needed the
            work delivered was different enough that a translated website was never going to be
            enough.
          </p>
        </div>
      </section>

      {/* ── The story ── */}
      <section className="container-page grid gap-12 py-14 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
        <div className="prose-ethix">
          <p className="text-xl leading-relaxed text-ink-800">
            The pattern was always the same. A founder in Jaipur or Ahmedabad would find us, like the
            work, and then ask three questions we could not answer properly from Seattle.
          </p>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-600">
            <span className="font-semibold text-ink-900">“Can someone call me at 6 PM my time?”</span>{' '}
            Not really — that was 5 AM for us.{' '}
            <span className="font-semibold text-ink-900">“Can you send a GST invoice and take
            UPI?”</span> No, and setting that up would have taken months.{' '}
            <span className="font-semibold text-ink-900">“Will this work on my customers&apos;
            phones?”</span> We were designing on MacBooks over fibre, and most of India browses on a
            ₹12,000 Android over 4G.
          </p>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-600">
            Those were not objections to be handled. They were a different job. So in 2023 we opened
            an engineering studio in Jaipur, moved design, engineering and support into Indian
            business hours, and started rebuilding how we deliver — rupee pricing, GST invoicing,
            agents that handle Hinglish, and a release checklist that assumes the slowest network
            our clients&apos; customers are actually on.
          </p>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-600">
            What we did not change is the part that made clients stay: senior people doing the work,
            one team accountable for the whole chain, and you owning every asset at the end. Those
            are not India-specific. They are just how it should be done.
          </p>

          <div className="mt-8 flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5">
            <Image src="/brand/emblem.png" alt="" width={44} height={46} className="h-11 w-auto shrink-0" />
            <p className="text-[0.9375rem] leading-relaxed text-ink-700">
              <span className="font-semibold text-ink-950">Ethixweb India</span> · Headquartered in
              C-Scheme, Jaipur, working with clients in {MAP_CITIES.length - 1} other cities across
              the country.
            </p>
          </div>
        </div>

        <div>
          <div className="rounded-2xl bg-ink-950 p-6">
            <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-brand-300">
              India by the numbers
            </h2>
            <dl className="mt-5 space-y-5">
              {NUMBERS.map((item) => (
                <div key={item.label}>
                  <dd className="tnum text-3xl font-extrabold tracking-tight text-white">
                    {item.value}
                  </dd>
                  <dt className="mt-1 text-sm font-semibold text-ink-200">{item.label}</dt>
                  {/* A second <dd>, not a <p>: dl children must be dt/dd only. */}
                  <dd className="mt-0.5 text-xs text-ink-dim">{item.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="border-y border-ink-100 bg-white py-16 sm:py-20">
        <div className="container-page">
          <h2 className="section-title">How we got here</h2>
          <div className="rule-saffron mt-5" />

          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {TIMELINE.map((item, i) => (
              <Reveal as="li" key={item.year} delay={i * 60}>
                <div className="relative h-full border-l-2 border-brand-100 pl-5">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-brand-500 ring-4 ring-white"
                  />
                  <p className="tnum text-sm font-bold text-brand-600">{item.year}</p>
                  <h3 className="mt-1.5 text-[1.0625rem] font-bold leading-snug tracking-tight text-ink-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-600">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Kept vs changed ── */}
      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="section-title">What we kept</h2>
            <p className="lead mt-4">
              The things that were never about geography.
            </p>
            <ul className="mt-8 space-y-3">
              {KEPT.map((item, i) => (
                <Reveal as="li" key={item.title} delay={i * 50}>
                  <div className="rounded-2xl border border-ink-100 bg-white p-5">
                    <h3 className="font-bold tracking-tight text-ink-950">{item.title}</h3>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-600">{item.body}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="section-title">What we changed</h2>
            <p className="lead mt-4">
              Everything that only made sense from Seattle.
            </p>
            <ul className="mt-8 space-y-3">
              {CHANGED.map((item, i) => (
                <Reveal as="li" key={item.title} delay={i * 50}>
                  <div className="rounded-2xl border border-saffron/25 bg-saffron-soft p-5">
                    <h3 className="font-bold tracking-tight text-ink-950">{item.title}</h3>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-700">{item.body}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Coverage map (reused) ── */}
      <IndiaCoverage />

      {/* ── Principles ── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-page">
          <h2 className="section-title">How we behave</h2>
          <div className="rule-saffron mt-5" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((principle, i) => (
              <Reveal key={principle.title} delay={i * 60}>
                <div className="h-full rounded-2xl bg-bone p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-600 ring-1 ring-inset ring-brand-100">
                    <Icon name={principle.icon} size={20} />
                  </span>
                  <h3 className="mt-4 font-bold tracking-tight text-ink-950">{principle.title}</h3>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-600">{principle.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── What we won't do ── */}
      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="section-title">What we will not do</h2>
            <div className="rule-saffron mt-5" />
            <p className="lead mt-5">
              Worth knowing before you talk to us, because most of these are standard practice
              elsewhere in the industry.
            </p>
          </div>
          <ul className="space-y-3">
            {WONT.map((item, i) => (
              <Reveal as="li" key={item} delay={i * 50}>
                <p className="flex items-start gap-3 rounded-xl border border-ink-100 bg-white p-4 text-[0.9375rem] leading-relaxed text-ink-700">
                  <Icon name="close" size={17} className="mt-0.5 shrink-0 text-brand-500" />
                  {item}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container-page pb-20">
        <Reveal className="relative overflow-hidden rounded-3xl bg-ink-950 px-6 py-12 text-center sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl"
          />
          <h2 className="section-title relative text-white">
            Come and test <span className="font-serif font-normal italic text-brand-300">all of that</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-ink-300">
            A 45-minute call, no pitch deck. You leave with a written summary of what we would fix
            and what it would cost — whether or not you hire us.
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn btn-light px-6 py-3.5 text-base">
              Book a discovery call
              <Icon name="arrow-right" size={18} />
            </Link>
            <Link
              href="/services"
              className="btn px-6 py-3.5 text-base text-white ring-1 ring-inset ring-white/20 hover:bg-white/10"
            >
              See what we do
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
