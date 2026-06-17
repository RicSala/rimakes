import type { CSSProperties } from 'react';
import type { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { hasTrainingAccess } from '@/features/training/access';
import { TrainingGate } from '@/features/training/TrainingGate';
import { routing } from '@/shared/internationalization/i18n/config';
import { Decision, Precedencia, Shell } from './shared';
import { MatrixGrid } from './MatrixGrid';

type Props = {
  params: Promise<{ locale: Locale }>;
};

// Page-scoped: the cream palette's muted tokens read a touch too light, so we
// darken them here only (cascades to every child via CSS variable inheritance).
const DARKER_TEXT = {
  '--ink-soft': '#574f3f',
  '--ink-faint': '#7c7159',
} as unknown as CSSProperties;

// "Dónde poner el contexto" — standalone workshop visual: a matrix comparing the
// six places you can put context against the same vectors. Attendee-only — gated
// behind the same shared training password as the decks and /mapa-agentico.
// Reading the access cookie makes this route dynamic.
export default async function MapaContextoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (!(await hasTrainingAccess())) {
    // Locale-aware return path (localePrefix is "as-needed": no prefix for the
    // default locale, so we must not emit "/es/…").
    const redirectTo =
      locale === routing.defaultLocale
        ? '/mapa-contexto'
        : `/${locale}/mapa-contexto`;
    return <TrainingGate redirectTo={redirectTo} />;
  }

  return (
    <Shell
      eyebrow='Seis sitios, los mismos vectores'
      subtitle='Al final todo es lo mismo: facilitar al agente el contexto adecuado mientras protegemos su contexto, que es limitado. Cada herramienta lo gestiona de una forma distinta.'
      style={DARKER_TEXT}
      footer={
        <div className='mt-14 border-t pt-4 print:hidden' style={{ borderColor: 'var(--rule)' }}>
          <p
            className='max-w-[78ch] text-[12.5px] italic leading-relaxed'
            style={{ color: 'var(--ink-faint)' }}
          >
            Nota — es un mapa simplificado. La realidad tiene más matices y más sitios donde meter
            contexto (MCPs, hooks, @-referencias, la memoria…) de los que caben aquí, pero espero que
            te ayude a guiarte y a decidir qué va dónde.
          </p>
        </div>
      }
    >
      <MatrixGrid />

      <section
        className='mt-14 grid gap-10 border-t pt-8 md:grid-cols-2 print:hidden'
        style={{ borderColor: 'var(--rule-strong)' }}
      >
        <Decision />
        <Precedencia />
      </section>
    </Shell>
  );
}
