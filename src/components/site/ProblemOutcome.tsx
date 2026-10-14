import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHead } from './SectionHead';

const PAIRS = [
  { before: 'Calls ring out during the 11 AM rush', after: 'Every call answered in under 2 seconds' },
  { before: 'The site takes 7 seconds on mobile', after: 'Sub-2-second loads on Indian 4G' },
  { before: 'Invisible on Google for your own city', after: 'Map-pack and page-one visibility' },
  { before: 'Enquiries vanish into a shared inbox', after: 'Every lead scored, routed and chased' },
  { before: 'Five vendors, five different excuses', after: 'One team accountable for the lot' },
];

/**
 * Before/after framing rather than a feature list — it names the problem the
 * visitor is already living with before offering the fix.
 */
export function ProblemOutcome() {
  return (
    <section className="container-page py-20 sm:py-24">
      <SectionHead
        eyebrow="Sound familiar?"
        title={
          <>
            The same five problems, <span className="font-serif font-normal italic text-brand-500">every time</span>.
          </>
        }
        lead="We hear these on almost every first call. All five are fixable, and usually faster than you think."
      />

      <Reveal className="mt-10 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
        {/* Header row — hidden on mobile, where each card is self-describing. */}
        <div className="hidden grid-cols-[1fr_auto_1fr] gap-4 border-b border-ink-100 bg-bone/60 px-6 py-3 sm:grid">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink-400">
            Where you are now
          </p>
          <span aria-hidden="true" className="w-8" />
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-brand-600">
            With Ethixweb
          </p>
        </div>

        <ul className="divide-y divide-ink-100">
          {PAIRS.map((pair, i) => (
            <li
              key={pair.before}
              className="grid gap-3 px-5 py-5 transition-colors hover:bg-bone/50 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4 sm:px-6"
            >
              <p className="flex items-start gap-2.5 text-[0.9375rem] text-ink-400">
                <Icon name="close" size={16} className="mt-1 shrink-0 text-ink-300" />
                <span className="line-through decoration-ink-200 decoration-1">{pair.before}</span>
              </p>

              <Icon
                name="arrow-right"
                size={18}
                className="hidden shrink-0 text-brand-300 sm:block"
              />

              <p className="flex items-start gap-2.5 text-[0.9375rem] font-medium text-ink-900">
                <Icon name="check" size={16} className="mt-1 shrink-0 text-brand-500" />
                {pair.after}
              </p>
            </li>
          ))}
        </ul>
      </Reveal>

      <p className="mt-5 text-sm text-ink-400">
        Showing {PAIRS.length} of the issues we are asked about most.
      </p>
    </section>
  );
}
