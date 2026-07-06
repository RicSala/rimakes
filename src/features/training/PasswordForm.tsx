'use client';

import { useActionState } from 'react';

import type { GateId } from './access';
import { unlockTraining, type UnlockState } from './actions';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

const initialState: UnlockState = {};

const LABELS = {
  es: { placeholder: 'Contraseña', submit: 'Entrar', pending: 'Comprobando…' },
  en: { placeholder: 'Password', submit: 'Enter', pending: 'Checking…' },
} as const;

/**
 * Shared password form: a single password field that unlocks a gate
 * (`training` by default) and navigates to `redirectTo` on success. Used by
 * the deck's inline gate, the Training page dialogs and the workshop landing.
 */
export function PasswordForm({
  redirectTo,
  autoFocus,
  gate = 'training',
  locale = 'es',
}: {
  redirectTo: string;
  autoFocus?: boolean;
  gate?: GateId;
  locale?: 'es' | 'en';
}) {
  const [state, formAction, pending] = useActionState(
    unlockTraining,
    initialState
  );
  const labels = LABELS[locale];

  return (
    <form action={formAction} className='flex flex-col gap-3'>
      <input type='hidden' name='redirectTo' value={redirectTo} />
      <input type='hidden' name='gate' value={gate} />
      <input type='hidden' name='locale' value={locale} />
      <Input
        type='password'
        name='password'
        placeholder={labels.placeholder}
        autoComplete='current-password'
        autoFocus={autoFocus}
        aria-invalid={state.error ? true : undefined}
        required
      />
      {state.error ? (
        <p className='text-sm text-destructive'>{state.error}</p>
      ) : null}
      <Button type='submit' disabled={pending}>
        {pending ? labels.pending : labels.submit}
      </Button>
    </form>
  );
}
