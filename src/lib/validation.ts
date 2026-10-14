import { z } from 'zod';
import { budgetRanges, serviceInterests } from './content/site';
import { cities } from './content/site';
import { countLinks, sanitiseText } from './security';

// Phone parsing lives in ./phone so client components can use it too — this
// module imports `server-only` helpers and must not reach the browser bundle.
import { isValidIndianMobile, normaliseIndianPhone } from './phone';

export { normaliseIndianPhone, formatIndianPhone } from './phone';

// Widened to string[] on purpose: `cities` is `as const`, so .map() would
// produce a literal union and `.includes(v: string)` would not typecheck.
const cityNames: readonly string[] = cities.map((c) => c.name);

/**
 * Trim + collapse whitespace and strip control characters before validation, so
 * "  Amit\u0000  " cannot pass while displaying as garbage in the admin table.
 */
const text = (schema: z.ZodType<string>) =>
  z.preprocess((v) => (typeof v === 'string' ? sanitiseText(v) : v), schema);

export const enquirySchema = z.object({
  name: text(
    z
      .string()
      .min(2, 'Please enter your name.')
      .max(80, 'That name is a little too long.')
      .regex(/^[\p{L}\p{M}][\p{L}\p{M}'’.\- ]*$/u, 'Please enter a valid name.'),
  ),
  email: text(z.string().email('Please enter a valid email address.').max(160)),
  phone: z
    .string()
    .transform(normaliseIndianPhone)
    .refine(isValidIndianMobile, 'Please enter a valid 10-digit Indian mobile number.'),
  company: text(z.string().max(120)).optional().transform((v) => (v ? v : null)),
  city: z
    .string()
    .trim()
    .refine((v) => v === '' || v === 'Other' || cityNames.includes(v), 'Please pick a valid city.')
    .transform((v) => (v === '' ? null : v)),
  service: z
    .string()
    .trim()
    .min(1, 'Please choose what you need help with.')
    .refine((v) => serviceInterests.includes(v), 'Please choose a valid service.'),
  budget: z
    .string()
    .trim()
    .refine((v) => v === '' || budgetRanges.includes(v), 'Please pick a valid budget range.')
    .transform((v) => (v === '' ? null : v)),
  message: text(
    z
      .string()
      .min(20, 'Please tell us a little more — at least 20 characters.')
      .max(2000, 'Please keep it under 2000 characters.'),
  ),
  /**
   * Honeypot. Real users never see this field, so it must arrive empty.
   * Deliberately unconstrained here: the route returns a silent 200 for a
   * filled honeypot so bots are not told they were detected. Constraining it
   * in the schema would surface a 422 and defeat that.
   */
  website: z.string().optional().default(''),
  /** Signed "form rendered at" token, verified separately. */
  ts: z.string().optional(),
  pagePath: z.string().max(200).optional().transform((v) => (v ? v.slice(0, 200) : null)),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

/** Shape returned to the client after a successful enquiry. */
export type EnquiryResult = { ok: true; reference: string } | { ok: false; error: string; fieldErrors?: Record<string, string> };

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required.').max(160),
  password: z.string().min(1, 'Password is required.').max(200),
});

export const leadPatchSchema = z
  .object({
    status: z.enum(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']).optional(),
    notes: z.string().max(4000).nullable().optional(),
  })
  .refine((v) => v.status !== undefined || v.notes !== undefined, {
    message: 'Provide a status or notes to update.',
  });

/**
 * Content heuristics. Deliberately conservative: a real business enquiry with
 * one link is normal, so we only flag clear abuse patterns.
 */
export function looksLikeSpam(message: string): boolean {
  const links = countLinks(message);
  if (links >= 4) return true;

  // Long runs of a single character, or a message that is mostly digits.
  if (/(.)\1{25,}/.test(message)) return true;
  const digits = message.replace(/\D/g, '').length;
  if (message.length > 40 && digits / message.length > 0.5) return true;

  return /\[url=|<a\s+href|buy\s+cheap|casino|crypto\s+invest|viagra/i.test(message);
}

/** Turns a ZodError into the flat `{ field: message }` shape the form renders. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_';
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
