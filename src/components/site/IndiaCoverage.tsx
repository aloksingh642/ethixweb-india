'use client';

import { useEffect, useState } from 'react';

import { Icon } from '@/components/ui/Icon';
import { IstClock } from './IstClock';
import { INDIA_HEIGHT, INDIA_PATH, INDIA_VIEWBOX, MAP_CITIES } from '@/lib/content/india-map';

const ZONES = [
  { label: 'IST', tz: 'Asia/Kolkata', note: 'India' },
  { label: 'GST', tz: 'Asia/Dubai', note: 'Gulf' },
  { label: 'BST', tz: 'Europe/London', note: 'UK' },
  { label: 'ET', tz: 'America/New_York', note: 'US East' },
];

function formatIn(date: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

/**
 * Clocks for the regions our clients' teams sit in. Renders `--:--` until
 * mounted: the server has no way to know the visitor's own timezone, so
 * rendering times immediately would guarantee a hydration mismatch.
 */
function ZoneClocks() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <ul className="grid grid-cols-4 gap-2">
      {ZONES.map((zone) => (
        <li
          key={zone.label}
          className="rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-inset ring-white/10"
        >
          <p className="text-[0.625rem] font-bold uppercase tracking-[0.12em] text-ink-dim">
            {zone.label}
          </p>
          <p className="tnum mt-0.5 text-sm font-bold text-white" suppressHydrationWarning>
            {now ? formatIn(now, zone.tz) : '--:--'}
          </p>
          <p className="text-[0.625rem] text-ink-dim">{zone.note}</p>
        </li>
      ))}
    </ul>
  );
}

/**
 * India coverage map — the section that most clearly makes this an *India*
 * site rather than a reskinned US one.
 *
 * Replaces the original site's WebGL globe with a 1.3 KB SVG outline: no
 * three.js, no canvas, no 300 KB of geometry, and it still animates.
 * The dot-matrix fill is an SVG <pattern>, so it costs ~120 bytes.
 */
export function IndiaCoverage() {
  const [active, setActive] = useState(0);
  const city = MAP_CITIES[active];
  const cy = (c: (typeof MAP_CITIES)[number]) => (c.y / 100) * INDIA_HEIGHT;

  return (
    <section className="surface-dark overflow-hidden py-20 sm:py-24">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* ── Copy ── */}
        <div>
          <p className="eyebrow text-saffron">Coverage</p>
          <h2 className="section-title mt-3 text-white">
            Nine cities.{' '}
            <span className="font-serif font-normal italic text-brand-300">One team, one clock.</span>
          </h2>
          <div className="rule-saffron mt-5" />
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-300">
            We are headquartered in Jaipur and work with clients from Ahmedabad to Kochi. No account
            manager in another timezone, no waiting overnight for an answer — our working day is
            your working day.
          </p>

          {/* Selected-city detail */}
          <div className="mt-8 rounded-2xl bg-white/5 p-5 ring-1 ring-inset ring-white/10">
            <p className="flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-brand-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-brand-400" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-400" />
              </span>
              {city.hub ? 'Headquarters' : 'Client base'}
            </p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-white">{city.name}</p>
            <p className="mt-1 text-sm text-ink-300">{city.blurb}</p>
          </div>

          {/* City chips — the primary control on touch devices. */}
          <div className="mt-5 flex flex-wrap gap-2">
            {MAP_CITIES.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  i === active
                    ? 'bg-brand-500 text-white'
                    : 'bg-white/5 text-ink-300 ring-1 ring-inset ring-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Timezone overlap — genuinely useful for clients with overseas teams. */}
          <div className="mt-8">
            <p className="flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink-dim">
              <Icon name="clock" size={13} />
              Right now, in IST
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white">
              <IstClock />
            </p>
            <div className="mt-4">
              <ZoneClocks />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-dim">
              Working hours are 9:30 AM – 7:00 PM IST, Monday to Saturday — which overlaps the UK
              afternoon and the US East morning.
            </p>
          </div>
        </div>

        {/* ── Map ── */}
        <div className="relative mx-auto w-full max-w-[26rem] lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-full bg-brand-500/10 blur-3xl"
          />
          <svg
            viewBox={INDIA_VIEWBOX}
            className="w-full"
            role="img"
            aria-label={`Map of India showing ${MAP_CITIES.length} cities where Ethixweb works, including our Jaipur headquarters.`}
          >
            <defs>
              <pattern id="india-dot-fill" width="2.1" height="2.1" patternUnits="userSpaceOnUse">
                <circle cx="1.05" cy="1.05" r="0.5" fill="#D13A40" fillOpacity="0.55" />
              </pattern>
              <linearGradient id="india-edge" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E4696E" />
                <stop offset="100%" stopColor="#8A181C" />
              </linearGradient>
            </defs>

            <path d={INDIA_PATH} fill="url(#india-dot-fill)" stroke="url(#india-edge)" strokeWidth="0.4" />

            {MAP_CITIES.map((c, i) => {
              const isActive = i === active;
              return (
                <g key={c.name}>
                  {isActive && (
                    <circle
                      cx={c.x}
                      cy={cy(c)}
                      r="1.6"
                      fill="#E8811A"
                      fillOpacity="0.4"
                      className="svg-pulse"
                    />
                  )}
                  <circle
                    cx={c.x}
                    cy={cy(c)}
                    r={c.hub ? 1.5 : isActive ? 1.3 : 0.85}
                    fill={c.hub ? '#E8811A' : isActive ? '#FFFFFF' : '#E4696E'}
                  />
                  {/* Generous transparent hit area — 0.85 units is untappable. */}
                  <circle
                    cx={c.x}
                    cy={cy(c)}
                    r="4"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setActive(i)}
                  />
                  {(c.hub || isActive) && (
                    <text
                      x={c.x + 2.6}
                      y={cy(c) + 1.1}
                      fontSize="3.1"
                      fontWeight={c.hub ? 700 : 600}
                      fill={c.hub ? '#E8811A' : '#FFFFFF'}
                    >
                      {c.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
