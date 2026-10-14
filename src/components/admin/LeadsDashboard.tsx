'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Icon } from '@/components/ui/Icon';
import { LEAD_STATUSES, LEAD_STATUS_LABEL, type Lead, type LeadEvent, type LeadStats, type LeadStatus } from '@/lib/db/types';
import { formatIndianPhone } from '@/lib/phone';

const dateTime = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const STATUS_STYLE: Record<LeadStatus, string> = {
  new: 'bg-brand-50 text-brand-700 ring-brand-200',
  contacted: 'bg-saffron-soft text-terracotta ring-saffron/30',
  qualified: 'bg-jade-soft text-jade ring-jade/25',
  proposal: 'bg-ink-100 text-ink-700 ring-ink-200',
  won: 'bg-jade text-white ring-jade',
  lost: 'bg-ink-100 text-ink-500 ring-ink-200',
};

const EVENT_LABEL: Record<LeadEvent['kind'], string> = {
  created: 'Enquiry received',
  status: 'Status changed',
  note: 'Note updated',
  deleted: 'Lead deleted',
};

type Props = { email: string };

export function LeadsDashboard({ email }: Props) {
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [backend, setBackend] = useState<string>('');
  const [status, setStatus] = useState<LeadStatus | 'all'>('all');
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [events, setEvents] = useState<Record<string, LeadEvent[]>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  /* Debounce the search box so typing does not fire a request per keystroke. */
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(id);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ status, limit: '100' });
      if (debounced) params.set('q', debounced);

      const res = await fetch(`/api/admin/leads?${params}`, { cache: 'no-store' });
      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }

      const data = (await res.json()) as {
        ok?: boolean;
        leads?: Lead[];
        total?: number;
        stats?: LeadStats;
        backend?: string;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setError(data.error ?? 'Could not load leads.');
        return;
      }

      setLeads(data.leads ?? []);
      setTotal(data.total ?? 0);
      setStats(data.stats ?? null);
      setBackend(data.backend ?? '');
    } catch {
      setError('Network error. Please check your connection and retry.');
    } finally {
      setLoading(false);
    }
  }, [status, debounced, router]);

  useEffect(() => {
    void load();
  }, [load]);

  /* ── Actions ── */

  async function changeStatus(lead: Lead, next: LeadStatus) {
    setSaving(lead.id);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        setError('Could not update the status.');
        return;
      }
      await load();
      if (expanded === lead.id) void loadEvents(lead.id);
    } finally {
      setSaving(null);
    }
  }

  const loadEvents = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/leads/${id}/events`, { cache: 'no-store' });
    if (!res.ok) return;
    const data = (await res.json()) as { events?: LeadEvent[] };
    setEvents((prev) => ({ ...prev, [id]: data.events ?? [] }));
  }, []);

  function toggleExpand(id: string) {
    if (expanded === id) {
      setExpanded(null);
      return;
    }
    setExpanded(id);
    if (!events[id]) void loadEvents(id);
  }

  async function saveNote(lead: Lead) {
    const value = notes[lead.id] ?? lead.notes ?? '';
    setSaving(lead.id);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ notes: value }),
      });
      if (!res.ok) {
        setError('Could not save the note.');
        return;
      }
      await load();
      void loadEvents(lead.id);
    } finally {
      setSaving(null);
    }
  }

  async function removeLead(id: string) {
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        setError('Could not delete this lead.');
        return;
      }
      setConfirmDelete(null);
      if (expanded === id) setExpanded(null);
      await load();
    } finally {
      setSaving(null);
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  function exportCsv() {
    const headers = [
      'Reference',
      'Created (IST)',
      'Name',
      'Email',
      'Phone',
      'Company',
      'City',
      'Service',
      'Budget',
      'Status',
      'Message',
    ];
    const escape = (value: string | null) =>
      `"${(value ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;

    const rows = leads.map((lead) =>
      [
        lead.reference,
        dateTime.format(new Date(lead.createdAt)),
        lead.name,
        lead.email,
        lead.phone,
        lead.company,
        lead.city,
        lead.service,
        lead.budget,
        LEAD_STATUS_LABEL[lead.status],
        lead.message,
      ]
        .map(escape)
        .join(','),
    );

    // BOM so Excel opens the UTF-8 rupee symbols and diacritics correctly.
    const blob = new Blob([`﻿${[headers.join(','), ...rows].join('\n')}`], {
      type: 'text/csv;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ethixweb-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ── Render ── */

  const visible = useMemo(() => leads, [leads]);

  return (
    <div className="container-page py-10 sm:py-14">
      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-ink-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-saffron" />
            Ethixweb India
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">
            Lead dashboard
          </h1>
          <p className="mt-1.5 text-sm text-ink-500">
            Signed in as <span className="font-semibold text-ink-800">{email}</span>
            {backend && (
              <>
                {' · '}
                <span
                  className={
                    backend === 'postgres'
                      ? 'font-semibold text-jade'
                      : 'font-semibold text-terracotta'
                  }
                >
                  {backend === 'postgres' ? 'Postgres' : 'file store (dev only)'}
                </span>
              </>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={exportCsv} className="btn btn-ghost px-4 py-2.5 text-sm" disabled={!leads.length}>
            Export CSV
          </button>
          <button onClick={() => void load()} className="btn btn-ghost px-4 py-2.5 text-sm">
            <Icon name="trending-up" size={15} />
            Refresh
          </button>
          <button onClick={logout} className="btn btn-dark px-4 py-2.5 text-sm">
            <Icon name="logout" size={15} />
            Sign out
          </button>
        </div>
      </header>

      {/* Stats */}
      {stats && (
        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Total leads" value={stats.total} />
          <StatCard label="Last 7 days" value={stats.last7Days} />
          <StatCard label="Last 30 days" value={stats.last30Days} />
          {(['new', 'contacted', 'qualified'] as LeadStatus[]).map((s) => (
            <StatCard key={s} label={LEAD_STATUS_LABEL[s]} value={stats.byStatus[s] ?? 0} />
          ))}
        </dl>
      )}

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Icon
            name="search"
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, company, service, reference…"
            aria-label="Search leads"
            className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-10 pr-4 text-sm text-ink-950 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
          {(['all', ...LEAD_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              aria-pressed={status === s}
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                status === s
                  ? 'bg-ink-950 text-white'
                  : 'bg-white text-ink-600 ring-1 ring-inset ring-ink-200 hover:bg-ink-50'
              }`}
            >
              {s === 'all' ? 'All' : LEAD_STATUS_LABEL[s]}
              {stats && s !== 'all' && (
                <span className="tnum ml-1.5 opacity-60">{stats.byStatus[s] ?? 0}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 flex items-start gap-2 rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm font-medium text-brand-700"
        >
          <Icon name="alert" size={16} className="mt-px shrink-0" />
          {error}
        </p>
      )}

      {/* Results */}
      <p className="mt-6 text-xs uppercase tracking-[0.12em] text-ink-400">
        {loading ? 'Loading…' : `${visible.length} of ${total} lead${total === 1 ? '' : 's'}`}
      </p>

      {!loading && !visible.length ? (
        <div className="mt-4 rounded-2xl border border-dashed border-ink-200 bg-white p-12 text-center">
          <p className="text-sm font-semibold text-ink-700">
            {debounced || status !== 'all' ? 'No leads match those filters.' : 'No enquiries yet.'}
          </p>
          <p className="mt-1.5 text-sm text-ink-500">
            {debounced || status !== 'all'
              ? 'Try clearing the search or switching back to “All”.'
              : 'Submit the form on the contact page and it will appear here.'}
          </p>
        </div>
      ) : (
        <ul className="mt-3 space-y-2">
          {visible.map((lead) => {
            const isOpen = expanded === lead.id;
            const noteValue = notes[lead.id] ?? lead.notes ?? '';

            return (
              <li key={lead.id} className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
                {/* Row */}
                <div className="grid gap-3 p-4 lg:grid-cols-[1.6fr_1.4fr_1fr_1.2fr_auto] lg:items-center">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="tnum text-xs font-bold text-ink-400">{lead.reference}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ring-1 ring-inset ${STATUS_STYLE[lead.status]}`}
                      >
                        {LEAD_STATUS_LABEL[lead.status]}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-[0.9375rem] font-bold text-ink-950">
                      {lead.name}
                    </p>
                    <p className="truncate text-xs text-ink-500">
                      {lead.company ?? lead.email}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink-800">{lead.service}</p>
                    <p className="truncate text-xs text-ink-400">
                      {[lead.city, lead.budget].filter(Boolean).join(' · ') || '—'}
                    </p>
                  </div>

                  <div className="text-xs text-ink-500 lg:text-center">
                    <span className="tnum">{dateTime.format(new Date(lead.createdAt))}</span>
                    <span className="ml-1 text-ink-400">IST</span>
                  </div>

                  <div>
                    <label className="sr-only" htmlFor={`status-${lead.id}`}>
                      Status for {lead.reference}
                    </label>
                    <select
                      id={`status-${lead.id}`}
                      value={lead.status}
                      disabled={saving === lead.id}
                      onChange={(e) => void changeStatus(lead, e.target.value as LeadStatus)}
                      className="w-full rounded-lg border border-ink-200 bg-white px-2.5 py-2 text-xs font-medium text-ink-800 outline-none transition-colors focus:border-brand-500 disabled:opacity-60"
                    >
                      {LEAD_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {LEAD_STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1 lg:justify-end">
                    <button
                      onClick={() => toggleExpand(lead.id)}
                      aria-expanded={isOpen}
                      aria-controls={`detail-${lead.id}`}
                      className="rounded-lg border border-ink-200 px-3 py-2 text-xs font-semibold text-ink-700 transition-colors hover:bg-ink-50"
                    >
                      {isOpen ? 'Hide' : 'Details'}
                    </button>
                    {confirmDelete === lead.id ? (
                      <span className="flex items-center gap-1">
                        <button
                          onClick={() => void removeLead(lead.id)}
                          disabled={saving === lead.id}
                          className="rounded-lg bg-brand-600 px-2.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="rounded-lg border border-ink-200 px-2.5 py-2 text-xs font-semibold text-ink-600 transition-colors hover:bg-ink-50"
                        >
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(lead.id)}
                        aria-label={`Delete lead ${lead.reference}`}
                        className="rounded-lg border border-ink-200 p-2 text-ink-500 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
                      >
                        <Icon name="trash" size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Detail panel */}
                {isOpen && (
                  <div
                    id={`detail-${lead.id}`}
                    className="grid gap-6 border-t border-ink-100 bg-bone/60 p-5 lg:grid-cols-[1.3fr_1fr]"
                  >
                    <div>
                      <h3 className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink-400">
                        Enquiry
                      </h3>
                      <p className="mt-2 whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-ink-800">
                        {lead.message}
                      </p>

                      <dl className="mt-5 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                        <Detail label="Email" value={lead.email} href={`mailto:${lead.email}`} />
                        <Detail
                          label="Phone"
                          value={formatIndianPhone(lead.phone)}
                          href={`tel:+91${lead.phone}`}
                        />
                        <Detail label="Company" value={lead.company} />
                        <Detail label="City" value={lead.city} />
                        <Detail label="Budget" value={lead.budget} />
                        <Detail label="Source" value={lead.pagePath} />
                      </dl>

                      <div className="mt-5">
                        <label
                          htmlFor={`notes-${lead.id}`}
                          className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink-400"
                        >
                          Internal note
                        </label>
                        <textarea
                          id={`notes-${lead.id}`}
                          rows={3}
                          value={noteValue}
                          onChange={(e) =>
                            setNotes((prev) => ({ ...prev, [lead.id]: e.target.value }))
                          }
                          placeholder="Called, sending proposal Friday…"
                          className="mt-1.5 w-full resize-y rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-950 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                        />
                        <button
                          onClick={() => void saveNote(lead)}
                          disabled={saving === lead.id || noteValue === (lead.notes ?? '')}
                          className="btn btn-dark mt-2 px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Save note
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink-400">
                        Activity
                      </h3>
                      {events[lead.id]?.length ? (
                        <ol className="mt-3 space-y-3 border-l border-ink-200 pl-4">
                          {events[lead.id]!.map((event) => (
                            <li key={event.id} className="relative">
                              <span
                                aria-hidden="true"
                                className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-brand-400 ring-2 ring-bone"
                              />
                              <p className="text-sm font-semibold text-ink-900">
                                {EVENT_LABEL[event.kind]}
                              </p>
                              {event.kind === 'status' && (
                                <p className="mt-0.5 text-xs text-ink-600">
                                  {LEAD_STATUS_LABEL[event.fromValue as LeadStatus] ?? event.fromValue}
                                  {' → '}
                                  <span className="font-semibold">
                                    {LEAD_STATUS_LABEL[event.toValue as LeadStatus] ?? event.toValue}
                                  </span>
                                </p>
                              )}
                              {event.kind === 'note' && event.toValue && (
                                <p className="mt-0.5 line-clamp-2 text-xs text-ink-600">
                                  “{event.toValue}”
                                </p>
                              )}
                              <p className="mt-0.5 text-[0.6875rem] text-ink-400">
                                <span className="tnum">
                                  {dateTime.format(new Date(event.createdAt))}
                                </span>
                                {event.actor ? ` · ${event.actor}` : ''}
                              </p>
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p className="mt-3 text-sm text-ink-400">Loading activity…</p>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-4">
      <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-400">
        {label}
      </dt>
      <dd className="tnum mt-1 text-2xl font-extrabold tracking-tight text-ink-950">{value}</dd>
    </div>
  );
}

function Detail({ label, value, href }: { label: string; value?: string | null; href?: string }) {
  if (!value) return null;
  return (
    <div className="min-w-0">
      <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-400">
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-ink-800">
        {href ? (
          <a href={href} className="underline decoration-ink-200 underline-offset-2 hover:text-brand-600">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
