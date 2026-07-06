'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { GATES, type GateId, gateAccessToken } from './access';

const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30;

export type UnlockState = { error?: string };

/**
 * Validate the submitted password for a gate (`training` by default). On
 * success, set that gate's hashed-access cookie (remembered ~30 days) and
 * redirect to `redirectTo`; on failure, return an error for the form to show.
 * Used by the deck's inline gate, the Training page dialogs and the workshop
 * landing gate. Designed for `useActionState`.
 */
export async function unlockTraining(
  _prevState: UnlockState,
  formData: FormData
): Promise<UnlockState> {
  const gateRaw = String(formData.get('gate') ?? 'training');
  const gate: GateId = gateRaw in GATES ? (gateRaw as GateId) : 'training';
  const isEnglish = String(formData.get('locale') ?? '') === 'en';

  const password = process.env[GATES[gate].envVar];
  const token = gateAccessToken(gate);
  const submitted = String(formData.get('password') ?? '');
  const redirectToRaw = String(formData.get('redirectTo') ?? '');

  if (!password || !token) {
    return {
      error: isEnglish
        ? 'This page is not configured yet. Ping the organizer.'
        : 'La página no está configurada. Avisa al organizador.',
    };
  }
  if (submitted !== password) {
    return {
      error: isEnglish ? 'Incorrect password.' : 'Contraseña incorrecta.',
    };
  }

  const store = await cookies();
  store.set(GATES[gate].cookie, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: THIRTY_DAYS_SECONDS,
  });

  // Only follow internal paths (no open redirect via the hidden field).
  redirect(redirectToRaw.startsWith('/') ? redirectToRaw : '/');
}
