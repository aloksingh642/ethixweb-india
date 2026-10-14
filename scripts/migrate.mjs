#!/usr/bin/env node
/**
 * Applies db/schema.sql to DATABASE_URL.
 *
 *   npm run db:migrate            # create/ensure tables
 *   npm run db:migrate -- --drop  # destructive: drop and recreate
 *
 * Loads .env.local / .env automatically so you do not have to export anything.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/* ── minimal .env loader (no dotenv dependency needed in production) ── */
function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    const p = resolve(root, file);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (!m) continue;
      const key = m[1];
      if (process.env[key] !== undefined) continue;
      process.env[key] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}
loadEnv();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('\n✗ DATABASE_URL is not set.');
  console.error('  Add it to .env.local (see .env.example) and run again.\n');
  process.exit(1);
}

const ssl = process.env.DATABASE_SSL === 'true';
const sql = postgres(url, { ssl: ssl ? 'require' : false, max: 1, prepare: false });

const drop = process.argv.includes('--drop');
const schema = readFileSync(resolve(root, 'db/schema.sql'), 'utf8');

try {
  if (drop) {
    console.log('→ Dropping existing tables (--drop)…');
    await sql.unsafe(`
      DROP TRIGGER IF EXISTS leads_set_updated_at ON leads;
      DROP TABLE IF EXISTS lead_events;
      DROP TABLE IF EXISTS admin_login_attempts;
      DROP TABLE IF EXISTS leads;
      DROP FUNCTION IF EXISTS set_updated_at();
    `);
  }

  console.log(`→ Applying schema${ssl ? ' (SSL required)' : ''}…`);
  // DROP ... IF EXISTS emits a NOTICE when the object is absent; that noise
  // reads like a failure, so quiet it for the duration of the migration.
  await sql`SET client_min_messages = warning`;
  await sql.unsafe(schema);

  const [{ count }] = await sql`SELECT count(*)::int AS count FROM leads`;
  const tables = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' ORDER BY table_name
  `;

  console.log('\n✓ Migration complete.');
  console.log('  Tables:', tables.map((t) => t.table_name).join(', '));
  console.log(`  Leads currently stored: ${count}`);
  console.log(
    ssl || url.includes('localhost') || url.includes('127.0.0.1')
      ? ''
      : '\n  ⚠ Remote database without DATABASE_SSL=true — check your connection string.',
  );
  console.log('');
} catch (err) {
  console.error('\n✗ Migration failed:\n ', err.message, '\n');
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
