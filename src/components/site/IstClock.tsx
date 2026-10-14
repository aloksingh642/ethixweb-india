'use client';

import { useEffect, useState } from 'react';

const istFormat = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

/**
 * Live IST clock.
 *
 * The server renders the current IST time so the first paint is never blank;
 * `suppressHydrationWarning` covers the (expected) second-level drift between
 * server render and client hydration.
 */
export function IstClock({ className = '' }: { className?: string }) {
  const [time, setTime] = useState<string>(() => istFormat.format(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(istFormat.format(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={`tnum ${className}`} suppressHydrationWarning>
      {time}
    </span>
  );
}

/** Compact "open / closed" indicator against Indian business hours. */
export function OpenStatus({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => {
      // 09:30–19:00, Monday–Saturday, Asia/Kolkata.
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).formatToParts(new Date());

      const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
      const day = get('weekday');
      const minutes = Number(get('hour')) * 60 + Number(get('minute'));
      const isWeekday = day !== 'Sun';
      setOpen(isWeekday && minutes >= 570 && minutes < 1140);
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  if (open === null) return <span className={className}>IST</span>;

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="relative flex h-1.5 w-1.5">
        {open && (
          <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-jade" />
        )}
        <span
          className={`relative inline-flex h-1.5 w-1.5 rounded-full ${open ? 'bg-jade' : 'bg-ink-300'}`}
        />
      </span>
      {open ? 'Open now' : 'Opens 9:30 AM'}
    </span>
  );
}
