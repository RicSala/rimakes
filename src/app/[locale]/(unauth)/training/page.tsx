import type { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { hasTrainingAccess } from '@/features/training/access';
import { routing } from '@/shared/internationalization/i18n/config';
import { TrainingCard } from './TrainingCard';
import { ResourcesSection } from './ResourcesSection';

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

  // Locale-aware path (localePrefix is "as-needed": no prefix for the default
  // locale, so we must not emit "/es/…").
  const mapaHref =
    locale === routing.defaultLocale
      ? '/mapa-agentico'
      : `/${locale}/mapa-agentico`;
  const mapaContextoHref =
    locale === routing.defaultLocale
      ? '/mapa-contexto'
      : `/${locale}/mapa-contexto`;
  const claudeMdHref =
    locale === routing.defaultLocale
      ? '/claude-md'
      : `/${locale}/claude-md`;
  const skillsHref =
    locale === routing.defaultLocale ? '/skills' : `/${locale}/skills`;
  const glosarioHref =
    locale === routing.defaultLocale
      ? '/glosario'
      : `/${locale}/glosario`;
  const comandosHref =
    locale === routing.defaultLocale
      ? '/comandos'
      : `/${locale}/comandos`;

  return (
    <div className='flex flex-col gap-10'>
      <header className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold'>Training</h1>
        <p className='text-muted-foreground'>
          Material de los workshops. Necesitas la contraseña que te compartí para
          entrar.
        </p>
      </header>

      <section className='flex flex-col gap-4'>
        <h2 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
          Sesiones
        </h2>
        <TrainingCard unlocked={unlocked} deckPath={SESSION_DECK_PATH} />
      </section>

      <section className='flex flex-col gap-4'>
        <h2 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
          Recursos
        </h2>
        <ResourcesSection
          unlocked={unlocked}
          mapaHref={mapaHref}
          mapaContextoHref={mapaContextoHref}
          claudeMdHref={claudeMdHref}
          skillsHref={skillsHref}
          glosarioHref={glosarioHref}
          comandosHref={comandosHref}
        />
      </section>
    </div>
  );
}
