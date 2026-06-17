import { Suspense } from 'react';
import type { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { hasTrainingAccess } from '@/features/training/access';
import { TrainingGate } from '@/features/training/TrainingGate';
import { routing } from '@/shared/internationalization/i18n/config';
import { MapaShell } from './MapaShell';

type Props = {
  params: Promise<{ locale: Locale }>;
};

// Standalone workshop visual: el "Mapa de trabajo agéntico". Attendee-only —
// gated behind the same shared training password as the decks. Reading the
// access cookie makes this route dynamic (as in the deck review page).
export default async function MapaAgenticoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (!(await hasTrainingAccess())) {
    // Locale-aware return path (localePrefix is "as-needed": no prefix for the
    // default locale, so we must not emit "/es/…").
    const redirectTo =
      locale === routing.defaultLocale
        ? '/mapa-agentico'
        : `/${locale}/mapa-agentico`;
    return <TrainingGate redirectTo={redirectTo} />;
  }

  return (
    <Suspense fallback={null}>
      <MapaShell />
    </Suspense>
  );
}
