import { Reveal } from '@/components/ui/Reveal';
import { testimonials } from '@/lib/content/home';
import { SectionHead } from './SectionHead';

export function Testimonials() {
  return (
    <section className="container-page py-20 sm:py-24">
      <SectionHead
        eyebrow="Client reviews"
        title={
          <>
            Trusted by founders{' '}
            <span className="font-serif font-normal italic text-brand-500">across India</span>.
          </>
        }
        lead="Real feedback from the people who sign the invoices."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal
            key={t.author}
            delay={i * 60}
            className={i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}
          >
            <figure className="flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
              {/* Saffron quote mark — a small India accent, not decoration for its own sake. */}
              <span aria-hidden="true" className="font-serif text-4xl leading-none text-brand-200">
                &ldquo;
              </span>
              <blockquote className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-ink-700">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 border-t border-ink-100 pt-4">
                <p className="text-sm font-bold text-ink-950">{t.author}</p>
                <p className="mt-0.5 text-[0.8125rem] text-ink-500">
                  {t.role} · {t.city}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
