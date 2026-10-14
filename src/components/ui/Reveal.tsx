'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  /** Stagger in ms. Keep it small — long delays read as jank, not polish. */
  delay?: number;
  className?: string;
  as?: ElementType;
  /** Needed for anchor targets — several sections link to `#slug`. */
  id?: string;
};

/**
 * Adds `.is-revealed` when the element scrolls into view.
 *
 * Two deliberate choices:
 *  1. The hidden state lives in CSS behind `html.js-reveal`, so without JS the
 *     content renders normally (and Lighthouse cannot score invisible text).
 *  2. One shared IntersectionObserver for the whole page rather than an
 *     observer per element — cheaper on low-end Android, which is most of
 *     India's traffic.
 */
export function Reveal({ children, delay = 0, className, as: Tag = 'div', id }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-revealed');
      return;
    }

    let observer: IntersectionObserver;

    const reduce = (window as typeof window & { __ethixRevealObserver?: IntersectionObserver })
      .__ethixRevealObserver;

    if (reduce) {
      observer = reduce;
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add('is-revealed');
            // Reveal once; never re-hide on scroll up.
            observer.unobserve(entry.target);
          }
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
      );
      (window as typeof window & { __ethixRevealObserver?: IntersectionObserver }).__ethixRevealObserver =
        observer;
    }

    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  return (
    <Tag
      ref={ref as never}
      id={id}
      data-reveal=""
      className={className}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
