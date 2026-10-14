import Link from 'next/link';

import { Icon } from '@/components/ui/Icon';
import { WebMotif } from '@/components/ui/WebMotif';
import { contact } from '@/lib/content/site';
import { OpsConsole } from './OpsConsole';

/** Deliberately not fade-in animated: this is the LCP element. */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Brand spiderweb, anchored top-right, well below text contrast. */}
      <WebMotif
        className="pointer-events-none absolute -right-16 -top-24 -z-10 text-brand-200/50 sm:-right-10"
        size={420}
      />

      <div className="container-page grid items-center gap-14 py-14 sm:py-20 lg:grid-cols-12 lg:gap-10 lg:py-24">
        <div className="lg:col-span-7">
          <p className="eyebrow">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-saffron" />
            Digital operations · India
          </p>

          <h1 className="text-display mt-5 font-extrabold text-ink-950">
            We run the <span className="text-brand-500">tech.</span>
            <br />
            <span className="font-serif font-normal italic text-brand-500">You run the business.</span>
          </h1>

          <p className="lead mt-6 max-w-xl">
            A senior digital operations team for Indian businesses. Websites that load on 4G, AI
            receptionists that answer in Hindi and English, and SEO, ads and dashboards tied to
            revenue — run end to end, in your timezone.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="btn btn-primary px-6 py-3.5 text-base">
              Start a project
              <Icon name="arrow-right" size={18} />
            </Link>
            <Link href="/work" className="btn btn-ghost px-6 py-3.5 text-base">
              See our work
              <Icon name="arrow-up-right" size={18} />
            </Link>
          </div>

          <ul className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 text-[0.8125rem] text-ink-500">
            {[
              { icon: 'check', label: 'GST invoices' },
              { icon: 'check', label: 'UPI & NEFT' },
              { icon: 'check', label: 'Hindi + English' },
              { icon: 'check', label: 'Support in IST' },
            ].map((item) => (
              <li key={item.label} className="flex items-center gap-1.5">
                <Icon name={item.icon as 'check'} size={15} className="text-brand-500" />
                {item.label}
              </li>
            ))}
          </ul>

          <p className="mt-7 flex items-center gap-2 text-sm text-ink-500">
            <Icon name="phone" size={15} className="text-brand-500" />
            Or call{' '}
            <a href={contact.phoneHref} className="tnum font-semibold text-ink-900 hover:text-brand-600">
              {contact.phone}
            </a>
            <span className="text-ink-400">·</span>
            Mon–Sat, 9:30 AM – 7:00 PM IST
          </p>
        </div>

        <div className="lg:col-span-5">
          <OpsConsole />
        </div>
      </div>
    </section>
  );
}
