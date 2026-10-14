import type { SVGProps } from 'react';

/**
 * Hand-rolled 24×24 stroke icon set on `currentColor`.
 *
 * Deliberately not an icon library: pulling in lucide/heroicons would ship
 * hundreds of unused glyph definitions for the eight we actually use.
 */
export type IconName =
  | 'arrow-right'
  | 'arrow-up-right'
  | 'check'
  | 'chevron-down'
  | 'clock'
  | 'close'
  | 'key'
  | 'layers'
  | 'mail'
  | 'menu'
  | 'phone'
  | 'search'
  | 'shield'
  | 'signal'
  | 'spark'
  | 'trash'
  | 'whatsapp'
  | 'trending-up'
  | 'logout'
  | 'alert';

const PATHS: Record<IconName, React.ReactNode> = {
  'arrow-right': <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />,
  'arrow-up-right': <path d="M7 17 17 7m0 0H8m9 0v9" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  'chevron-down': <path d="m5 9 7 7 7-7" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  key: (
    <>
      <circle cx="8" cy="12" r="4" />
      <path d="m11.5 14.5 8 8m-3.5 0h3.5v-3.5" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
      <path d="m3.5 12.5 8.5 4.5 8.5-4.5" />
      <path d="m3.5 17 8.5 4.5 8.5-4.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m3.8 7 7.3 5.4a1.5 1.5 0 0 0 1.8 0L20.2 7" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  phone: (
    <path d="M7.5 3.5h1.9l1.6 4-2 1.4a11 11 0 0 0 5.1 5.1l1.4-2 4 1.6v1.9a3.5 3.5 0 0 1-3.9 3.5A15.5 15.5 0 0 1 4 7.4a3.5 3.5 0 0 1 3.5-3.9Z" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7.5 3v5.5c0 4.5-3 7.9-7.5 9.5-4.5-1.6-7.5-5-7.5-9.5V6L12 3Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </>
  ),
  signal: (
    <>
      <path d="M4 20V14" />
      <path d="M9.3 20V9" />
      <path d="M14.7 20v-6" />
      <path d="M20 20V4" />
    </>
  ),
  spark: (
    <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z" />
  ),
  trash: (
    <>
      <path d="M4.5 7h15" />
      <path d="M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7" />
      <path d="M6.5 7l.9 11.1A1.5 1.5 0 0 0 8.9 19.5h6.2a1.5 1.5 0 0 0 1.5-1.4L17.5 7" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M20.5 11.6a8.4 8.4 0 0 1-12.3 7.4L3.5 20.5l1.5-4.6A8.4 8.4 0 1 1 20.5 11.6Z" />
      <path d="M8.9 9.2c.2-.5.5-.5.8-.5h.6c.3 0 .6 0 .8.6l.7 1.7c.1.4 0 .7-.2.9l-.5.6c-.2.2-.3.4-.1.7a6.6 6.6 0 0 0 2.9 2.5c.3.2.6.1.8-.1l.6-.7c.2-.3.5-.3.9-.2l1.7.8c.4.2.6.5.5.8-.2 1.6-1.2 2.2-2.4 2.3-1.3.1-4.6-.8-6.4-4.2-.6-1-1-2.1-1-3.2 0-.7.3-1.3.8-1.8Z" />
    </>
  ),
  'trending-up': (
    <>
      <path d="m3.5 16.5 5.5-5.5 3.5 3.5 7.5-7.5" />
      <path d="M15 7h5v5" />
    </>
  ),
  logout: (
    <>
      <path d="M14 4.5h3a2.5 2.5 0 0 1 2.5 2.5v10a2.5 2.5 0 0 1-2.5 2.5h-3" />
      <path d="M10 8 6.5 11.5 10 15" />
      <path d="M6.5 11.5H16" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4.5 21 19.5H3L12 4.5Z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" />
    </>
  ),
};

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  /** Rendered box size in px. Defaults to 20. */
  size?: number;
};

export function Icon({ name, size = 20, strokeWidth = 1.8, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
