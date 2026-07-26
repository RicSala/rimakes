import { createHash } from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * Light, shared-password gates. Each gate has its own password (server env) and
 * its own cookie; the browser only ever holds a hash of the password. These are
 * soft gates (the content itself isn't a secret) — just enough that the URL
 * isn't wide open.
 */
export const GATES = {
  /** Material de asistentes: decks de repaso y recursos (página Training). */
  training: { cookie: 'training_access', envVar: 'TRAINING_PASSWORD' },
} as const;

export type GateId = keyof typeof GATES;

/**
 * The value stored in the cookie: a hash of the gate's shared password. Storing
 * the hash (not the password) keeps the literal password out of the browser and
 * makes the cookie value impossible to forge without knowing the password.
 * Returns `null` when no password is configured (so the gate fails closed).
 */
export function gateAccessToken(gate: GateId): string | null {
  const password = process.env[GATES[gate].envVar];
  if (!password) return null;
  return createHash('sha256').update(password).digest('hex');
}

/** True when the current request carries a valid access cookie for the gate. */
export async function hasGateAccess(gate: GateId): Promise<boolean> {
  const token = gateAccessToken(gate);
  if (!token) return false;
  const store = await cookies();
  return store.get(GATES[gate].cookie)?.value === token;
}

// ── Back-compat aliases for the original single-gate API ────────────────────
export const TRAINING_COOKIE = GATES.training.cookie;

export function trainingAccessToken(): string | null {
  return gateAccessToken('training');
}

export async function hasTrainingAccess(): Promise<boolean> {
  return hasGateAccess('training');
}
