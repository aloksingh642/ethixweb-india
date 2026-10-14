import { Icon, type IconName } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { whyUs } from '@/lib/content/site';
import { SectionHead } from './SectionHead';

export function WhyUs() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-page">
        <SectionHead
          eyebrow="Why Ethixweb"
          title={
            <>
              Built like an internal team,{' '}
              <span className="font-serif font-normal italic text-brand-500">not an agency</span>.
            </>
          }
          lead="Six things we do differently — and six reasons clients stop shopping around after working with us."
        />

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-ink-100 sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((item, i) => (
            <Reveal key={item.title} delay={i * 50}>
              <div className="group flex h-full flex-col bg-white p-7 transition-colors hover:bg-bone">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 transition-colors group-hover:bg-brand-500 group-hover:text-white group-hover:ring-brand-500">
                  <Icon name={item.icon as IconName} size={21} />
                </span>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-ink-950">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-600">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
