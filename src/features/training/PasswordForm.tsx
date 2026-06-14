'use client';

import { useActionState } from 'react';

import { unlockTraining, type UnlockState } from './actions';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

const initialState: UnlockState = {};

/**
 * Shared password form: a single password field that unlocks the training and
 * navigates to `redirectTo` on success. Used by the deck's inline gate and the
 * Training page dialog.
 */
export function PasswordForm({
  redirectTo,
  autoFocus,
}: {
  redirectTo: string;
  autoFocus?: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    unlockTraining,
    initialState
  );

  return (
    <form action={formAction} className='flex flex-col gap-3'>
      <input type='hidden' name='redirectTo' value={redirectTo} />
      <Input
        type='password'
        name='password'
        placeholder='Contraseña'
        autoComplete='current-password'
        autoFocus={autoFocus}
        aria-invalid={state.error ? true : undefined}
        required
      />
      {state.error ? (
        <p className='text-sm text-destructive'>{state.error}</p>
      ) : null}
      <Button type='submit' disabled={pending}>
        {pending ? 'Comprobando…' : 'Entrar'}
      </Button>
    </form>
  );
}
