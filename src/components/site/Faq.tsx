import { faqs } from '@/lib/content/home';
import { SectionHead } from './SectionHead';

/**
 * Uses native <details>/<summary>: zero JavaScript, works with the keyboard,
 * and stays inside the FAQPage schema's expected structure.
 */
export function Faq() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <SectionHead
          eyebrow="Questions"
          title={
            <>
              Answered <span className="font-serif font-normal italic text-brand-500">up front</span>.
            </>
          }
          lead="The things people ask before the first call. If yours is not here, ask us directly — we answer within one business day."
        />

        <div className="divide-y divide-ink-100 border-y border-ink-100">
          {faqs.map((faq) => (
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
      </div>
    </section>
  );
}
