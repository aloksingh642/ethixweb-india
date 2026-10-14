'use client';

import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';

import { Icon } from '@/components/ui/Icon';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const emailId = useId();
  const passwordId = useId();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setError(data.error ?? 'Sign in failed. Please try again.');
        setSubmitting(false);
        return;
      }

      // Refresh so the server component re-reads the new session cookie,
      // then navigate.
      router.replace('/admin');
      router.refresh();
    } catch {
      setError('Could not reach the server. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor={emailId} className="block text-sm font-semibold text-ink-900">
          Email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
          className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-[0.9375rem] text-ink-950 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
        />
      </div>

      <div>
        <label htmlFor={passwordId} className="block text-sm font-semibold text-ink-900">
          Password
        </label>
        <input
          id={passwordId}
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-[0.9375rem] text-ink-950 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-brand-200 bg-brand-50 p-3.5 text-sm font-medium text-brand-700"
        >
          <Icon name="alert" size={16} className="mt-px shrink-0" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary w-full py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? (
          <>
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
            />
            Signing in…
          </>
        ) : (
          <>
            Sign in
            <Icon name="arrow-right" size={18} />
          </>
        )}
      </button>
    </form>
  );
}
