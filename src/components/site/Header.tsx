'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Icon } from '@/components/ui/Icon';
import { contact, nav } from '@/lib/content/site';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  /* Hairline + shadow only after scrolling, so the hero stays clean. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close the menu on navigation and on Escape; lock scroll while open. */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      {/* India-context strip: what we are doing and when we are open. */}
      <div className="bg-ink-950 text-[11px] font-medium tracking-wide text-ink-300">
        <div className="container-page flex h-8 items-center justify-between gap-3">
          <p className="flex min-w-0 items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" />
            <span className="truncate">
              Onboarding new clients this quarter · Jaipur · {contact.hours.replace('Monday to Saturday · ', 'Mon–Sat ')}
            </span>
          </p>
          <a
            href={contact.whatsappHref}
            className="hidden shrink-0 items-center gap-1.5 text-ink-200 transition-colors hover:text-white sm:flex"
          >
            <Icon name="whatsapp" size={13} />
            <span className="tnum">{contact.whatsapp}</span>
          </a>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-shadow duration-300 ${
          scrolled
            ? 'border-b border-ink-100/80 bg-bone/85 shadow-[0_1px_20px_-12px_rgb(20_17_16/0.25)] backdrop-blur-xl'
            : 'border-b border-transparent bg-bone'
        }`}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-[70px]">
          <Link href="/" className="flex items-center gap-2.5 py-2" aria-label="Ethixweb India — home">
            <Image
              src="/brand/emblem.png"
              alt=""
              width={28}
              height={29}
              priority
              className="h-7 w-auto shrink-0"
            />
            <Image
              src="/brand/wordmark-ink.png"
              alt="Ethixweb"
              width={132}
              height={20}
              priority
              className="h-[19px] w-auto shrink-0"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`relative rounded-lg px-3.5 py-2 text-[0.9375rem] font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-brand-600'
                    : 'text-ink-600 hover:bg-ink-50 hover:text-ink-950'
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute inset-x-3.5 -bottom-px h-0.5 rounded-full bg-brand-500" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={contact.phoneHref}
              className="hidden items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-ink-600 transition-colors hover:text-brand-600 xl:flex"
            >
              <Icon name="phone" size={16} />
              <span className="tnum">{contact.phone}</span>
            </a>
            <Link href="/contact" className="btn btn-primary hidden px-4 py-2.5 text-sm sm:inline-flex">
              Start a project
              <Icon name="arrow-right" size={16} />
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink-200 text-ink-900 transition-colors hover:bg-ink-50 lg:hidden"
            >
              <Icon name={open ? 'close' : 'menu'} size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile navigation ── */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[calc(2rem+4rem)] z-40 overflow-y-auto bg-bone lg:hidden"
      >
        <nav className="container-page flex flex-col gap-1 py-6" aria-label="Mobile">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`flex items-center justify-between rounded-xl px-4 py-4 text-xl font-semibold tracking-tight transition-colors ${
                isActive(item.href)
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-900 hover:bg-ink-50'
              }`}
            >
              {item.label}
              <Icon name="arrow-up-right" size={20} className="text-ink-300" />
            </Link>
          ))}
        </nav>

        <div className="container-page pb-10">
          <Link href="/contact" className="btn btn-primary w-full py-3.5 text-base">
            Start a project
            <Icon name="arrow-right" size={18} />
          </Link>
          <div className="mt-5 grid gap-3">
            <a
              href={contact.whatsappHref}
              className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white px-4 py-3.5 text-sm font-medium text-ink-800"
            >
              <Icon name="whatsapp" size={19} className="text-jade" />
              WhatsApp {contact.whatsapp}
            </a>
            <a
              href={contact.phoneHref}
              className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white px-4 py-3.5 text-sm font-medium text-ink-800"
            >
              <Icon name="phone" size={19} className="text-brand-500" />
              Call {contact.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
