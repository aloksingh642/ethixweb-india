import 'server-only';

import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
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
 * Dev-only fallback used when DATABASE_URL is unset, so the enquiry form and
 * the admin dashboard are testable before a database is provisioned.
 *
 * It is NOT suitable for production: the file is local to one instance, so on
 * serverless platforms writes land on an ephemeral disk and disappear. The
 * admin UI and /api/health both surface that this backend is active.
 */

type FileShape = {
  leads: Lead[];
  events: LeadEvent[];
  loginAttempts: { ipHash: string; ok: boolean; createdAt: string }[];
};

const EMPTY: FileShape = { leads: [], events: [], loginAttempts: [] };

function storePath(): string {
  // Vercel gives us a writable /tmp; locally we keep it next to the project
  // (gitignored) so it survives restarts during development.
  const base = process.env.VERCEL ? join('/tmp', 'ethixweb-india') : join(process.cwd(), '.data');
  return join(base, 'leads.json');
}

async function read(): Promise<FileShape> {
  try {
    const raw = await readFile(storePath(), 'utf8');
    const parsed = JSON.parse(raw) as Partial<FileShape>;
    return {
      leads: parsed.leads ?? [],
      events: parsed.events ?? [],
      loginAttempts: parsed.loginAttempts ?? [],
    };
  } catch {
    return structuredClone(EMPTY);
  }
}

async function write(data: FileShape): Promise<void> {
  const p = storePath();
  await mkdir(dirname(p), { recursive: true });
  // Write-then-rename so a crash mid-write cannot truncate the store.
  const tmp = `${p}.${randomUUID()}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
  await rename(tmp, p);
}

const since = (iso: string, minutes: number) => Date.now() - new Date(iso).getTime() < minutes * 60_000;

function matches(lead: Lead, filters: LeadFilters): boolean {
  if (filters.status && filters.status !== 'all' && lead.status !== filters.status) return false;
  const q = filters.q?.trim().toLowerCase();
  if (!q) return true;
  return [
    lead.name,
    lead.email,
    lead.company ?? '',
    lead.service,
    lead.city ?? '',
    lead.reference,
    lead.message,
  ]
    .join(' ')
    .toLowerCase()
    .includes(q);
}

export const fileRepository: LeadRepository = {
  kind: 'file',

  async create(input: NewLead): Promise<Lead> {
    const data = await read();
    const now = new Date().toISOString();
    const lead: Lead = {
      ...input,
      id: randomUUID(),
      status: 'new',
      notes: null,
      createdAt: now,
      updatedAt: now,
    };
    data.leads.unshift(lead);
    data.events.unshift({
      id: randomUUID(),
      leadId: lead.id,
      kind: 'created',
      fromValue: null,
      toValue: input.service,
      actor: null,
      createdAt: now,
    });
    await write(data);
    return lead;
  },

  async list(filters: LeadFilters): Promise<LeadList> {
    const data = await read();
    const found = data.leads
      .filter((l) => matches(l, filters))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const offset = Math.max(filters.offset ?? 0, 0);
    const limit = Math.min(Math.max(filters.limit ?? 25, 1), 100);
    return { rows: found.slice(offset, offset + limit), total: found.length };
  },

  async get(id: string): Promise<Lead | null> {
    const data = await read();
    return data.leads.find((l) => l.id === id) ?? null;
  },

  async update(id: string, patch: LeadPatch, actor: string | null): Promise<Lead | null> {
    const data = await read();
    const i = data.leads.findIndex((l) => l.id === id);
    if (i === -1) return null;
    const before = data.leads[i];
    const now = new Date().toISOString();

    const next: Lead = {
      ...before,
      status: patch.status ?? before.status,
      notes: patch.notes === undefined ? before.notes : patch.notes,
      updatedAt: now,
    };
    data.leads[i] = next;

    if (patch.status && patch.status !== before.status) {
      data.events.unshift({
        id: randomUUID(),
        leadId: id,
        kind: 'status',
        fromValue: before.status,
        toValue: patch.status,
        actor,
        createdAt: now,
      });
    }
    if (patch.notes !== undefined && patch.notes !== before.notes) {
      data.events.unshift({
        id: randomUUID(),
        leadId: id,
        kind: 'note',
        fromValue: before.notes,
        toValue: patch.notes,
        actor,
        createdAt: now,
      });
    }
    await write(data);
    return next;
  },

  async remove(id: string, actor: string | null): Promise<boolean> {
    const data = await read();
    const i = data.leads.findIndex((l) => l.id === id);
    if (i === -1) return false;
    const [removed] = data.leads.splice(i, 1);
    data.events.unshift({
      id: randomUUID(),
      leadId: id,
      kind: 'deleted',
      fromValue: null,
      toValue: removed.reference,
      actor,
      createdAt: new Date().toISOString(),
    });
    await write(data);
    return true;
  },

  async stats(): Promise<LeadStats> {
    const data = await read();
    const byStatus = LEAD_STATUSES.reduce(
      (acc, s) => ({ ...acc, [s]: 0 }),
      {} as Record<LeadStatus, number>,
    );
    for (const l of data.leads) byStatus[l.status] = (byStatus[l.status] ?? 0) + 1;
    return {
      total: data.leads.length,
      last7Days: data.leads.filter((l) => since(l.createdAt, 7 * 24 * 60)).length,
      last30Days: data.leads.filter((l) => since(l.createdAt, 30 * 24 * 60)).length,
      byStatus,
    };
  },

  async events(leadId: string): Promise<LeadEvent[]> {
    const data = await read();
    return data.events.filter((e) => e.leadId === leadId).slice(0, 50);
  },

  async countRecentByIp(ipHash: string, sinceMinutes: number): Promise<number> {
    const data = await read();
    return data.leads.filter((l) => l.ipHash === ipHash && since(l.createdAt, sinceMinutes)).length;
  },

  async countRecentByEmail(email: string, sinceMinutes: number): Promise<number> {
    const data = await read();
    return data.leads.filter(
      (l) => l.email.toLowerCase() === email.toLowerCase() && since(l.createdAt, sinceMinutes),
    ).length;
  },

  async recordLoginAttempt(ipHash: string, _email: string | null, ok: boolean): Promise<void> {
    const data = await read();
    data.loginAttempts.push({ ipHash, ok, createdAt: new Date().toISOString() });
    data.loginAttempts = data.loginAttempts.filter((a) => since(a.createdAt, 24 * 60));
    await write(data);
  },

  async loginAttemptsSince(ipHash: string, sinceMinutes: number): Promise<{ total: number; failed: number }> {
    const data = await read();
    const rows = data.loginAttempts.filter((a) => a.ipHash === ipHash && since(a.createdAt, sinceMinutes));
    return { total: rows.length, failed: rows.filter((a) => !a.ok).length };
  },
};
