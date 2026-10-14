import type { Metadata } from 'next';

import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { WebMotif } from '@/components/ui/WebMotif';
import { contact } from '@/lib/content/site';
import { signTimestamp } from '@/lib/security';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Tell us what is broken. A senior member of the Ethixweb India team replies within one business day, during Indian working hours. Call, WhatsApp or send an enquiry.',
  alternates: { canonical: '/contact' },
};

const CHANNELS: { icon: IconName; label: string; value: string; href: string; note: string }[] = [
  {
    icon: 'phone',
    label: 'Call us',
    value: contact.phone,
    href: contact.phoneHref,
    note: 'Fastest for anything urgent',
  },
  {
    icon: 'whatsapp',
    label: 'WhatsApp',
    value: contact.whatsapp,
    href: contact.whatsappHref,
    note: 'Fastest for anything at all',
  },
  {
    icon: 'mail',
    label: 'Email',
    value: contact.email,
    href: contact.emailHref,
    note: 'Send a brief, we will send a plan',
  },
];

const NEXT_STEPS = [
  {
    step: '1',
    title: 'We read it properly',
    body: 'A senior engineer or strategist — not a sales rep — reads your enquiry and looks at what you have today.',
  },
  {
    step: '2',
    title: 'You get a real reply',
    body: 'Within one business day you hear back with an honest view: what we would fix, rough cost, and whether we are the right fit.',
  },
  {
    step: '3',
    title: '45-minute call',
    body: 'If it looks like a fit, we book a call in IST. You leave with a written summary whether or not you hire us.',
  },
];

export default function ContactPage() {
  // Signed at render time. The API uses it to reject submissions that were
  // filled in implausibly fast, and to expire abandoned pages after 24 hours.
  const ts = signTimestamp();

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink-100 bg-white">
        <WebMotif className="pointer-events-none absolute -left-20 -top-24 -z-10 text-brand-200/40" size={340} anchor="top-left" />
        <div className="container-page py-14 sm:py-20">
          <p className="eyebrow">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-saffron" />
            Contact · Jaipur, India
          </p>
          <h1 className="text-display-sm mt-4 max-w-3xl font-extrabold text-ink-950">
            Tell us what is <span className="font-serif font-normal italic text-brand-500">stuck</span>.
          </h1>
          <p className="lead mt-5 max-w-2xl">
            One form, no gatekeeping. A senior member of the team reads every enquiry and replies
            within one business day — during Indian working hours, in a language you are comfortable
            in.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-10 py-14 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        {/* ── Details ── */}
        <div>
          <Reveal>
            <ul className="grid gap-3">
              {CHANNELS.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    className="group flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 transition-colors group-hover:bg-brand-500 group-hover:text-white group-hover:ring-brand-500">
                      <Icon name={channel.icon} size={20} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-bold uppercase tracking-[0.12em] text-ink-400">
                        {channel.label}
                      </span>
                      <span className="tnum block truncate text-[1.0625rem] font-bold tracking-tight text-ink-950">
                        {channel.value}
                      </span>
                      <span className="block text-xs text-ink-500">{channel.note}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={80} className="mt-4 rounded-2xl border border-ink-100 bg-white p-5">
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink-400">Studio</h2>
            <address className="mt-3 not-italic text-[0.9375rem] leading-relaxed text-ink-700">
              {contact.address.line1}
              <br />
              {contact.address.line2}
              <br />
              {contact.address.city} {contact.address.pincode}, {contact.address.state}
              <br />
              {contact.address.country}
            </address>
            <dl className="mt-4 space-y-1.5 border-t border-ink-100 pt-4 text-sm">
              <div className="flex gap-2">
                <dt className="text-ink-400">Hours</dt>
                <dd className="text-ink-700">{contact.hours}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-ink-400">GSTIN</dt>
                <dd className="tnum text-ink-700">{contact.gstin}</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={140} className="mt-4 rounded-2xl bg-ink-950 p-5 text-ink-300">
            <p className="text-sm font-semibold text-white">Working with clients abroad?</p>
            <p className="mt-2 text-[0.875rem] leading-relaxed">
              Our day is 9:30 AM – 7:00 PM IST, which overlaps the UK afternoon and the US East
              morning. We schedule recurring calls in your window, not ours.
            </p>
          </Reveal>
        </div>

        {/* ── Form ── */}
        <div>
          <EnquiryForm ts={ts} />
        </div>
      </section>

      {/* ── What happens next ── */}
      <section className="border-t border-ink-100 bg-white py-16 sm:py-20">
        <div className="container-page">
          <h2 className="section-title">What happens next</h2>
          <div className="rule-saffron mt-5" />
          <ol className="mt-10 grid gap-5 sm:grid-cols-3">
            {NEXT_STEPS.map((item, i) => (
              <Reveal as="li" key={item.step} delay={i * 70}>
                <div className="h-full rounded-2xl bg-bone p-6">
                  <span className="tnum flex h-9 w-9 items-center justify-center rounded-full bg-ink-950 text-sm font-bold text-white">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-lg font-bold tracking-tight text-ink-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-600">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
