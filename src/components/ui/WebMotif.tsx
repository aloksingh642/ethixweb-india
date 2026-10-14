/**
 * The Ethixweb spiderweb motif, redrawn as inline SVG.
 *
 * The original site ships a 94 KB SVG for this. Inlining a generated version
 * costs zero requests, scales cleanly, and honours currentColor.
 *
 * Geometry: radial threads from the anchor corner plus concentric arcs —
 * the same construction as the brand mark, just parameterised.
 */
type Props = {
  className?: string;
  /** Which corner the web radiates from. */
  anchor?: 'top-right' | 'bottom-left' | 'top-left';
  threads?: number;
  rings?: number;
  size?: number;
};

export function WebMotif({
  className = '',
  anchor = 'top-right',
  threads = 7,
  rings = 6,
  size = 260,
}: Props) {
  const transform = {
    'top-right': '',
    'bottom-left': 'rotate(180 100 100)',
    'top-left': 'scale(-1 1) translate(-200 0)',
  }[anchor];

  const spokes = Array.from({ length: threads }, (_, i) => {
    const t = (i + 1) / (threads + 1);
    // Sweep from straight-down to straight-left around the anchor at (200, 0).
    const x = 200 * (1 - t);
    const y = 200 * t;
    return <line key={`s${i}`} x1="200" y1="0" x2={x.toFixed(1)} y2={y.toFixed(1)} />;
  });

  const arcs = Array.from({ length: rings }, (_, i) => {
    const r = ((i + 1) / rings) * 200;
    // Quarter-arc from (200-r, 0) to (200, r).
    return (
      <path
        key={`a${i}`}
        d={`M ${(200 - r).toFixed(1)} 0 A ${r.toFixed(1)} ${r.toFixed(1)} 0 0 0 200 ${r.toFixed(1)}`}
      />
    );
  });

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <g transform={transform}>
        <g opacity="0.55">{spokes}</g>
        <g opacity="0.4">{arcs}</g>
      </g>
    </svg>
  );
}
