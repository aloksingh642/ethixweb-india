import 'server-only';

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { fieldErrors } from './validation';

export type ApiError = {
  ok: false;
  error: string;
  fieldErrors?: Record<string, string>;
  code?: string;
};

/** Always respond JSON, and never leak stack traces to the client. */
export function json<T>(data: T, init?: { status?: number; headers?: Record<string, string> }) {
  return NextResponse.json(data, {
    status: init?.status ?? 200,
    headers: {
      'Cache-Control': 'no-store',
      ...init?.headers,
    },
  });
}

export function ok<T extends object>(data: T, status = 200) {
  return json({ ok: true as const, ...data }, { status });
}

export function fail(
  error: string,
  status = 400,
  extra?: { fieldErrors?: Record<string, string>; code?: string; headers?: Record<string, string> },
) {
  const body: ApiError = { ok: false, error, ...(extra?.fieldErrors ? { fieldErrors: extra.fieldErrors } : {}), ...(extra?.code ? { code: extra.code } : {}) };
  return json(body, { status, headers: extra?.headers });
}

/**
 * Wraps a handler so every unexpected throw becomes a clean 500 with a logged
 * cause. Route handlers stay readable and never accidentally echo internals.
 */
export async function handle<T>(fn: () => Promise<T>): Promise<T | NextResponse> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof ZodError) {
      return fail('Please check the highlighted fields.', 422, { fieldErrors: fieldErrors(err) });
    }
    if (err instanceof SyntaxError) {
      return fail('Malformed request body.', 400);
    }
    console.error('[api] unhandled error:', err);
    return fail('Something went wrong on our end. Please try again, or call us on +91 98290 12345.', 500);
  }
}

/** Guards against oversized or non-JSON bodies before any parsing work. */
export async function readJson(request: Request, maxBytes = 32_768): Promise<unknown> {
  const type = request.headers.get('content-type') ?? '';
  if (!type.includes('application/json')) {
    throw new SyntaxError('Expected application/json');
  }
  const raw = await request.text();
  if (raw.length > maxBytes) {
    throw new SyntaxError('Body too large');
  }
  return JSON.parse(raw);
}
