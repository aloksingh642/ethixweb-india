/**
 * Indian mobile number parsing and formatting.
 *
 * Kept in its own module (and free of `server-only`) so both the API validator
 * and client components can use it without pulling server secrets into the
 * browser bundle.
 */

/**
 * Normalises the many ways Indians write a mobile number down to 10 digits.
 *
 * Handles: +91 98290 12345 · 09829012345 · 9829012345 · 0091-98290-12345
 * and the spaces, dashes and brackets people actually type.
 */
export function normaliseIndianPhone(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0091')) digits = digits.slice(4);
  else if (digits.startsWith('91') && digits.length === 12) digits = digits.slice(2);
  else if (digits.startsWith('0') && digits.length === 11) digits = digits.slice(1);
  return digits;
}

/**
 * True for a valid Indian mobile: 10 digits starting 6–9.
 * Landlines (starting 2–5, e.g. STD codes) are rejected on purpose — we need a
 * number we can WhatsApp and SMS.
 */
export function isValidIndianMobile(digits: string): boolean {
  return /^[6-9]\d{9}$/.test(digits);
}

/** Formats 10 digits as "+91 98290 12345", the convention Indians use. */
export function formatIndianPhone(digits: string): string {
  if (digits.length !== 10) return digits;
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}
