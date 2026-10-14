export const LEAD_STATUSES = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'won',
  'lost',
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal sent',
  won: 'Won',
  lost: 'Closed',
};

export type Lead = {
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
  status: LeadStatus;
  notes: string | null;
  source: string;
  pagePath: string | null;
  /** SHA-256 of IP + server salt. Raw IPs are never persisted. */
  ipHash: string | null;
  userAgent: string | null;
  referrer: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NewLead = {
  reference: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  city: string | null;
  service: string;
  budget: string | null;
  message: string;
  source: string;
  pagePath: string | null;
  ipHash: string | null;
  userAgent: string | null;
  referrer: string | null;
};

export type LeadEvent = {
  id: string;
  leadId: string;
  kind: 'created' | 'status' | 'note' | 'deleted';
  fromValue: string | null;
  toValue: string | null;
  actor: string | null;
  createdAt: string;
};

export type LeadFilters = {
  status?: LeadStatus | 'all';
  /** Free-text search across name, email, company, service, reference, message. */
  q?: string;
  limit?: number;
  offset?: number;
};

export type LeadStats = {
  total: number;
  last7Days: number;
  last30Days: number;
  byStatus: Record<LeadStatus, number>;
};

export type LeadList = {
  rows: Lead[];
  total: number;
};

export type LeadPatch = {
  status?: LeadStatus;
  notes?: string | null;
};

/** Everything the API layer needs from a storage backend. */
export interface LeadRepository {
  /** Which backend is live — surfaced in the admin UI and health endpoint. */
  readonly kind: 'postgres' | 'file';

  create(input: NewLead): Promise<Lead>;
  list(filters: LeadFilters): Promise<LeadList>;
  get(id: string): Promise<Lead | null>;
  update(id: string, patch: LeadPatch, actor: string | null): Promise<Lead | null>;
  remove(id: string, actor: string | null): Promise<boolean>;
  stats(): Promise<LeadStats>;
  events(leadId: string): Promise<LeadEvent[]>;

  /** Spam throttles. DB-backed so they hold across serverless instances. */
  countRecentByIp(ipHash: string, sinceMinutes: number): Promise<number>;
  countRecentByEmail(email: string, sinceMinutes: number): Promise<number>;

  /** Admin credential-stuffing throttle. */
  recordLoginAttempt(ipHash: string, email: string | null, ok: boolean): Promise<void>;
  loginAttemptsSince(ipHash: string, sinceMinutes: number): Promise<{ total: number; failed: number }>;
}
