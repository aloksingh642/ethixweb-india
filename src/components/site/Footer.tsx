import Image from 'next/image';
import Link from 'next/link';

import { Icon } from '@/components/ui/Icon';
import { contact, footerNav, nav } from '@/lib/content/site';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="surface-dark mt-24 border-t border-white/10 sm:mt-32">
      {/* ── Closing CTA band ── */}
      <div className="border-b border-white/10">
        <div className="container-page grid gap-8 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
          <div>
            <p className="eyebrow text-saffron">Let&apos;s talk</p>
            <h2 className="mt-3 text-display-sm text-white">
              Tell us what is <span className="font-serif italic text-brand-300">not working</span>.
            </h2>
            <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-ink-300">
              A 45-minute call, no pitch deck. You leave with a written summary of what we would fix
              and what it would cost — whether or not you hire us.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link href="/contact" className="btn btn-light px-6 py-3.5">
              Book a discovery call
              <Icon name="arrow-right" size={18} />
            </Link>
            <a
              href={contact.whatsappHref}
              className="btn px-6 py-3.5 text-white ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/10"
            >
              <Icon name="whatsapp" size={18} />
              WhatsApp us
            </a>
          </div>
        </div>
      </div>

      {/* ── Link columns ── */}
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Image src="/brand/emblem.png" alt="" width={30} height={31} className="h-[30px] w-auto shrink-0" />
            <Image
              src="/brand/wordmark-white.png"
              alt="Ethixweb"
              width={140}
              height={21}
              className="h-5 w-auto shrink-0"
            />
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-dim">
            A senior digital operations team for Indian businesses. Websites, AI receptionists,
            WhatsApp automation, SEO and dashboards — run end to end in IST.
          </p>

          <dl className="mt-6 space-y-2.5 text-sm">
            <div className="flex gap-3">
              <dt className="sr-only">Phone</dt>
              <Icon name="phone" size={16} className="mt-0.5 shrink-0 text-brand-400" />
              <dd>
                <a href={contact.phoneHref} className="tnum text-ink-200 transition-colors hover:text-white">
                  {contact.phone}
                </a>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="sr-only">Email</dt>
              <Icon name="mail" size={16} className="mt-0.5 shrink-0 text-brand-400" />
              <dd>
                <a href={contact.emailHref} className="text-ink-200 transition-colors hover:text-white">
                  {contact.email}
                </a>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="sr-only">Hours</dt>
              <Icon name="clock" size={16} className="mt-0.5 shrink-0 text-brand-400" />
              <dd className="text-ink-300">{contact.hours}</dd>
            </div>
          </dl>
        </div>

        {footerNav.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-ink-dim">{group.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {group.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    // /admin 307-redirects when signed out, so prefetching it
                    // just produces an aborted RSC request on every page.
                    prefetch={link.href.startsWith('/admin') ? false : undefined}
                    className="text-sm text-ink-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <nav aria-label="Pages">
          <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-ink-dim">Navigate</h3>
          <ul className="mt-4 space-y-2.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-ink-300 transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* ── Legal / India compliance strip ── */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-4 py-7 text-xs text-ink-dim sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl leading-relaxed">
            {contact.address.line1}, {contact.address.line2}, {contact.address.city}{' '}
            {contact.address.pincode}, {contact.address.state}, India
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:justify-end">
            <span className="tnum">GSTIN {contact.gstin}</span>
            <span className="tnum">CIN {contact.cin}</span>
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-ink-dim sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {contact ? 'Ethixweb Digital Operations Pvt. Ltd.' : ''} · Made in India
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>GST invoices</span>
            <span aria-hidden="true">·</span>
            <span>UPI &amp; NEFT accepted</span>
            <span aria-hidden="true">·</span>
            <span>DPDP Act 2023 ready</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
