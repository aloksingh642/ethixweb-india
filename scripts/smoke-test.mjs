#!/usr/bin/env node
/**
 * End-to-end smoke test of the enquiry API and the protected admin API.
 *
 *   node scripts/smoke-test.mjs            # against http://localhost:3000
 *   BASE=https://your-app.vercel.app node scripts/smoke-test.mjs
 *
 * Exercises the happy path and every rejection path: validation, honeypot,
 * time-to-submit, spam heuristics, rate limiting, auth and RBAC.
 */
import { createHmac } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = process.env.BASE ?? 'http://localhost:3000';

/**
 * The `ts` field is an HMAC of the render time keyed with ADMIN_SESSION_SECRET,
 * so this script must sign with *exactly* the secret the server verifies with.
 * Next.js loads .env.local automatically; a bare `node` process does not — so
 * we read the same file ourselves. An explicit environment variable always
 * wins, which is what you want when pointing BASE at a deployed environment
 * (in that case pass the deployed secret, not the local one).
 */
function loadEnvFiles() {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  for (const file of ['.env.local', '.env']) {
    const path = join(root, file);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue;
      // Never shadow a variable the caller set deliberately.
      if (process.env[m[1]] !== undefined) continue;
      process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}
if (!process.env.ADMIN_SESSION_SECRET) loadEnvFiles();

// Keep in sync with the fallback in src/lib/security.ts.
const SECRET = process.env.ADMIN_SESSION_SECRET ?? 'ethixweb-insecure-dev-secret-change-me';

let pass = 0;
let fail = 0;
const results = [];

function check(name, condition, detail = '') {
  if (condition) {
    pass += 1;
    results.push(`  ✓ ${name}`);
  } else {
    fail += 1;
    results.push(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

const signedTs = (ts = Date.now()) =>
  `${ts}.${createHmac('sha256', SECRET).update(String(ts)).digest('base64url')}`;

/**
 * Every request carries a `x-forwarded-for` so each section looks like a
 * different visitor. Without this the per-IP burst limiter treats the whole
 * suite as one client and starts throttling legitimate assertions.
 * (203.0.113.0/24 is the RFC 5737 documentation range.)
 */
async function post(path, body, init = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': init.ip ?? '203.0.113.1',
      ...(init.headers ?? {}),
    },
    body: JSON.stringify(body),
    redirect: 'manual',
  });
  return { status: res.status, body: await res.json().catch(() => ({})) };
}

const ip = () => `203.0.113.${1 + Math.floor(Math.random() * 253)}`;
const IP = { validation: ip(), spam: ip(), happy: ip(), flood: ip() };

async function get(path, cookie) {
  const res = await fetch(`${BASE}${path}`, {
    headers: cookie ? { cookie } : {},
    redirect: 'manual',
  });
  return { status: res.status, body: await res.json().catch(() => ({})), headers: res.headers };
}

const valid = (over = {}) => ({
  name: 'Amit Sharma',
  email: `amit+${Date.now()}@example.in`,
  phone: '+91 98290 12345',
  company: 'Sharma Foods Pvt Ltd',
  city: 'Jaipur',
  service: 'Website design & development',
  budget: '₹1,00,000 – ₹3,00,000',
  message:
    'We run a packaged foods business in Jaipur and our current site takes about seven seconds to load on mobile. We want a faster site with a proper dealer enquiry form.',
  website: '',
  ts: signedTs(Date.now() - 12_000),
  pagePath: '/contact',
  ...over,
});

console.log(`\n▶ Smoke testing ${BASE}\n`);

/* ── 1. Health ──────────────────────────────────────────────────────────── */
console.log('1. Health');
{
  const { status, body } = await get('/api/health');
  check('health returns 200', status === 200, `got ${status}`);
  check('database is up', body.database === 'up', JSON.stringify(body));
  check('using postgres backend', body.backend === 'postgres', body.backend);
  check('admin credentials configured', body.adminConfigured === true);
  check('no secrets leaked', !JSON.stringify(body).includes(SECRET));
}

/* ── 1b. Admin auth ──────────────────────────────────────────────────────── */
console.log('2. Admin auth');
let cookie = '';
{
  const noAuth = await get('/api/admin/leads');
  check('leads API rejects anonymous', noAuth.status === 401);

  const wrong = await post('/api/admin/login', { email: 'admin@ethixweb.in', password: 'wrong-password' });
  check('wrong password rejected', wrong.status === 401, `${wrong.status}`);

  const right = await post('/api/admin/login', {
    email: 'admin@ethixweb.in',
    password: 'Ethixweb@India2026',
  });
  check('correct password accepted', right.status === 200, JSON.stringify(right.body));

  const setCookie = (await fetch(`${BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ethixweb.in', password: 'Ethixweb@India2026' }),
  })).headers.get('set-cookie');
  check('session cookie is HttpOnly', Boolean(setCookie && /HttpOnly/i.test(setCookie)));
  check('session cookie is SameSite=Lax', Boolean(setCookie && /SameSite=lax/i.test(setCookie)));
  cookie = (setCookie ?? '').split(';')[0];
  check('session cookie captured', cookie.startsWith('ew_admin_session='), cookie?.slice(0, 30));
}

/* ── 2. Validation ──────────────────────────────────────────────────────── */
console.log('3. Validation');
{
  const r = await post('/api/enquiry', { name: 'A' }, { ip: IP.validation });
  check('empty payload rejected', r.status === 422, `got ${r.status}`);
  check('field errors returned', Boolean(r.body.fieldErrors?.name));

  const bad = await post('/api/enquiry', valid({ email: 'not-an-email' }), { ip: IP.validation });
  check('invalid email rejected', bad.status === 422 && Boolean(bad.body.fieldErrors?.email));

  const badPhone = await post('/api/enquiry', valid({ phone: '1234567890' }), { ip: IP.validation });
  check('non-Indian mobile rejected', badPhone.status === 422, JSON.stringify(badPhone.body));

  const goodPhone = await post('/api/enquiry', valid({ phone: '09829012345' }), { ip: IP.validation });
  check('0-prefixed mobile accepted', goodPhone.status === 201, JSON.stringify(goodPhone.body));

  const badService = await post('/api/enquiry', valid({ service: 'Free website pls' }), { ip: IP.validation });
  check('unknown service rejected', badService.status === 422);

  const shortMsg = await post('/api/enquiry', valid({ message: 'hello there' }), { ip: IP.validation });
  check('too-short message rejected', shortMsg.status === 422);
}

/* ── 3. Spam protection ─────────────────────────────────────────────────── */
console.log('4. Spam protection');
{
  // Snapshot the count so we can prove the honeypot submission was dropped.
  const before = await get('/api/admin/leads', cookie);
  const beforeCount = before.body.total ?? 0;

  const honeypot = await post('/api/enquiry', valid({ website: 'http://spam.example' }), { ip: IP.spam });
  check('honeypot submission returns success', [200, 201].includes(honeypot.status), `${honeypot.status}`);
  check('honeypot returns no real reference', !/^EW-/.test(honeypot.body.reference ?? '') || honeypot.status === 200);

  const after = await get('/api/admin/leads', cookie);
  check('honeypot entry not persisted', (after.body.total ?? 0) === beforeCount, `${beforeCount} -> ${after.body.total}`);

  const tooFast = await post('/api/enquiry', valid({ ts: signedTs(Date.now() - 300) }), { ip: IP.spam });
  check('instant submit rejected', tooFast.status === 422 && tooFast.body.code === 'TOO_FAST', JSON.stringify(tooFast.body));

  const forged = await post('/api/enquiry', valid({ ts: `${Date.now() - 60_000}.deadbeefdeadbeef` }), { ip: IP.spam });
  check('forged timestamp rejected', forged.status === 400 && forged.body.code === 'STALE_FORM');

  const stale = await post('/api/enquiry', valid({ ts: signedTs(Date.now() - 48 * 3600_000) }), { ip: IP.spam });
  check('expired form rejected', stale.status === 400 && stale.body.code === 'STALE_FORM');

  const spam = await post(
    '/api/enquiry',
    valid({
      message:
        'Great opportunity! http://a.com http://b.com http://c.com http://d.com buy cheap now limited offer',
    }),
    { ip: IP.spam },
  );
  check('link-stuffed message rejected', spam.status === 422 && spam.body.code === 'SPAM', JSON.stringify(spam.body));

  const method = await fetch(`${BASE}/api/enquiry`);
  check('GET returns 405 with Allow header', method.status === 405 && Boolean(method.headers.get('allow')));
}

/* ── 5. Happy path + admin CRUD ─────────────────────────────────────────── */
console.log('5. Enquiry + admin CRUD');
{
  const created = await post('/api/enquiry', valid(), { ip: IP.happy });
  check('valid enquiry accepted', created.status === 201, JSON.stringify(created.body));
  check('reference returned', /^EW-\d{4}-[A-Z0-9]{4}$/.test(created.body.reference ?? ''), created.body.reference);

  const list = await get('/api/admin/leads', cookie);
  check('admin can list leads', list.status === 200 && Array.isArray(list.body.leads));
  check('lead is persisted', (list.body.total ?? 0) >= 1, `total=${list.body.total}`);
  check('phone normalised to 10 digits', list.body.leads?.[0]?.phone === '9829012345', list.body.leads?.[0]?.phone);
  check('raw IP never stored', !JSON.stringify(list.body.leads?.[0]).includes('127.0.0.1'));
  check('status counts present', typeof list.body.stats?.byStatus?.new === 'number');

  const id = list.body.leads?.[0]?.id;
  const patched = await fetch(`${BASE}/api/admin/leads/${id}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ status: 'contacted', notes: 'Called, sending proposal Friday.' }),
  });
  const patchedBody = await patched.json();
  check('status update works', patched.status === 200 && patchedBody.lead?.status === 'contacted', JSON.stringify(patchedBody).slice(0, 160));

  const badPatch = await fetch(`${BASE}/api/admin/leads/${id}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ status: 'not-a-status' }),
  });
  check('invalid status rejected', badPatch.status === 422);

  const badId = await fetch(`${BASE}/api/admin/leads/not-a-uuid`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ status: 'won' }),
  });
  check('malformed id rejected', badId.status === 400);

  const events = await get(`/api/admin/leads/${id}/events`, cookie);
  check('audit trail recorded', events.status === 200 && events.body.events?.length >= 2, JSON.stringify(events.body).slice(0, 160));

  const unauthPatch = await fetch(`${BASE}/api/admin/leads/${id}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ status: 'won' }),
  });
  check('unauthenticated write blocked', unauthPatch.status === 401);

  const deleted = await fetch(`${BASE}/api/admin/leads/${id}`, { method: 'DELETE', headers: { cookie } });
  check('delete works', deleted.status === 200, `${deleted.status}`);
}

/* ── 6. Rate limiting ───────────────────────────────────────────────────── */
console.log('6. Rate limiting');
{
  const email = `flood+${Date.now()}@example.in`;
  const first = await post('/api/enquiry', valid({ email }), { ip: IP.flood });
  check('first enquiry from a new email allowed', first.status === 201, `${first.status}`);

  const second = await post('/api/enquiry', valid({ email }), { ip: IP.flood });
  check('second enquiry allowed', second.status === 201, `${second.status}`);

  const third = await post('/api/enquiry', valid({ email }), { ip: IP.flood });
  check('third enquiry from same email allowed', third.status === 201, `${third.status}`);

  const fourth = await post('/api/enquiry', valid({ email }), { ip: IP.flood });
  check('fourth enquiry throttled', fourth.status === 429, `${fourth.status} ${JSON.stringify(fourth.body)}`);
  check('throttle code is DUPLICATE', fourth.body.code === 'DUPLICATE');
  check('throttle message explains why', /already have a recent enquiry/.test(fourth.body.error ?? ''), fourth.body.error);
}

/* ── 7. Logout ──────────────────────────────────────────────────────────── */
console.log('7. Logout');
{
  const out = await post('/api/admin/logout', {});
  check('logout succeeds', out.status === 200);
}

console.log(results.join('\n'));
console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
