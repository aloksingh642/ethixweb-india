import 'server-only';

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { safeEqual } from './security';

export const ADMIN_COOKIE = 'ew_admin_session';
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function key(): Uint8Array {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_SESSION_SECRET is not configured');
    }
    return new TextEncoder().encode('ethixweb-insecure-dev-secret-change-me');
  }
  return new TextEncoder().encode(s);
}

export type AdminSession = { email: string; issuedAt: number };

/**
 * Verifies credentials against env-configured values using a constant-time
 * comparison, so response timing cannot be used to probe the password.
 */
export function verifyCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL ?? 'admin@ethixweb.in';
  const expectedPassword = process.env.ADMIN_PASSWORD ?? 'Ethixweb@India2026';

  // Always run both comparisons so timing does not reveal which one failed.
  const emailOk = safeEqual(email.trim().toLowerCase(), expectedEmail.trim().toLowerCase());
  const passwordOk = safeEqual(password, expectedPassword);
  return emailOk && passwordOk;
}

export async function createSession(email: string): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  const token = await new SignJWT({ email: email.trim().toLowerCase() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + MAX_AGE_SECONDS)
    .setIssuer('ethixweb-in')
    .setAudience('ethixweb-admin')
    .sign(key());

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true, // not readable from JS — XSS cannot steal the session
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
}

/** Returns the active session, or null if the cookie is missing/invalid/expired. */
export async function getSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, key(), {
      issuer: 'ethixweb-in',
      audience: 'ethixweb-admin',
    });
    if (typeof payload.email !== 'string') return null;
    return { email: payload.email, issuedAt: (payload.iat as number) ?? 0 };
  } catch {
    // Expired, tampered, or signed with a rotated secret — treat as signed out.
    return null;
  }
}

export const isAuthenticated = async (): Promise<boolean> => (await getSession()) !== null;
