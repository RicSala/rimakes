import { Lock } from 'lucide-react';

import { PasswordForm } from './PasswordForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

/**
 * Full-screen password card shown in place of a deck when the visitor doesn't
 * yet have training access. On success the form redirects back to `redirectTo`
 * (the deck), which now passes the cookie gate and renders.
 */
export function TrainingGate({ redirectTo }: { redirectTo: string }) {
  return (
    <div className='flex min-h-screen w-full items-center justify-center bg-background px-6'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <div className='mb-2 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary'>
            <Lock className='size-5' />
          </div>
          <CardTitle>Material protegido</CardTitle>
          <CardDescription>
            Esta formación es privada. Introduce la contraseña para acceder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm redirectTo={redirectTo} autoFocus />
        </CardContent>
      </Card>
    </div>
  );
}
