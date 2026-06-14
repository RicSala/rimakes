import { createHash } from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * Light, shared-password gate for the workshop decks. The password lives only in
 * `TRAINING_PASSWORD` (server env); the browser only ever holds a hash of it in a
 * cookie. This is a soft gate (the content itself isn't a secret) — just enough
 * that the deck URL isn't wide open.
 */
export const TRAINING_COOKIE = 'training_access';

/**
 * The value stored in the cookie: a hash of the shared password. Storing the hash
 * (not the password) keeps the literal password out of the browser and makes the
 * cookie value impossible to forge without knowing the password. Returns `null`
 * when no password is configured (so the gate fails closed).
 */
export function trainingAccessToken(): string | null {
  const password = process.env.TRAINING_PASSWORD;
  if (!password) return null;
  return createHash('sha256').update(password).digest('hex');
}

/** True when the current request carries a valid training-access cookie. */
export async function hasTrainingAccess(): Promise<boolean> {
  const token = trainingAccessToken();
  if (!token) return false;
  const store = await cookies();
  return store.get(TRAINING_COOKIE)?.value === token;
}
