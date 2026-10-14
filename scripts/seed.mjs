#!/usr/bin/env node
/**
 * Seeds realistic demo leads so the admin dashboard is not empty on first run.
 *
 *   npm run db:seed
 *
 * Safe to run twice: it clears seeded rows (source = 'seed') first.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    const p = resolve(root, file);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (!m || process.env[m[1]] !== undefined) continue;
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}
loadEnv();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('\n✗ DATABASE_URL is not set. Add it to .env.local and try again.\n');
  process.exit(1);
}

const sql = postgres(url, {
  ssl: process.env.DATABASE_SSL === 'true' ? 'require' : false,
  max: 1,
  prepare: false,
});

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const LEADS = [
  {
    ref: 'EW-2609-K7Q2', name: 'Priya Raghunathan', email: 'priya@lumeninteriors.in',
    phone: '9829012345', company: 'Lumen Interiors', city: 'Bengaluru',
    service: 'Website design & development', budget: '₹1,00,000 – ₹3,00,000', status: 'won',
    message: 'We are an interior design studio in Indiranagar. Our current site is from 2019 and does not work on phones at all. We want something that shows our projects properly and gets us enquiries from people searching for interior designers in Bengaluru.',
    notes: 'Signed 12 Sep. Kickoff call done, design phase starts Monday.', days: 21,
  },
  {
    ref: 'EW-2609-M3XP', name: 'Dr. Vikram Sethi', email: 'vikram.sethi@sunrisedental.in',
    phone: '9811122233', company: 'Sunrise Dental Care', city: 'Jaipur',
    service: 'AI voice receptionist', budget: 'Monthly retainer', status: 'proposal',
    message: 'We have three clinics in Jaipur and miss a lot of calls between 1pm and 3pm when the receptionist is at lunch. Looking for something that can answer in Hindi and book appointments directly into our calendar.',
    notes: 'Proposal sent 3 Oct. Following up Thursday.', days: 9,
  },
  {
    ref: 'EW-2610-B8LN', name: 'Farhan Qureshi', email: 'farhan@zayeka.in',
    phone: '9933344455', company: 'Zayeka Foods', city: 'Hyderabad',
    service: 'Ecommerce development', budget: '₹3,00,000 – ₹8,00,000', status: 'qualified',
    message: 'We sell packaged biryani masala and ready-to-cook kits. Currently only on marketplaces which take 25% commission. Want our own store with UPI and COD, and we need pin-code based delivery checks before checkout.',
    notes: 'Good fit. Needs RTO reduction advice too.', days: 6,
  },
  {
    ref: 'EW-2610-R4JV', name: 'Anjali Deshpande', email: 'anjali@northstarlogistics.co.in',
    phone: '9822244455', company: 'NorthStar Logistics', city: 'Pune',
    service: 'Workflow automation', budget: '₹3,00,000 – ₹8,00,000', status: 'contacted',
    message: 'Our operations team copies data between Tally, three Excel sheets and email about 300 times a day. It is slow and errors are constant. We want this automated without replacing Tally, which our accountant will not give up.',
    notes: 'Discovery call booked Tue 11am.', days: 4,
  },
  {
    ref: 'EW-2610-T9WD', name: 'Rahul Menon', email: 'rahul@greenleafaqua.com',
    phone: '9944455566', company: 'GreenLeaf Aquaponics', city: 'Kochi',
    service: 'SEO', budget: '₹1,00,000 – ₹3,00,000', status: 'new',
    message: 'We manufacture aquaponics systems for commercial farms. We get almost all our business through word of mouth and have zero online presence. We want to be found when people search for commercial aquaponics in Kerala.',
    notes: null, days: 2,
  },
  {
    ref: 'EW-2610-H2ZC', name: 'Sneha Agarwal', email: 'sneha@brightpath.edu.in',
    phone: '9955566677', company: 'BrightPath Academy', city: 'Delhi NCR',
    service: 'WhatsApp automation', budget: 'Monthly retainer', status: 'new',
    message: 'We run test prep coaching for Class 11 and 12. Parents enquire on WhatsApp, on the website, through Justdial and by phone. Everything lands in different places and we lose track. Need one system.',
    notes: null, days: 1,
  },
  {
    ref: 'EW-2610-P6YM', name: 'Imran Shaikh', email: 'imran@shaikhtextiles.in',
    phone: '9966677788', company: 'Shaikh Textiles', city: 'Mumbai',
    service: 'Google Ads', budget: '₹1,00,000 – ₹3,00,000', status: 'new',
    message: 'We have been running Google Ads for eight months through a freelancer. We get lots of clicks and very few serious buyers. Our cost per enquiry is around ₹1,800 which feels too high for our margins.',
    notes: null, days: 1,
  },
  {
    ref: 'EW-2609-C5TK', name: 'Meera Krishnan', email: 'meera@serenespaclinic.in',
    phone: '9977788899', company: 'Serene Skin Clinic', city: 'Chennai',
    service: 'Local SEO & Google Business Profile', budget: 'Under ₹1,00,000', status: 'qualified',
    message: 'We have two clinics in Chennai. A competitor has stuffed keywords into their Google Business name and outranks us for every search. We also have three duplicate listings we cannot remove.',
    notes: 'Duplicate listing issue is very winnable.', days: 11,
  },
  {
    ref: 'EW-2609-J8VB', name: 'Amit Trivedi', email: 'amit@trivedisteel.co.in',
    phone: '9988899900', company: 'Trivedi Steel Works', city: 'Ahmedabad',
    service: 'Website design & development', budget: '₹1,00,000 – ₹3,00,000', status: 'lost',
    message: 'Looking for a new website for our steel fabrication business. We supply to construction companies across Gujarat and want a proper product catalogue with specifications.',
    notes: 'Went with a local agency on price. Keep in touch for Q1.', days: 25,
  },
  {
    ref: 'EW-2608-F1XR', name: 'Nandini Bose', email: 'nandini@kolkataclay.in',
    phone: '9900011122', company: 'Kolkata Clay Studio', city: 'Kolkata',
    service: 'Meta & Instagram Ads', budget: 'Under ₹1,00,000', status: 'won',
    message: 'We sell handmade ceramics online and through our studio. Instagram is where our customers are but we have never run paid ads. We want to start small and see if it works before committing more.',
    notes: 'Started at ₹15k/mo, now at ₹40k/mo. ROAS 3.4x.', days: 34,
  },
  {
    ref: 'EW-2610-D3NQ', name: 'Gaurav Bhatia', email: 'gaurav@fintrustcredit.in',
    phone: '9812345678', company: 'FinTrust Credit', city: 'Mumbai',
    service: 'Accessibility audit', budget: '₹3,00,000 – ₹8,00,000', status: 'contacted',
    message: 'We are an NBFC and our compliance team has flagged accessibility gaps in our loan application flow. We need an audit against WCAG 2.2 that will satisfy an RBI-facing review, and then help fixing it.',
    notes: 'Also needs DPDP consent review. Scheduling audit.', days: 3,
  },
  {
    ref: 'EW-2609-V7GH', name: 'Sunita Rao', email: 'sunita@pragatiskills.in',
    phone: '9823456789', company: 'Pragati Skills', city: 'Bengaluru',
    service: 'Analytics & GA4', budget: '₹1,00,000 – ₹3,00,000', status: 'proposal',
    message: 'We spend about six lakh a month across Google, Meta and education portals. Nobody can tell me which channel produces students who actually enrol. I need proper tracking before we plan next year.',
    notes: 'Proposal sent. Includes offline conversion import.', days: 14,
  },
];

try {
  // Remove any previous seed rows (and their audit trail via the FK).
  await sql`DELETE FROM leads WHERE source = 'seed'`;
  console.log('→ Cleared previous seed rows');

  for (const lead of LEADS) {
    const created = daysAgo(lead.days);
    const [row] = await sql`
      INSERT INTO leads (
        reference, name, email, phone, company, city, service, budget, message,
        status, notes, source, page_path, ip_hash, user_agent, created_at
      ) VALUES (
        ${lead.ref}, ${lead.name}, ${lead.email}, ${lead.phone}, ${lead.company},
        ${lead.city}, ${lead.service}, ${lead.budget}, ${lead.message},
        ${lead.status}, ${lead.notes}, 'seed', '/contact', NULL, 'seed-script', ${created}
      )
      RETURNING id, reference
    `;

    await sql`
      INSERT INTO lead_events (lead_id, kind, to_value, actor, created_at)
      VALUES (${row.id}, 'created', ${lead.service}, NULL, ${created})
    `;
    if (lead.notes) {
      await sql`
        INSERT INTO lead_events (lead_id, kind, to_value, actor, created_at)
        VALUES (${row.id}, 'note', ${lead.notes}, 'admin@ethixweb.in', ${daysAgo(Math.max(0, lead.days - 1))})
      `;
    }
  }

  const [{ count }] = await sql`SELECT count(*)::int AS count FROM leads`;
  console.log(`✓ Seeded ${LEADS.length} demo leads. Total rows now: ${count}\n`);
} catch (err) {
  console.error('\n✗ Seed failed:\n ', err.message, '\n');
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
