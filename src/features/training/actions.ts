'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { TRAINING_COOKIE, trainingAccessToken } from './access';

const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30;

export type UnlockState = { error?: string };

/**
 * Validate the submitted training password. On success, set the hashed-access
 * cookie (remembered ~30 days) and redirect to `redirectTo`; on failure, return
 * an error for the form to show. Used by both the deck's inline gate and the
 * Training page dialog. Designed for `useActionState`.
 */
export async function unlockTraining(
  _prevState: UnlockState,
  formData: FormData
): Promise<UnlockState> {
  const password = process.env.TRAINING_PASSWORD;
  const token = trainingAccessToken();
  const submitted = String(formData.get('password') ?? '');
  const redirectToRaw = String(formData.get('redirectTo') ?? '');

  if (!password || !token) {
    return { error: 'La formación no está configurada. Avisa al organizador.' };
  }
  if (submitted !== password) {
    return { error: 'Contraseña incorrecta.' };
  }

  const store = await cookies();
  store.set(TRAINING_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: THIRTY_DAYS_SECONDS,
  });

  // Only follow internal paths (no open redirect via the hidden field).
  redirect(redirectToRaw.startsWith('/') ? redirectToRaw : '/');
}
