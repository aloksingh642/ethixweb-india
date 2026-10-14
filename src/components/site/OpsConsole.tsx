import Image from 'next/image';

import { Icon } from '@/components/ui/Icon';
import { IstClock, OpenStatus } from './IstClock';

const PIPELINE = [
  { label: 'New', count: 6, tone: 'bg-brand-500' },
  { label: 'Contacted', count: 4, tone: 'bg-saffron' },
  { label: 'Qualified', count: 3, tone: 'bg-terracotta' },
  { label: 'Won', count: 2, tone: 'bg-jade' },
];

const TOTAL = PIPELINE.reduce((n, p) => n + p.count, 0);

/**
 * The hero's product shot: a mock of the operations console clients actually
 * get. Pure markup and CSS — no image payload, no canvas, no hydration cost,
 * so it costs nothing on Largest Contentful Paint.
 */
export function OpsConsole() {
  return (
    <div className="relative">
      {/* Warm glow behind the card. */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-100/70 via-saffron-soft/40 to-transparent blur-2xl"
      />

      <div className="card overflow-hidden rounded-2xl">
        {/* Chrome */}
        <div className="flex items-center justify-between border-b border-ink-100 bg-bone/60 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <Image src="/brand/emblem.png" alt="" width={20} height={21} className="h-5 w-auto shrink-0" />
            <span className="text-[0.8125rem] font-semibold tracking-tight text-ink-900">
              Ethixweb Ops
            </span>
          </div>
          <div className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-400">
            <OpenStatus className="text-jade" />
          </div>
        </div>

        <div className="p-5">
          {/* Clock row */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink-400">
                Jaipur · IST
              </p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-ink-950">
                <IstClock />
              </p>
            </div>
            <p className="pb-1 text-right text-xs leading-relaxed text-ink-500">
              Mon–Sat
              <br />
              9:30 AM – 7:00 PM
            </p>
          </div>

          {/* Metric tiles */}
          <dl className="mt-5 grid grid-cols-3 gap-2.5">
            {[
              { value: '14', label: 'Enquiries today' },
              { value: '27', label: 'Calls answered' },
              { value: '47m', label: 'Median reply' },
            ].map((m) => (
              <div key={m.label} className="rounded-xl bg-bone px-3 py-3">
                <dt className="text-[0.625rem] font-semibold uppercase tracking-wide text-ink-400">
                  {m.label}
                </dt>
                <dd className="tnum mt-0.5 text-xl font-bold tracking-tight text-ink-950">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Pipeline */}
          <div className="mt-5">
            <div className="flex items-baseline justify-between">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink-400">
                Live enquiry pipeline
              </p>
              <p className="tnum text-xs font-semibold text-ink-600">{TOTAL} open</p>
            </div>

            <div className="mt-2.5 flex h-2.5 overflow-hidden rounded-full bg-ink-100">
              {PIPELINE.map((stage) => (
                <span
                  key={stage.label}
                  className={stage.tone}
                  style={{ width: `${(stage.count / TOTAL) * 100}%` }}
                />
              ))}
            </div>

            <ul className="mt-3 grid grid-cols-4 gap-2">
              {PIPELINE.map((stage) => (
                <li key={stage.label} className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${stage.tone}`} />
                  <span className="text-[0.6875rem] text-ink-500">{stage.label}</span>
                  <span className="tnum text-[0.6875rem] font-bold text-ink-900">{stage.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Activity toast */}
        <div className="border-t border-ink-100 bg-bone/60 px-5 py-3.5">
          <p className="flex items-start gap-2.5 text-xs leading-relaxed text-ink-600">
            <Icon name="whatsapp" size={15} className="mt-0.5 shrink-0 text-jade" />
            <span>
              <span className="font-semibold text-ink-900">AI answered a missed call</span> from a
              Jaipur number → appointment booked for tomorrow, 11:00 AM.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
