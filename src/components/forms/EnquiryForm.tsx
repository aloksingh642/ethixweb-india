'use client';

import { useEffect, useId, useState } from 'react';

import { Icon } from '@/components/ui/Icon';
import { budgetRanges, cities, serviceInterests } from '@/lib/content/site';

type Status = 'idle' | 'submitting' | 'success' | 'error';

type Values = {
  name: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  service: string;
  budget: string;
  message: string;
  website: string; // honeypot — must stay empty
};

const EMPTY: Values = {
  name: '',
  email: '',
  phone: '',
  company: '',
  city: '',
  service: '',
  budget: '',
  message: '',
  website: '',
};

/** Field-level error keys the API returns. */
type FieldErrors = Partial<Record<keyof Values | '_', string>>;

type FieldProps = {
  label: string;
  name: keyof Values;
  value: string;
  onChange: (name: keyof Values, value: string) => void;
  error?: string;
  type?: 'text' | 'email' | 'tel';
  placeholder?: string;
  hint?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel';
  className?: string;
  maxLength?: number;
};

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  hint,
  required,
  autoComplete,
  inputMode,
  className = '',
  maxLength,
}: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-ink-900">
        {label}
        {required ? (
          <span className="ml-0.5 text-brand-600" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1.5 text-xs font-normal text-ink-400">(optional)</span>
        )}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={`mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-[0.9375rem] text-ink-950 outline-none transition-colors placeholder:text-ink-300 ${
          error
            ? 'border-brand-500 ring-1 ring-brand-500/30'
            : 'border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
        }`}
      />

      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-ink-400">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-brand-600">
          <Icon name="alert" size={13} className="mt-px shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

type SelectProps = {
  label: string;
  name: keyof Values;
  value: string;
  onChange: (name: keyof Values, value: string) => void;
  options: readonly string[];
  error?: string;
  required?: boolean;
  placeholder: string;
  className?: string;
};

function Select({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required,
  placeholder,
  className = '',
}: SelectProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-ink-900">
        {label}
        {required ? (
          <span className="ml-0.5 text-brand-600" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1.5 text-xs font-normal text-ink-400">(optional)</span>
        )}
      </label>

      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`mt-1.5 w-full appearance-none rounded-xl border bg-white bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat px-4 py-3 pr-10 text-[0.9375rem] text-ink-950 outline-none transition-colors ${
          error
            ? 'border-brand-500 ring-1 ring-brand-500/30'
            : 'border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
        }`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%236d625b' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E\")",
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {error && (
        <p id={errorId} className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-brand-600">
          <Icon name="alert" size={13} className="mt-px shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export function EnquiryForm({ ts: initialTs }: { ts: string }) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');
  const [reference, setReference] = useState('');

  /**
   * `initialTs` comes from the prerendered HTML, so it can be as old as the
   * last build. Swap in a freshly signed token on mount — the server uses it to
   * judge how long the form actually took to fill in.
   */
  const [ts, setTs] = useState(initialTs);
  useEffect(() => {
    let cancelled = false;
    fetch('/api/enquiry-token', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { ts?: string } | null) => {
        if (!cancelled && data?.ts) setTs(data.ts);
      })
      .catch(() => {
        /* Keep the prerendered token; the server will reject it only if the
           build is more than 24 hours old, and the user still gets a clear
           "form expired" message telling them to refresh. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = (name: keyof Values, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    // Clear the error as soon as the user starts correcting it.
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'submitting') return;

    setStatus('submitting');
    setServerError('');
    setErrors({});

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...values,
          ts,
          pagePath: window.location.pathname,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        reference?: string;
        error?: string;
        fieldErrors?: FieldErrors;
      };

      if (res.ok && data.ok) {
        setReference(data.reference ?? '');
        setStatus('success');
        setValues(EMPTY);
        return;
      }

      if (data.fieldErrors) setErrors(data.fieldErrors);
      setServerError(data.error ?? 'Something went wrong. Please try again.');
      setStatus('error');
    } catch {
      setServerError('We could not reach the server. Please check your connection and try again.');
      setStatus('error');
    }
  }

  /* ── Success state ── */
  if (status === 'success') {
    return (
      <div className="card p-8 text-center sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-jade-soft text-jade">
          <Icon name="check" size={28} strokeWidth={2.2} />
        </span>
        <h3 className="mt-5 text-2xl font-bold tracking-tight text-ink-950">
          Enquiry received
        </h3>
        <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-ink-600">
          Thank you. A senior member of the team will reply within one business day, during Indian
          working hours.
        </p>

        {reference && (
          <p className="mx-auto mt-6 inline-flex flex-col items-center rounded-xl border border-dashed border-ink-200 bg-bone px-5 py-3">
            <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink-400">
              Your reference
            </span>
            <span className="tnum mt-0.5 text-lg font-bold text-ink-950">{reference}</span>
          </p>
        )}

        <p className="mt-6 text-sm text-ink-500">
          Need something sooner?{' '}
          <a
            href="https://wa.me/919829012345"
            className="font-semibold text-brand-600 underline decoration-brand-200 underline-offset-2 hover:text-brand-700"
          >
            WhatsApp us
          </a>{' '}
          — we reply fastest there.
        </p>

        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="btn btn-ghost mx-auto mt-7 px-5 py-2.5 text-sm"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const submitting = status === 'submitting';
  const errorList = Object.values(errors).filter(Boolean) as string[];

  return (
    <form onSubmit={onSubmit} noValidate className="card p-6 sm:p-8">
      <h3 className="text-xl font-bold tracking-tight text-ink-950">Start a project</h3>
      <p className="mt-1.5 text-sm text-ink-500">
        Tell us what is broken. We reply within one business day, in IST.
      </p>

      {/* Error summary — announced once, and links the user to the fix. */}
      {status === 'error' && (serverError || errorList.length > 0) && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-brand-200 bg-brand-50 p-4"
        >
          <p className="flex items-start gap-2 text-sm font-semibold text-brand-700">
            <Icon name="alert" size={16} className="mt-px shrink-0" />
            {serverError || 'Please check the highlighted fields.'}
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field
          label="Your name"
          name="name"
          value={values.name}
          onChange={update}
          error={errors.name}
          required
          autoComplete="name"
          placeholder="Amit Sharma"
          maxLength={80}
        />
        <Field
          label="Work email"
          name="email"
          type="email"
          value={values.email}
          onChange={update}
          error={errors.email}
          required
          autoComplete="email"
          inputMode="email"
          placeholder="amit@company.in"
          maxLength={160}
        />
        <Field
          label="Mobile number"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={update}
          error={errors.phone}
          required
          autoComplete="tel"
          inputMode="tel"
          placeholder="+91 98290 12345"
          hint="10-digit Indian mobile. We only use it to call you back."
          maxLength={20}
        />
        <Field
          label="Company"
          name="company"
          value={values.company}
          onChange={update}
          error={errors.company}
          autoComplete="organization"
          placeholder="Sharma Foods Pvt Ltd"
          maxLength={120}
        />
        <Select
          label="City"
          name="city"
          value={values.city}
          onChange={update}
          options={[...cities.map((c) => c.name), 'Other']}
          error={errors.city}
          placeholder="Select your city"
        />
        <Select
          label="What do you need?"
          name="service"
          value={values.service}
          onChange={update}
          options={serviceInterests}
          error={errors.service}
          required
          placeholder="Choose a service"
          className="sm:col-span-2"
        />
        <Select
          label="Budget"
          name="budget"
          value={values.budget}
          onChange={update}
          options={budgetRanges}
          error={errors.budget}
          placeholder="Rough range is fine"
          className="sm:col-span-2"
        />

        <div className="sm:col-span-2">
          <label htmlFor="enquiry-message" className="block text-sm font-semibold text-ink-900">
            What is going on?
            <span className="ml-0.5 text-brand-600" aria-hidden="true">
              *
            </span>
          </label>
          <textarea
            id="enquiry-message"
            name="message"
            rows={5}
            value={values.message}
            onChange={(e) => update('message', e.target.value)}
            required
            maxLength={2000}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? 'enquiry-message-error' : 'enquiry-message-hint'}
            placeholder="Our website takes about seven seconds to load on mobile, and enquiries from the contact form go straight to spam. We want…"
            className={`mt-1.5 w-full resize-y rounded-xl border bg-white px-4 py-3 text-[0.9375rem] leading-relaxed text-ink-950 outline-none transition-colors placeholder:text-ink-300 ${
              errors.message
                ? 'border-brand-500 ring-1 ring-brand-500/30'
                : 'border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
            }`}
          />
          {errors.message ? (
            <p
              id="enquiry-message-error"
              className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-brand-600"
            >
              <Icon name="alert" size={13} className="mt-px shrink-0" />
              {errors.message}
            </p>
          ) : (
            <p id="enquiry-message-hint" className="mt-1.5 text-xs text-ink-400">
              A couple of sentences is plenty. {values.message.length}/2000
            </p>
          )}
        </div>

        {/*
          Honeypot. Positioned off-screen rather than display:none — many bots
          skip fields they cannot see, which would defeat the trap. Hidden from
          assistive tech and removed from the tab order.
        */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
          <label htmlFor="enquiry-website">Website</label>
          <input
            id="enquiry-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(e) => update('website', e.target.value)}
          />
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-4 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-ink-400">
          By submitting you agree we may contact you about your enquiry. We never sell your data —
          see how we handle it under the DPDP Act 2023.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary w-full shrink-0 px-6 py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {submitting ? (
            <>
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
              />
              Sending…
            </>
          ) : (
            <>
              Send enquiry
              <Icon name="arrow-right" size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
