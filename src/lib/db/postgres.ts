import 'server-only';

import postgres from 'postgres';
import type {
  Lead,
  LeadEvent,
  LeadFilters,
  LeadList,
  LeadPatch,
  LeadRepository,
  LeadStats,
  LeadStatus,
  NewLead,
} from './types';
import { LEAD_STATUSES } from './types';

/**
 * One connection pool per Node process. Next.js hot-reload re-evaluates modules,
 * so without this the dev server leaks a pool on every edit.
 */
declare global {
  // eslint-disable-next-line no-var
  var __ethixSql: ReturnType<typeof postgres> | undefined;
}

function connection(): ReturnType<typeof postgres> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');

  if (!globalThis.__ethixSql) {
    // `prepare: false` keeps us compatible with transaction-mode poolers
    // (Supabase Transaction pooler, pgBouncer) where named prepared statements
    // are not supported across pooled connections.
    globalThis.__ethixSql = postgres(url, {
      ssl: process.env.DATABASE_SSL === 'true' ? 'require' : false,
      max: process.env.VERCEL ? 3 : 8,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
    });
  }
  return globalThis.__ethixSql;
}

/* ─────────────────────────── row mapping ─────────────────────────── */

type LeadRow = {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  city: string | null;
  service: string;
  budget: string | null;
  message: string;
  status: string;
  notes: string | null;
  source: string;
  page_path: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  referrer: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

const asLeadStatus = (v: string): LeadStatus =>
  (LEAD_STATUSES as readonly string[]).includes(v) ? (v as LeadStatus) : 'new';

const toIso = (v: Date | string): string => (v instanceof Date ? v.toISOString() : new Date(v).toISOString());

function mapLead(r: LeadRow): Lead {
  return {
    id: r.id,
    reference: r.reference,
    name: r.name,
    email: r.email,
    phone: r.phone,
    company: r.company,
    city: r.city,
    service: r.service,
    budget: r.budget,
    message: r.message,
    status: asLeadStatus(r.status),
    notes: r.notes,
    source: r.source,
    pagePath: r.page_path,
    ipHash: r.ip_hash,
    userAgent: r.user_agent,
    referrer: r.referrer,
    createdAt: toIso(r.created_at),
    updatedAt: toIso(r.updated_at),
  };
}

export const LEAD_COLUMNS = `
  id, reference, name, email, phone, company, city, service, budget, message,
  status, notes, source, page_path, ip_hash, user_agent, referrer,
  created_at, updated_at
`;

/* ─────────────────────────── repository ─────────────────────────── */

export const postgresRepository: LeadRepository = {
  kind: 'postgres',

  async create(input: NewLead): Promise<Lead> {
    const sql = connection();

    // Serialize the insert + audit event so a lead can never exist without a
    // matching 'created' row, even if the process dies midway.
    return sql.begin(async (tx) => {
      const [row] = await tx<LeadRow[]>`
        INSERT INTO leads (
          reference, name, email, phone, company, city, service, budget, message,
          source, page_path, ip_hash, user_agent, referrer
        ) VALUES (
          ${input.reference}, ${input.name}, ${input.email}, ${input.phone},
          ${input.company}, ${input.city}, ${input.service}, ${input.budget},
          ${input.message}, ${input.source}, ${input.pagePath}, ${input.ipHash},
          ${input.userAgent}, ${input.referrer}
        )
        RETURNING ${tx.unsafe(LEAD_COLUMNS)}
      `;

      await tx`
        INSERT INTO lead_events (lead_id, kind, to_value, actor)
        VALUES (${row.id}, 'created', ${input.service}, ${null})
      `;

      return mapLead(row);
    }) as Promise<Lead>;
  },

  async list(filters: LeadFilters): Promise<LeadList> {
    const sql = connection();
    const limit = Math.min(Math.max(filters.limit ?? 25, 1), 100);
    const offset = Math.max(filters.offset ?? 0, 0);
    const status = filters.status && filters.status !== 'all' ? filters.status : null;
    const q = filters.q?.trim() ? `%${filters.q.trim()}%` : null;

    // Kept as explicit SQL rather than dynamic fragments so the parameter
    // binding stays visible — and so it is obvious nothing is concatenated.
    const rows = await sql<LeadRow[]>`
      SELECT ${sql.unsafe(LEAD_COLUMNS)} FROM leads
      WHERE (${status}::text IS NULL OR status = ${status})
        AND (
          ${q}::text IS NULL
          OR name      ILIKE ${q}
          OR email     ILIKE ${q}
          OR company   ILIKE ${q}
          OR service   ILIKE ${q}
          OR city      ILIKE ${q}
          OR reference ILIKE ${q}
          OR message   ILIKE ${q}
        )
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const [{ count }] = await sql<{ count: number }[]>`
      SELECT count(*)::int AS count FROM leads
      WHERE (${status}::text IS NULL OR status = ${status})
        AND (
          ${q}::text IS NULL
          OR name      ILIKE ${q}
          OR email     ILIKE ${q}
          OR company   ILIKE ${q}
          OR service   ILIKE ${q}
          OR city      ILIKE ${q}
          OR reference ILIKE ${q}
          OR message   ILIKE ${q}
        )
    `;

    return { rows: rows.map(mapLead), total: count };
  },

  async get(id: string): Promise<Lead | null> {
    const sql = connection();
    const [row] = await sql<LeadRow[]>`
      SELECT ${sql.unsafe(LEAD_COLUMNS)} FROM leads WHERE id = ${id} LIMIT 1
    `;
    return row ? mapLead(row) : null;
  },

  async update(id: string, patch: LeadPatch, actor: string | null): Promise<Lead | null> {
    const sql = connection();

    return sql.begin(async (tx) => {
      const [before] = await tx<LeadRow[]>`SELECT ${tx.unsafe(LEAD_COLUMNS)} FROM leads WHERE id = ${id} LIMIT 1`;
      if (!before) return null;

      const nextStatus = patch.status ?? before.status;
      const nextNotes = patch.notes === undefined ? before.notes : patch.notes;

      const [row] = await tx<LeadRow[]>`
        UPDATE leads
           SET status = ${nextStatus}, notes = ${nextNotes}
         WHERE id = ${id}
        RETURNING ${tx.unsafe(LEAD_COLUMNS)}
      `;

      if (patch.status && patch.status !== before.status) {
        await tx`
          INSERT INTO lead_events (lead_id, kind, from_value, to_value, actor)
          VALUES (${id}, 'status', ${before.status}, ${patch.status}, ${actor})
        `;
      }
      if (patch.notes !== undefined && patch.notes !== before.notes) {
        await tx`
          INSERT INTO lead_events (lead_id, kind, from_value, to_value, actor)
          VALUES (${id}, 'note', ${before.notes}, ${patch.notes}, ${actor})
        `;
      }

      return mapLead(row);
    }) as Promise<Lead | null>;
  },

  async remove(id: string, actor: string | null): Promise<boolean> {
    const sql = connection();
    return sql.begin(async (tx) => {
      const [before] = await tx<LeadRow[]>`SELECT id, reference, name FROM leads WHERE id = ${id} LIMIT 1`;
      if (!before) return false;

      // Record the deletion first. The FK is ON DELETE SET NULL, so removing
      // the lead orphans its audit rows instead of destroying them.
      await tx`
        INSERT INTO lead_events (lead_id, kind, to_value, actor)
        VALUES (${id}, 'deleted', ${before.reference}, ${actor})
      `;
      await tx`DELETE FROM leads WHERE id = ${id}`;
      return true;
    }) as Promise<boolean>;
  },

  async stats(): Promise<LeadStats> {
    const sql = connection();
    const [byStatus, totals] = await Promise.all([
      sql<{ status: string; count: number }[]>`
        SELECT status, count(*)::int AS count FROM leads GROUP BY status
      `,
      sql<{ total: number; d7: number; d30: number }[]>`
        SELECT
          count(*)::int AS total,
          count(*) FILTER (WHERE created_at > now() - interval '7 days')::int  AS d7,
          count(*) FILTER (WHERE created_at > now() - interval '30 days')::int AS d30
        FROM leads
      `,
    ]);

    const base = LEAD_STATUSES.reduce(
      (acc, s) => ({ ...acc, [s]: 0 }),
      {} as Record<LeadStatus, number>,
    );
    for (const r of byStatus) base[asLeadStatus(r.status)] = r.count;

    return {
      total: totals[0]?.total ?? 0,
      last7Days: totals[0]?.d7 ?? 0,
      last30Days: totals[0]?.d30 ?? 0,
      byStatus: base,
    };
  },

  async events(leadId: string): Promise<LeadEvent[]> {
    const sql = connection();
    const rows = await sql<
      {
        id: string;
        lead_id: string | null;
        kind: string;
        from_value: string | null;
        to_value: string | null;
        actor: string | null;
        created_at: Date | string;
      }[]
    >`
      SELECT id, lead_id, kind, from_value, to_value, actor, created_at
        FROM lead_events
       WHERE lead_id = ${leadId}
       ORDER BY created_at DESC
       LIMIT 50
    `;

    return rows.map((r) => ({
      id: r.id,
      leadId: r.lead_id ?? leadId,
      kind: (['created', 'status', 'note', 'deleted'].includes(r.kind) ? r.kind : 'note') as LeadEvent['kind'],
      fromValue: r.from_value,
      toValue: r.to_value,
      actor: r.actor,
      createdAt: toIso(r.created_at),
    }));
  },

  async countRecentByIp(ipHash: string, sinceMinutes: number): Promise<number> {
    const sql = connection();
    const [{ count }] = await sql<{ count: number }[]>`
      SELECT count(*)::int AS count FROM leads
       WHERE ip_hash = ${ipHash}
         AND created_at > now() - make_interval(mins => ${sinceMinutes})
    `;
    return count;
  },

  async countRecentByEmail(email: string, sinceMinutes: number): Promise<number> {
    const sql = connection();
    const [{ count }] = await sql<{ count: number }[]>`
      SELECT count(*)::int AS count FROM leads
       WHERE lower(email) = lower(${email})
         AND created_at > now() - make_interval(mins => ${sinceMinutes})
    `;
    return count;
  },

  async recordLoginAttempt(ipHash: string, email: string | null, ok: boolean): Promise<void> {
    const sql = connection();
    await sql`
      INSERT INTO admin_login_attempts (ip_hash, email, ok) VALUES (${ipHash}, ${email}, ${ok})
    `;
    // Opportunistic cleanup — cheap, keeps the table from growing forever.
    await sql`DELETE FROM admin_login_attempts WHERE created_at < now() - interval '24 hours'`;
  },

  async loginAttemptsSince(ipHash: string, sinceMinutes: number): Promise<{ total: number; failed: number }> {
    const sql = connection();
    const [{ total, failed }] = await sql<{ total: number; failed: number }[]>`
      SELECT count(*)::int AS total,
             count(*) FILTER (WHERE ok = false)::int AS failed
        FROM admin_login_attempts
       WHERE ip_hash = ${ipHash}
         AND created_at > now() - make_interval(mins => ${sinceMinutes})
    `;
    return { total, failed };
  },
};
