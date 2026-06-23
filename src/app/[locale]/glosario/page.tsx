import type { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { GLOSSARY, USAGE } from './data';
import { GlossaryView } from './GlossaryView';
import { PrintButton } from './PrintButton';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function GlosarioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className='relative mx-auto flex min-h-screen max-w-[1320px] flex-col px-5 pb-16 pt-9 sm:px-9 print:py-0'>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header
        className='mb-12 flex flex-col gap-8 border-b pb-6 md:flex-row md:items-end md:justify-between'
        style={{ borderColor: 'var(--rule-strong)' }}
      >
        <div className='max-w-2xl'>
          <p className='mapa-eyebrow text-[15px]'>El glosario del taller</p>
          <h1 className='mapa-display mt-1 text-4xl font-semibold leading-[1.05] sm:text-5xl'>
            Glosario
          </h1>
          <p className='mt-3 text-[15px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
            Las palabras que salen en las slides, explicadas en cristiano. Si en algún momento te
            pierdes con un término, búscalo aquí: está pensado para que cualquiera lo entienda, sin
            necesidad de saber programar.
          </p>
        </div>
        <div className='shrink-0 md:max-w-[21rem] md:text-right'>
          <PrintButton />
          <p className='mapa-eyebrow text-sm'>Cómo usar este glosario</p>
          <ul className='mt-2 space-y-1'>
            {USAGE.map((t) => (
              <li key={t} className='text-sm' style={{ color: 'var(--ink-soft)' }}>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <GlossaryView sections={GLOSSARY} />

      {/* ── Footer note ──────────────────────────────────────────────────── */}
      <aside
        className='mt-14 border p-4'
        style={{ borderColor: 'var(--rule-strong)', background: 'var(--paper-2)' }}
      >
        <p className='mapa-eyebrow text-sm'>Sobre este glosario</p>
        <p className='mt-1 max-w-[74ch] text-[13.5px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
          No hace falta memorizarlo: con el uso, estas palabras te saldrán solas. Está aquí para
          consultarlo cuando lo necesites — y lo que no encuentres, se lo preguntas a Claude.
        </p>
      </aside>
    </div>
  );
}
