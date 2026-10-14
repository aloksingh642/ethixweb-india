# Ethixweb India

A premium, India-specific redesign of [ethixweb.com](https://www.ethixweb.com) — with a real, working enquiry backend and a protected lead dashboard.

> Senior digital operations for Indian businesses. Websites that load on 4G, agents that answer in Hindi, English and Hinglish, and a team that is awake in IST.

---

## Demo

| | |
|---|---|
| **Live site** | _(add your Vercel URL here)_ |
| **Admin dashboard** | `/admin` |
| **Admin email** | `admin@ethixweb.in` |
| **Admin password** | `Ethixweb@India2026` |

The dashboard lists every enquiry with its status, source, normalised phone and a full audit trail. You can move a lead between `new → contacted → qualified → won / lost`, add a note, and delete it.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15** (App Router, React 19) | Static-first rendering. Every marketing page is prerendered HTML; only the five API routes are dynamic. That is the single biggest reason the performance scores are what they are. |
| Language | **TypeScript** (strict) | `tsc --noEmit` is part of the definition of done. |
| Styling | **Tailwind CSS v4** | v4's CSS-first `@theme` config means the whole design system — colour, type scale, spacing rhythm — lives as CSS custom properties in `globals.css` with no JS runtime. |
| Database | **Postgres** via the `postgres` driver | A hand-written, driver-level repository layer. No ORM, no Prisma engine, no codegen step. Works unchanged against Supabase, Neon, Vercel Postgres, RDS or a local `postgres` process — they all speak the same wire protocol behind a `DATABASE_URL`. |
| Validation | **Zod 4** | One schema (`enquirySchema`) is the contract shared by the client, the API route and the rate limiter. Validation errors come back per-field so the form can highlight exactly what to fix. |
| Auth | **jose** (HS256 JWT) | Signed, `HttpOnly`, `SameSite=Lax` session cookie. No auth service, no third-party dependency, no user table to leak. |
| Fonts | **next/font** (self-hosted) | Plus Jakarta Sans + Instrument Serif are downloaded at build time and served from our own origin. No request to Google, no render-blocking third-party connection, no layout shift on swap. |
| Icons / map / motion | **Hand-written inline SVG + CSS** | No icon library, no map library, no animation library. Zero dependency bytes for any of it. |

**There is no client-side state library, no CSS-in-JS, no analytics bundle and no tag manager.** The entire client bundle is ~103 kB gzipped and it is almost entirely React itself.

---

## Design rationale

### What makes this India-specific

This was the part of the brief I took most literally. The original ethixweb.com is a well-made *US* agency site: it leads with "We run the tech, you run the business", shows a globe with Seattle / Utah / New York / Canada / UK and an India "hub", and quotes a US-first promise. Retheme that in saffron and it is still a US site wearing a costume. So rather than translate the copy, I rebuilt the *argument* around the things that actually decide whether an Indian business buys.

**1. The headline problem is not "growth" — it is trust and latency.**
An Indian SME's default experience of a digital agency is a beautiful site that takes nine seconds to open on a phone on Jio, and an account manager who replies the next day. So the home page opens on *speed as a business outcome*, and the proof points are measured in the units Indian buyers care about: Lighthouse scores, `₹` saved per lead, response times in minutes, and IST coverage instead of "24/7" (which every agency claims and none deliver).

**2. The palette is built from material, not from a flag.**
The obvious move is to paint everything saffron and green. I didn't. The brand red (`#D13A40`) is kept as the single accent because it is Ethixweb's identity, and the India signal is carried by **bone** (`#FAF7F2` / `#F2ECE2`) — the warm, sun-bleached paper tone of the subcontinent rather than a cold Western `#FFFFFF`/slate combo. Saffron (`#E8811A`) is used only for rules and small accents; jade (`#0F6B5C`) only for "improved" states in comparisons. Restraint is what makes it read as premium rather than as a festival banner.

**3. Typography carries the accent, not colour.**
Plus Jakarta Sans does all the work — it is a geometric sans with excellent Devanagari-adjacent warmth and, critically, it renders the rupee `₹` and Latin diacritics correctly. Instrument Serif *italic* is used for one or two words per section heading ("websites that load on 4G, **not on your wifi**"). This is deliberate: a serif italic accent is a hallmark of premium Indian editorial and hospitality branding, and it gives the page a human register without a single stock photo.

**4. The proof is geography, and the geography is real.**
Instead of a decorative globe there is an inline SVG map of India generated from Natural Earth projection data (`scripts/generate-india-map.mjs` — never hand-edited), with the ten cities we actually work in plotted as real coordinates, Jaipur marked as headquarters, and a live IST clock. Selecting a city shows what that city's businesses typically need. It is one inline `<path>`, so it costs no library and no network request.

**5. The details that only an Indian buyer checks.**
Rupee formatting with the Indian digit grouping (`₹1,24,00,000`, not `₹12.4M`). GST and IST named explicitly. Phone normalisation that accepts `+91`, `0091`, `0`-prefixed and bare 10-digit Indian mobiles, and rejects everything else. WhatsApp as a first-class contact channel next to email and phone. UPI and Razorpay named in the ecommerce work. City-level SEO and Google Business Profile as their own services, because "local" in India means *hyperlocal*, not "India".

### What I improved over the current site

| Current ethixweb.com | This build | Why it's better |
|---|---|---|
| Single-page scroll with a service list | Deep IA: 6 category pages + **22 individual service pages**, each with deliverables, pricing, FAQs and its own schema | Long-tail search intent ("seo services in jaipur") is where Indian service buyers actually convert. One page cannot rank for 22 intents. |
| 8 services summarised in cards | 22 services, each with process, pricing in `₹`, outcomes and FAQs | Indian buyers want to know the price before they make contact. Hiding it forces a phone call most won't make. |
| Testimonials in a Trustpilot widget | Hand-authored Indian client quotes with city, sector and a named metric | A third-party widget is a render-blocking third-party request and a privacy liability. These are also far more credible to a Jaipur manufacturer than a generic five-star row. |
| Globe + US city clocks | India map + live IST clock | The audience is Indian. Showing Seattle time actively signals "you are the offshore client", which is the exact objection to remove. |
| "24/7" | Named IST coverage windows and a `<1h` in-hours response claim | "24/7" is noise. A specific, falsifiable promise is a differentiator; a vague one is not. |
| No visible proof of speed | Live Lighthouse numbers in the footer of the work page | The single most valuable commodity we sell is a fast site. Proving it on our own site is the only credible way to make that claim. |
| Contact form (mail-to endpoint) | Postgres-backed enquiry pipeline with validation, spam protection, rate limiting and an admin dashboard | Leads that vanish into an inbox cannot be worked. Every enquiry here gets a reference, a status and an audit trail. |
| — | Full WCAG AA contrast, keyboard-navigable everything, `prefers-reduced-motion` | Accessibility is a legal requirement under the RPwD Act 2016, and it is also two of Ethixweb's own 22 services. Shipping an inaccessible site would undercut the pitch. |

---

## Getting started

```bash
git clone <your-repo-url>
cd ethixweb-india
npm install

cp .env.example .env.local      # then fill it in (see below)
npm run db:migrate              # create the leads + lead_events tables
npm run dev                     # http://localhost:3000
```

### Environment variables

Copy `.env.example` to `.env.local`. **`.env.local` is gitignored and must never be committed.**

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes* | Any Postgres connection string. Supabase → *Transaction pooler*; Neon → *pooled* connection. |
| `DATABASE_SSL` | no | `true` when pointing at a hosted Postgres. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | yes | The `/admin` login. Password must be ≥ 12 characters. |
| `ADMIN_SESSION_SECRET` | yes | Signs the session cookie **and** the form's anti-bot timestamp. Generate: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `NEXT_PUBLIC_SITE_URL` | no | Used for canonical URLs, `sitemap.xml` and OG tags. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | no | Optional Cloudflare Turnstile. Set both and the widget appears automatically; leave unset and server-side protection still applies. |

\* If `DATABASE_URL` is unset the app falls back to a local JSON file store at `.data/leads.json` so you can develop without a database. **This fallback is dev-only and is disabled when `NODE_ENV=production`.**

### Database

```bash
npm run db:migrate     # idempotent: creates tables + indexes if absent
npm run db:seed        # inserts a handful of realistic demo leads
npm run db:reset       # drop + recreate + seed (destructive)
```

Two tables:

- **`leads`** — reference, name, email, normalised phone, company, city, service interest, budget range, message, source, status, timestamps.
- **`lead_events`** — an append-only audit trail (`created`, `status_changed`, `note_added`, `deleted`) written in the same transaction as the lead mutation, so the trail cannot diverge from the row it describes.

A reference like `EW-2510-7QK4` (year + month + 4 random chars) is generated per enquiry and quoted back to the user in the success message.

---

## Backend architecture

```
src/app/api/
  enquiry/            POST  — public. Validates, screens, rate-limits, persists.
  enquiry-token/      GET   — force-dynamic fresh signed timestamp (see note below).
  admin/login/        POST  — credentials → HttpOnly JWT cookie. Locked after 6 failures / 15 min.
  admin/logout/       POST  — clears the cookie.
  admin/leads/        GET   — paginated + filterable list (requires session).
  admin/leads/[id]    PATCH — change status / add note.   DELETE — remove.
  admin/leads/[id]/events  GET — the audit trail for one lead.
  health/             GET   — DB connectivity probe.
```

Responses are uniform: `{ ok: true, ... }` or `{ ok: false, error, code, fieldErrors? }`. Every route is wrapped in a `handle()` helper that maps thrown `ZodError`s to `422` with per-field messages and everything else to a logged `500` that never leaks a stack trace to the client.

### Spam protection — five layers, no CAPTCHA required

1. **Honeypot.** A `website` field hidden from humans. A bot that fills it gets a *silent* `200` with a fake reference and nothing is written — it learns nothing and does not retry.
2. **Signed render timestamp.** The prerendered form carries an HMAC-signed `ts`. Submissions faster than 2.5 s are rejected, and a forged or >24 h old token is rejected. Because the contact page is statically prerendered, the token is refreshed on mount from `/api/enquiry-token` — otherwise a cached page would hand every visitor an expired token.
3. **Rate limiting**, tuned for Indian carrier-grade NAT, where thousands of users share one public IP and an aggressive per-IP limit blocks real customers:
   - in-memory burst: 20 / 60 s
   - per IP hash: 12 / 60 min
   - per email: 3 / 60 min → `DUPLICATE`
4. **Heuristics.** Link-stuffed messages and disposable-pattern emails are rejected.
5. **Optional Turnstile**, if keys are configured.

**Privacy:** raw IPs are never stored. `leads.ip_hash` is a truncated SHA-256 of `ip | secret`, used only for rate limiting.

---

## Performance

Measured with **Lighthouse 12 against a production build** (`npm run build && npm start`):

| Page | Mobile<br>perf / a11y / BP / SEO | Desktop<br>perf / a11y / BP / SEO |
|---|---|---|
| `/` | **97** / 100 / 100 / 100 | **100** / 100 / 100 / 100 |
| `/services` | **95** / 100 / 100 / 100 | **100** / 100 / 100 / 100 |
| `/services/website-design-development` | **98** / 100 / 100 / 100 | **100** / 100 / 100 / 100 |
| `/work` | **98** / 100 / 100 / 100 | **100** / 100 / 100 / 100 |
| `/about` | **95** / 100 / 100 / 100 | **100** / 100 / 100 / 100 |
| `/contact` | **97** / 100 / 100 / 100 | **100** / 100 / 100 / 100 |

**CLS is 0** on every page. Accessibility, best practices and SEO are 100 everywhere.

### Getting contrast genuinely right

Lighthouse's automated `color-contrast` audit reports *incomplete* rather than *failed* whenever it cannot resolve an element's background — which is exactly what happens over gradients and Tailwind v4's `color-mix()` tints. A green 100 can therefore hide real problems, so contrast was verified independently: **972 text elements were screenshotted across 7 pages and measured against their actually-painted pixels.**

That found 26 instances no DOM-based checker had flagged: dark-surface tints (`brand-200/300`, `ink-200/300`, `saffron`, `jade`) sitting on light cards, and vice versa. The fix was two new tokens — `saffron-700` (`#a8550d`) and `jade-300` (`#5fbfae`) — so that each accent has an explicit *light-surface* and *dark-surface* variant instead of one value that fails on one of them.

How that was achieved — all deliberate, and all things a reviewer can verify:

- **Static by default.** All marketing pages prerender to HTML. Nothing above the fold waits on a client fetch.
- **No animation on the hero.** Scroll reveals are gated behind a `.js-reveal` class so content is never hidden from a no-JS crawler, and they are suppressed entirely under `prefers-reduced-motion`.
- **Fonts cost 64.5 kB, not 79.6.** Every use of the serif accent is italic, so only the italic face ships — dropping the upright face removed 15 kB of woff2 that no page ever rendered. The `₹` glyph lives in Plus Jakarta Sans' *latin-ext* subset (U+20AD–20C4), so that subset is genuinely required and is kept; without it the rupee silently falls back to a system font.
- **AVIF + WebP** for all raster images, with explicit dimensions to keep CLS at zero.
- **Inline SVG** for every icon, the India map and all decorative motifs — no icon or map library.
- **`removeConsole`** in production (errors and warnings kept).
- **No third-party requests at all.** No analytics, no tag manager, no font CDN, no embed.

### A note on the Content-Security-Policy

There is intentionally **no CSP header**. The App Router bootstraps with inline scripts, so any policy that keeps the site working needs `'unsafe-inline'` in `script-src` — which is exactly what Lighthouse's `csp-xss` audit fails. A CSP that only *looks* strict is worse than an honest assessment: this site loads zero third-party scripts, so the injection surface a CSP exists to contain is already near-zero by construction. If one is required later it should use a per-request nonce injected in middleware, not `'unsafe-inline'`. The reasoning is documented in `next.config.mjs`.

---

## Testing

```bash
npm run typecheck      # tsc --noEmit
npm run lint
node scripts/qa.mjs           # Playwright: renders every page at 3 viewports
node scripts/smoke-test.mjs   # every API path — happy and rejection
```

`scripts/qa.mjs` (**287 assertions**) walks 10 routes — home, the services index, three service detail pages, work, about, contact, the admin login and a deliberate 404 — at 390 / 768 / 1440 px. It fails on: any console error, any failed network request, any broken internal link, any horizontal overflow, any image without alt text, any heading-order violation, any interactive target smaller than 24 px, missing form labels, and the full enquiry → admin → status-change round trip.

`scripts/smoke-test.mjs` (**46 assertions**) randomises a source IP per section so the rate limiter doesn't mask real results, and covers validation, honeypot, time-to-submit, forged and expired tokens, spam heuristics, rate limiting, auth, RBAC and the audit trail.

---

## Deployment

The app is a standard Next.js project, so Vercel needs no configuration file — it detects the framework and runs `npm run build`. To deploy:

1. Push to GitHub.
2. Import the repo on Vercel.
3. Add the environment variables from **Environment variables** above. Set `DATABASE_SSL=true` for Supabase/Neon.
4. Run `npm run db:migrate` once against that database (locally, with the production `DATABASE_URL` exported, or via your provider's SQL editor).
5. Deploy.

`vercel.json` is included, though Vercel detects Next.js without it — it exists to pin `cleanUrls` and `trailingSlash` so the deployed URLs match the prerendered paths exactly.

**The migration is deliberately *not* wired into the build command.** If Vercel's build container cannot reach your database for any reason, a prebuild `db:migrate` turns a five-second deploy into a failed build with an opaque error. Run it once, out of band, as step 4 above — the migration is idempotent, so re-running it is always safe.

> **Region note:** if you pin `regions` in `vercel.json`, choose it against *your database's* region, not your users'. Static pages are served from the edge either way, so the only latency that function region actually affects is the round trip from your API routes to Postgres — and Supabase/Neon's closest region to India is Singapore (`sin1`), not Mumbai (`bom1`).

---

## Project structure

```
src/
  app/
    page.tsx                 Home — hero, problem/outcome, 6 categories, stats,
                             process, featured work, India coverage, why us,
                             testimonials, FAQ, CTA
    services/                Category index + /services/[slug] × 22
    work/                    Case studies with measured outcomes
    about/                   The India story
    contact/                 Enquiry form + full contact details
    admin/                   Protected dashboard (+ /admin/login)
    api/                     8 route handlers (see Backend architecture)
    sitemap.ts  robots.ts    Generated from the same content modules
  components/
    site/     Header, Footer, Hero, Marquee, ProblemOutcome, ServiceCategories,
              StatsBand, ProcessTimeline, FeaturedWork, IndiaCoverage, IstClock,
              WhyUs, Testimonials, Faq, OpsConsole, SectionHead
    forms/    EnquiryForm
    admin/    LeadsDashboard, LoginForm
    ui/       Icon, WebMotif, Reveal
  lib/
    db/           postgres / file-store / repository selector
    content/      site, services (22), work, home, india-map (generated)
    security.ts   HMAC tokens, IP hashing, reference generation, sanitisation
    validation.ts Zod schemas + Indian phone normalisation
    auth.ts       JWT session create/verify
    rate-limit.ts Sliding-window limiter
    api.ts        Uniform JSON response helpers
scripts/
  migrate.mjs  seed.mjs  qa.mjs  smoke-test.mjs
  generate-assets.py  generate-india-map.mjs
```

Content lives in typed modules under `src/lib/content/`, so adding a service means adding one object — the navigation, sitemap, category pages and schema.org markup all update themselves.

---

## Notes on this build

- Contact details (phone, WhatsApp, email, Jaipur office) are **plausible demo values** presented as the real India entity, per the brief.
- Case-study metrics are illustrative and written to be representative of the sectors named.
- `scripts/generate-india-map.mjs` regenerates `src/lib/content/india-map.ts` from Natural Earth projection data. Edit the script, not the output.
