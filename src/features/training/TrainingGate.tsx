import { Lock } from 'lucide-react';

import type { GateId } from './access';
import { PasswordForm } from './PasswordForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

/**
 * Full-screen password card shown in place of gated content. On success the
 * form redirects back to `redirectTo`, which now passes the cookie gate and
 * renders. Defaults to the training gate with its Spanish copy; pass `gate`,
 * `locale`, `title` and `description` for other gates.
 */
export function TrainingGate({
  redirectTo,
  gate = 'training',
  locale = 'es',
  title = 'Material protegido',
  description = 'Esta formación es privada. Introduce la contraseña para acceder.',
}: {
  redirectTo: string;
  gate?: GateId;
  locale?: 'es' | 'en';
  title?: string;
  description?: string;
}) {
  return (
    <div className='flex min-h-screen w-full items-center justify-center bg-background px-6'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <div className='mb-2 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary'>
            <Lock className='size-5' />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm
            redirectTo={redirectTo}
            gate={gate}
            locale={locale}
            autoFocus
          />
        </CardContent>
      </Card>
    </div>
  );
}
