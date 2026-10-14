import { Reveal } from '@/components/ui/Reveal';
import { stats } from '@/lib/content/site';

export function StatsBand() {
  return (
    <section className="border-y border-ink-100 bg-bone-deep">
      <div className="container-page grid grid-cols-2 gap-px py-10 sm:py-12 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 70}>
            <div className="h-full px-2 py-4 text-center lg:text-left">
              <p className="tnum text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-sm font-semibold text-brand-600">{stat.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">{stat.detail}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
