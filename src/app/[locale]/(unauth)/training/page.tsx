import type { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { hasTrainingAccess } from '@/features/training/access';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
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

const COPY = {
  es: {
    title: 'Training',
    intro:
      'Material de los workshops. Necesitas la contraseña que te compartí para entrar.',
    upcomingHeading: 'Próximos workshops',
    upcomingBadge: 'Inscripción abierta',
    upcomingTitle: 'Taller de Claude para profesionales no técnicos',
    upcomingDescription:
      'Nueva cohorte en septiembre (en español): programa, plazas y precio.',
    sessionsHeading: 'Sesiones',
    resourcesHeading: 'Recursos',
  },
  en: {
    title: 'Training',
    intro:
      'Workshop materials. You need the password I shared with you to get in.',
    upcomingHeading: 'Upcoming workshops',
    upcomingBadge: 'Enrolling now',
    upcomingTitle: 'Claude Workshop for Non-Technical Professionals',
    upcomingDescription:
      'New cohort in September (in Spanish): program, seats and pricing.',
    sessionsHeading: 'Sessions',
    resourcesHeading: 'Resources',
  },
};

export default async function TrainingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale === 'en' ? 'en' : 'es';
  const c = COPY[lang];

  const unlocked = await hasTrainingAccess();

  // Locale-aware path (localePrefix is "as-needed": no prefix for the default
  // locale, so we must not emit "/es/…").
  const withLocale = (path: string) =>
    locale === routing.defaultLocale ? path : `/${locale}${path}`;

  const workshopHref = withLocale('/claude-workshop');
  const mapaHref = withLocale('/mapa-agentico');
  const mapaContextoHref = withLocale('/mapa-contexto');
  const claudeMdHref = withLocale('/claude-md');
  const skillsHref = withLocale('/skills');
  const glosarioHref = withLocale('/glosario');
  const comandosHref = withLocale('/comandos');
  const crearAppHref = withLocale('/crear-app');

  return (
    <div className='flex flex-col gap-10'>
      <header className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold'>{c.title}</h1>
        <p className='text-muted-foreground'>{c.intro}</p>
      </header>

      <section className='flex flex-col gap-4'>
        <h2 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
          {c.upcomingHeading}
        </h2>
        <Link href={workshopHref} className='block'>
          <Card className='group cursor-pointer text-left transition hover:border-primary/50 hover:shadow-md'>
            <CardHeader>
              <div className='mb-1 flex items-center justify-between'>
                <span className='rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary'>
                  {c.upcomingBadge}
                </span>
                <ArrowRight className='size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary' />
              </div>
              <CardTitle>{c.upcomingTitle}</CardTitle>
              <CardDescription>{c.upcomingDescription}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </section>

      <section className='flex flex-col gap-4'>
        <h2 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
          {c.sessionsHeading}
        </h2>
        <TrainingCard
          unlocked={unlocked}
          deckPath={SESSION_DECK_PATH}
          locale={lang}
        />
      </section>

      <section className='flex flex-col gap-4'>
        <h2 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
          {c.resourcesHeading}
        </h2>
        <ResourcesSection
          unlocked={unlocked}
          locale={lang}
          mapaHref={mapaHref}
          mapaContextoHref={mapaContextoHref}
          claudeMdHref={claudeMdHref}
          skillsHref={skillsHref}
          glosarioHref={glosarioHref}
          comandosHref={comandosHref}
          crearAppHref={crearAppHref}
        />
      </section>
    </div>
  );
}
