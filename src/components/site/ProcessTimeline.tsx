import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { processSteps } from '@/lib/content/site';
import { SectionHead } from './SectionHead';

/**
 * Numbered horizontal timeline on desktop, a single rail on mobile.
 * The rail is drawn with a pseudo-element-free absolute span so it collapses
 * cleanly at the breakpoint instead of leaving a dangling vertical line.
 */
export function ProcessTimeline() {
  return (
    <section className="container-page py-20 sm:py-24">
      <SectionHead
        eyebrow="How we work"
        title={
          <>
            Five steps, no <span className="font-serif font-normal italic text-brand-500">mystery</span>.
          </>
        }
        lead="You always know what is happening, what is next, and what it costs. No 90-slide decks, no disappearing for three weeks."
      />

      <ol className="relative mt-12 grid gap-4 lg:grid-cols-5">
        {/* Connecting rail — desktop only. */}
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 top-[3.25rem] hidden h-px bg-gradient-to-r from-ink-100 via-ink-200 to-ink-100 lg:block"
        />

        {processSteps.map((step, i) => (
          <Reveal as="li" key={step.step} delay={i * 70} className="relative">
            <div className="flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="tnum flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-950 text-[0.8125rem] font-bold text-white">
                  {step.step}
                </span>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-brand-700">
                  {step.duration}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold tracking-tight text-ink-950">{step.title}</h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-600">{step.body}</p>

              <ul className="mt-4 space-y-1.5 border-t border-ink-100 pt-4">
                {step.outputs.map((output) => (
                  <li key={output} className="flex items-start gap-2 text-[0.8125rem] text-ink-500">
                    <Icon name="check" size={13} className="mt-1 shrink-0 text-brand-500" />
                    {output}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
