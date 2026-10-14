-- ─────────────────────────────────────────────────────────────────────────────
-- Ethixweb India — Postgres schema
-- Works unmodified on Postgres 13+, Supabase, Neon and Vercel Postgres.
-- Run:  npm run db:migrate
-- ─────────────────────────────────────────────────────────────────────────────

-- gen_random_uuid() is built in from Postgres 13. On older servers run
-- `CREATE EXTENSION IF NOT EXISTS pgcrypto;` once instead.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS leads (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Human-quotable reference shown in the UI and in emails, e.g. EW-2510-7QK4
  reference     text        NOT NULL UNIQUE,

  name          text        NOT NULL,
  email         text        NOT NULL,
  phone         text        NOT NULL,
  company       text,
  city          text,
  service       text        NOT NULL,
  budget        text,
  message       text        NOT NULL,

  status        text        NOT NULL DEFAULT 'new',
  notes         text,

  -- Provenance / spam triage
  source        text        NOT NULL DEFAULT 'website',
  page_path     text,
  ip_hash       text,              -- SHA-256 of IP + salt. We never store raw IPs.
  user_agent    text,
  referrer      text,

  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Guard status at the database layer, not just in the app.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'leads_status_check'
  ) THEN
    ALTER TABLE leads
      ADD CONSTRAINT leads_status_check
      CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost'));
  END IF;
END $$;

-- Indexes that match the actual admin queries: newest first, filtered by status,
-- searched by text, and rate-limited by ip_hash over a recent window.
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_created_idx ON leads (status, created_at DESC);
CREATE INDEX IF NOT EXISTS leads_ip_created_idx ON leads (ip_hash, created_at DESC);
CREATE INDEX IF NOT EXISTS leads_email_created_idx ON leads (email, created_at DESC);

-- ── Audit trail: every status change and note edit on a lead ──────────────────
CREATE TABLE IF NOT EXISTS lead_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Nullable + SET NULL: when a lead is deleted its audit trail is kept,
  -- orphaned rather than cascaded away.
  lead_id     uuid        REFERENCES leads (id) ON DELETE SET NULL,
  kind        text        NOT NULL,   -- 'created' | 'status' | 'note' | 'deleted'
  from_value  text,
  to_value    text,
  actor       text,                   -- admin email, or NULL for public form
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lead_events_lead_idx ON lead_events (lead_id, created_at DESC);

-- ── Admin login attempts: throttled per IP to slow credential stuffing ───────
CREATE TABLE IF NOT EXISTS admin_login_attempts (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash    text        NOT NULL,
  email      text,
  ok         boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_login_attempts_ip_idx
  ON admin_login_attempts (ip_hash, created_at DESC);

-- ── touched_at trigger ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leads_set_updated_at ON leads;
CREATE TRIGGER leads_set_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────────
-- On Supabase, tables exposed through PostgREST should not be world-readable.
-- The app connects with the service-role key, which bypasses RLS, so enabling
-- this is safe and closes the anon-key hole if the project is ever exposed.
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_login_attempts ENABLE ROW LEVEL SECURITY;

-- The API always writes through this migration's owner. No anon policies are
-- defined on purpose: anonymous access is denied by default once RLS is on.
