import type { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { hasTrainingAccess } from '@/features/training/access';
import { TrainingCard } from './TrainingCard';

type Props = {
  params: Promise<{ locale: Locale }>;
};

// The self-paced review deck (covered material only, no live sync). The live,
// presenter-synced viewer lives at /present/intro-to-synced-slides (open, via
// /claude) and is intentionally NOT what this card links to.
const SESSION_DECK_PATH = '/present/intro-to-synced-slides/review';

export default async function TrainingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const unlocked = await hasTrainingAccess();

  return (
    <div className='flex flex-col gap-8'>
      <header className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold'>Training</h1>
        <p className='text-muted-foreground'>
          Material de los workshops. Necesitas la contraseña que te compartí para
          entrar.
        </p>
      </header>

      <TrainingCard unlocked={unlocked} deckPath={SESSION_DECK_PATH} />
    </div>
  );
}
