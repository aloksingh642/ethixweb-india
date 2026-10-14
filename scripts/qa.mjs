#!/usr/bin/env node
/**
 * Browser QA sweep: console errors, layout overflow, broken images, dead links,
 * and a full end-to-end run of the enquiry form into the admin dashboard.
 *
 *   node scripts/qa.mjs                 # against http://localhost:3000
 *   BASE=https://your-app.vercel.app node scripts/qa.mjs
 *
 * Screenshots land in .qa/ (gitignored).
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const SHOTS = new URL('../.qa/', import.meta.url).pathname;
mkdirSync(SHOTS, { recursive: true });

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'desktop', width: 1440, height: 900 },
];

const PAGES = [
  '/',
  '/services',
  '/services/website-design-development',
  '/services/ai-voice-receptionist',
  '/services/accessibility-remediation',
  '/work',
  '/about',
  '/contact',
  '/admin/login',
  '/does-not-exist',
];

let pass = 0;
let fail = 0;
const lines = [];
function check(name, ok, detail = '') {
  if (ok) pass += 1;
  else fail += 1;
  lines.push(`  ${ok ? '✓' : '✗'} ${name}${!ok && detail ? ` — ${detail}` : ''}`);
}

const browser = await chromium.launch();

/* ─────────────────────────── 1. Per-page audits ─────────────────────────── */
console.log(`\n▶ Auditing ${PAGES.length} pages at ${VIEWPORTS.length} viewports\n`);

/** Internal links discovered across all pages, de-duplicated. */
const internalLinks = new Set();

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(err.message));
  page.on('requestfailed', (req) =>
    failedRequests.push(`${req.url()} — ${req.failure()?.errorText ?? 'failed'}`),
  );
  page.on('response', (res) => {
    if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`);
  });

  for (const path of PAGES) {
    consoleErrors.length = 0;
    pageErrors.length = 0;
    failedRequests.length = 0;

    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 45_000 });
    // Let scroll-reveal observers settle so nothing is measured mid-transition.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);

    const label = `${vp.name} ${path}`;

    // The 404 route is expected to log its own 404; anything else is a real bug.
    const ownConsole = path === '/does-not-exist'
      ? consoleErrors.filter((e) => !/404|does-not-exist/i.test(e))
      : consoleErrors;
    check(`${label} — no console errors`, ownConsole.length === 0, ownConsole.slice(0, 2).join(' | '));
    check(`${label} — no uncaught exceptions`, pageErrors.length === 0, pageErrors.slice(0, 2).join(' | '));

    // 404 pages legitimately return 404; exclude the page's own status.
    const realFailures = path === '/does-not-exist'
      ? failedRequests.filter((r) => !r.includes('/does-not-exist'))
      : failedRequests;
    check(`${label} — no failed requests`, realFailures.length === 0, realFailures.slice(0, 2).join(' | '));

    /* Horizontal overflow */
    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      const offenders = [];
      if (de.scrollWidth > de.clientWidth + 1) {
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0) continue;
          if (r.right > de.clientWidth + 2 || r.left < -2) {
            offenders.push(
              `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? `.${el.className.split(' ').slice(0, 2).join('.')}` : ''} (right=${Math.round(r.right)})`,
            );
            if (offenders.length >= 4) break;
          }
        }
      }
      return { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, offenders };
    });
    check(
      `${label} — no horizontal scroll`,
      overflow.scrollWidth <= overflow.clientWidth + 1,
      `scrollWidth ${overflow.scrollWidth} > ${overflow.clientWidth}; ${overflow.offenders.join(', ')}`,
    );

    /* Broken images */
    const brokenImages = await page.evaluate(() =>
      [...document.querySelectorAll('img')]
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src),
    );
    check(`${label} — all images load`, brokenImages.length === 0, brokenImages.slice(0, 2).join(' | '));

    /* Accessibility basics */
    const a11y = await page.evaluate(() => {
      const imgsMissingAlt = [...document.querySelectorAll('img')].filter(
        (i) => i.getAttribute('alt') === null,
      ).length;
      const h1s = document.querySelectorAll('h1').length;
      const unnamedButtons = [...document.querySelectorAll('button')].filter(
        (b) => !b.textContent?.trim() && !b.getAttribute('aria-label'),
      ).length;
      const inputsWithoutLabel = [...document.querySelectorAll('input, select, textarea')].filter(
        (el) => {
          if (el.type === 'hidden') return false;
          if (el.getAttribute('aria-hidden') === 'true') return false;
          const id = el.getAttribute('id');
          return !el.getAttribute('aria-label') && !(id && document.querySelector(`label[for="${id}"]`));
        },
      ).length;
      return { imgsMissingAlt, h1s, unnamedButtons, inputsWithoutLabel };
    });
    check(`${label} — every img has alt`, a11y.imgsMissingAlt === 0, `${a11y.imgsMissingAlt} missing`);
    check(`${label} — exactly one h1`, a11y.h1s === 1, `found ${a11y.h1s}`);
    check(`${label} — every button named`, a11y.unnamedButtons === 0, `${a11y.unnamedButtons} unnamed`);
    check(`${label} — every input labelled`, a11y.inputsWithoutLabel === 0, `${a11y.inputsWithoutLabel} unlabelled`);

    /* Collect internal links for the crawl below. */
    const hrefs = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href')),
    );
    hrefs.forEach((h) => internalLinks.add(h.split('#')[0]));

    /* Screenshot — desktop and mobile only, to keep the set reviewable. */
    if (vp.name !== 'tablet') {
      await page.screenshot({
        path: `${SHOTS}${vp.name}${path.replace(/\//g, '_') || '_home'}.png`,
        fullPage: vp.name === 'mobile',
      });
    }
  }

  await context.close();
}

/* ─────────────────────────── 2. Link crawl ───────────────────────────────── */
console.log('▶ Crawling internal links\n');
{
  const context = await browser.newContext();
  const page = await context.newPage();
  const broken = [];
  for (const href of internalLinks) {
    if (!href || href.startsWith('/api/')) continue;
    const res = await page.request.get(`${BASE}${href}`);
    if (res.status() >= 400) broken.push(`${res.status()} ${href}`);
  }
  check(
    `all ${internalLinks.size} internal links resolve`,
    broken.length === 0,
    broken.slice(0, 5).join(' | '),
  );
  await context.close();
}

/* ──────────────────── 3. End-to-end enquiry → admin ─────────────────────── */
console.log('▶ End-to-end: enquiry form → admin dashboard\n');
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));

  const stamp = Date.now();
  const email = `qa.${stamp}@example.in`;
  // Letters only: the name field deliberately rejects digits, so a timestamped
  // name would be turned away by validation rather than testing the happy path.
  const suffix = [...crypto.getRandomValues(new Uint8Array(6))]
    .map((n) => String.fromCharCode(65 + (n % 26)))
    .join('');
  const name = `QA Test${suffix}`;

  await page.goto(`${BASE}/contact`, { waitUntil: 'networkidle' });

  // Scope every field to the enquiry form: unscoped label queries also match
  // the footer's <nav aria-label="Company">, which trips strict mode.
  const form = page.locator('form').first();

  /* Validation first: submit empty and expect field errors, not a crash. */
  await form.getByRole('button', { name: /send enquiry/i }).click();
  const validationShown = await page
    .waitForSelector('[role="alert"]', { timeout: 10_000 })
    .then(() => true)
    .catch(() => false);
  check('empty submit shows an error summary', validationShown);
  // That 422 was intentional — drop it so the later console check is meaningful.
  errors.length = 0;

  /* Fill honest details. */
  await form.getByLabel(/your name/i).fill(name);
  await form.getByLabel(/work email/i).fill(email);
  await form.getByLabel(/mobile number/i).fill('+91 98290 12345');
  await form.getByLabel(/^company/i).fill('QA Test Industries');
  await form.getByLabel(/^city/i).selectOption('Jaipur');
  await form.getByLabel(/what do you need/i).selectOption('Website design & development');
  await form.getByLabel(/^budget/i).selectOption('₹1,00,000 – ₹3,00,000');
  await form.getByLabel(/what is going on/i).fill(
    'This is an automated end-to-end test of the enquiry form. Our site is slow on mobile and we would like a faster build with a proper enquiry flow.',
  );

  // Deliberately slow: the API rejects submissions filled in under 2.5s.
  await page.waitForTimeout(3000);

  await form.getByRole('button', { name: /send enquiry/i }).click();
  try {
    await page.waitForSelector('text=Enquiry received', { timeout: 20_000 });
  } catch {
    // Surface whatever the server actually said instead of a bare timeout.
    const alertText = await page.locator('[role="alert"]').first().textContent().catch(() => null);
    const fieldErrors = await page
      .locator('p.text-brand-600')
      .allTextContents()
      .catch(() => []);
    throw new Error(
      `success state never appeared. alert=${JSON.stringify(alertText)} fieldErrors=${JSON.stringify(fieldErrors)} console=${JSON.stringify(errors.slice(0, 3))}`,
    );
  }

  const reference = await page
    .locator('text=/EW-\\d{4}-[A-Z0-9]{4}/')
    .first()
    .textContent();
  check('success state shows a reference', /EW-\d{4}-[A-Z0-9]{4}/.test(reference ?? ''), reference ?? 'none');
  check('no console errors during submission', errors.length === 0, errors.slice(0, 2).join(' | '));

  await page.screenshot({ path: `${SHOTS}e2e-contact-success.png`, fullPage: false });

  /* Now sign in and confirm the lead is there. */
  await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
  const loginForm = page.locator('form').first();
  await loginForm.getByLabel(/^email/i).fill('admin@ethixweb.in');
  await loginForm.getByLabel(/^password/i).fill('Ethixweb@India2026');
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('**/admin', { timeout: 20_000 });
  await page.waitForLoadState('networkidle');

  check('redirected to the dashboard after sign-in', page.url().endsWith('/admin'));

  // The table is populated by a client-side fetch; wait for it rather than
  // sampling the DOM the instant the route resolves.
  const ref = (reference ?? '').trim();
  const row = page.locator('li').filter({ hasText: ref }).first();
  const rowAppeared = await row
    .waitFor({ timeout: 15_000 })
    .then(() => true)
    .catch(() => false);
  check('new lead is visible in the dashboard', rowAppeared, `row for ${ref} not found`);
  check('collapsed row shows the company', (await row.textContent())?.includes('QA Test Industries') ?? false);

  /* Expand the row: the email lives in the detail panel, not the row itself. */
  await row.getByRole('button', { name: /^details$/i }).click();
  const emailShown = await page
    .waitForFunction((needle) => document.body.innerText.includes(needle), email, { timeout: 10_000 })
    .then(() => true)
    .catch(() => false);
  check('expanded detail shows the email', emailShown, 'email missing from detail panel');

  const detailText = (await row.textContent()) ?? '';
  check('detail shows the normalised phone', detailText.includes('+91 98290 12345'), detailText.slice(0, 120));
  check('detail shows the audit trail', /Enquiry received/.test(detailText));

  /* Interact: change status on the row we just verified. */
  await row.locator('select').selectOption('contacted');
  await page.waitForTimeout(1800);
  const statusApplied = await row
    .locator('select')
    .inputValue()
    .catch(() => '');
  check('status change persists', statusApplied === 'contacted', `select reads "${statusApplied}"`);
  check('no console errors during admin interaction', errors.length === 0, errors.slice(0, 2).join(' | '));

  await page.screenshot({ path: `${SHOTS}e2e-admin-dashboard.png`, fullPage: false });

  /* Sign out gates the page again. */
  await page.getByRole('button', { name: /sign out/i }).click();
  await page.waitForURL('**/admin/login', { timeout: 15_000 });
  const after = await page.request.get(`${BASE}/admin`);
  check('dashboard is gated again after sign-out', after.status() === 307 || after.url().includes('/admin/login'), `${after.status()}`);

  await context.close();
}

/* ─────────────────────── 4. Mobile navigation ───────────────────────────── */
console.log('▶ Mobile navigation\n');
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });

  const menu = page.locator('#mobile-nav');
  check('mobile menu hidden initially', !(await menu.isVisible()));

  await page.getByRole('button', { name: /open menu/i }).click();
  await page.waitForTimeout(400);
  check('mobile menu opens', await menu.isVisible());

  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  check('Escape closes the menu', !(await menu.isVisible()));

  await page.getByRole('button', { name: /open menu/i }).click();
  await page.waitForTimeout(300);
  await page.locator('#mobile-nav a[href="/services"]').click();
  await page.waitForURL('**/services', { timeout: 15_000 });
  await page.waitForTimeout(600); // pathname effect closes the menu
  check('menu link navigates and closes', page.url().endsWith('/services') && !(await menu.isVisible()));

  await context.close();
}

await browser.close();

console.log(lines.join('\n'));
console.log(`\n${pass} passed, ${fail} failed`);
console.log(`Screenshots in .qa/\n`);
process.exit(fail === 0 ? 0 : 1);
