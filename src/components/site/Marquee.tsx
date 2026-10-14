/**
 * Infinite service ticker.
 *
 * Pure CSS: two identical tracks inside a `w-max` flex row translated by -50%.
 * No JS, no rAF loop, no re-renders — the animation runs on the compositor.
 * The second track is `aria-hidden` so screen readers hear the list once.
 */
export function Marquee({ items }: { items: readonly string[] }) {
  return (
    <div className="relative overflow-hidden border-y border-ink-100 bg-white/70 py-4">
      {/* Edge fades, so items dissolve rather than clip. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bone to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bone to-transparent"
      />

      <div className="animate-marquee flex w-max">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 || undefined}
            className="flex shrink-0 items-center"
          >
            {items.map((item) => (
              <li key={item} className="flex items-center">
                <span className="whitespace-nowrap px-5 text-[0.9375rem] font-medium tracking-tight text-ink-400">
                  {item}
                </span>
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-brand-300" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
