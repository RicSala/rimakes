'use client';

import Link from 'next/link';
import { ArrowRight, Lock, type LucideIcon } from 'lucide-react';

import { PasswordForm } from '@/features/training/PasswordForm';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';

export type Resource = {
  /** Internal href to open once unlocked (locale-aware, e.g. "/en/mapa-agentico"). */
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

const COPY = {
  es: {
    lockBadge: 'Solo asistentes',
    open: 'Abrir recurso',
    unlock: 'Desbloquear con contraseña',
    dialogDescription:
      'Recurso solo para asistentes. Introduce la contraseña para acceder.',
  },
  en: {
    lockBadge: 'Attendees only',
    open: 'Open resource',
    unlock: 'Unlock with password',
    dialogDescription:
      'Attendee-only resource. Enter the password to access it.',
  },
} as const;

/**
 * A gated resource card for the Training page. It always shows an
 * attendees-only lock badge so the protected nature is obvious. When the
 * visitor already has access it links straight to the resource; otherwise it
 * opens the shared password dialog and, on success, redirects to the resource.
 */
export function ResourceCard({
  resource,
  unlocked,
  locale = 'es',
}: {
  resource: Resource;
  unlocked: boolean;
  locale?: 'es' | 'en';
}) {
  const { href, icon: Icon, title, description } = resource;
  const c = COPY[locale];

  const card = (
    <Card className='group h-full cursor-pointer text-left transition hover:border-primary/50 hover:shadow-md'>
      <CardHeader>
        <div className='mb-1 flex items-center justify-between'>
          <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
            <Icon className='size-5' />
          </div>
          <span className='inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground'>
            <Lock className='size-3' />
            {c.lockBadge}
          </span>
        </div>
        <CardTitle className='mt-1'>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className='mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary'>
          {unlocked ? (
            <>
              {c.open}
              <ArrowRight className='size-4 transition group-hover:translate-x-0.5' />
            </>
          ) : (
            <>
              {c.unlock}
              <Lock className='size-3.5' />
            </>
          )}
        </div>
      </CardHeader>
    </Card>
  );

  if (unlocked) {
    return (
      <Link href={href} className='block'>
        {card}
      </Link>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type='button' className='block w-full'>
          {card}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{c.dialogDescription}</DialogDescription>
        </DialogHeader>
        <PasswordForm redirectTo={href} locale={locale} autoFocus />
      </DialogContent>
    </Dialog>
  );
}
