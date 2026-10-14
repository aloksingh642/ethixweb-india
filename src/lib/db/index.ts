import 'server-only';

import { fileRepository } from './file-store';
import { postgresRepository } from './postgres';
import type { LeadRepository } from './types';

export type { LeadRepository } from './types';
export * from './types';

/**
 * Returns the live repository: Postgres when DATABASE_URL is set, otherwise the
 * dev-only file store. Resolved lazily so importing this module never attempts
 * a connection at build time.
 */
export function getRepository(): LeadRepository {
  if (process.env.DATABASE_URL) return postgresRepository;
  return fileRepository;
}

export const isDatabaseConfigured = (): boolean => Boolean(process.env.DATABASE_URL);
