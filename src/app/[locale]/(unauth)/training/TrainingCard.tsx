'use client';

import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';

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

const COPY = {
  es: {
    badge: 'Workshop',
    title: 'Taller Claude Code',
    description:
      'Domina Claude Code de los primeros pasos a tu propio software personal, y automatiza buena parte de tu día a día.',
    dialogDescription: 'Material privado. Introduce la contraseña para entrar.',
  },
  en: {
    badge: 'Workshop',
    title: 'Claude Code Workshop',
    description:
      'Master Claude Code from first steps to your own personal software, and automate a good part of your day-to-day.',
    dialogDescription: 'Private material. Enter the password to get in.',
  },
} as const;

/**
 * The workshop card on the Training page. If the visitor already has access it
 * links straight to the deck; otherwise it opens a password dialog that unlocks
 * and redirects to the deck.
 */
export function TrainingCard({
  unlocked,
  deckPath,
  locale = 'es',
}: {
  unlocked: boolean;
  deckPath: string;
  locale?: 'es' | 'en';
}) {
  const c = COPY[locale];

  const card = (
    <Card className='group cursor-pointer text-left transition hover:border-primary/50 hover:shadow-md'>
      <CardHeader>
        <div className='mb-1 flex items-center justify-between'>
          <span className='rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary'>
            {c.badge}
          </span>
          {unlocked ? (
            <ArrowRight className='size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary' />
          ) : (
            <Lock className='size-4 text-muted-foreground' />
          )}
        </div>
        <CardTitle>{c.title}</CardTitle>
        <CardDescription>{c.description}</CardDescription>
      </CardHeader>
    </Card>
  );

  if (unlocked) {
    return (
      <Link href={deckPath} className='block'>
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
          <DialogTitle>{c.title}</DialogTitle>
          <DialogDescription>{c.dialogDescription}</DialogDescription>
        </DialogHeader>
        <PasswordForm redirectTo={deckPath} locale={locale} autoFocus />
      </DialogContent>
    </Dialog>
  );
}
