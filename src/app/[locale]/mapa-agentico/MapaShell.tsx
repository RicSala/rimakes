'use client';

import { FileDown } from 'lucide-react';
import { TAKEAWAYS } from './data';
import { MapPractice } from './MapPractice';
import { MapLegend } from './MapLegend';

// Una sola vista: el "Mapa de trabajo agéntico" (antes V4 «Cómo encajan»).
export function MapaShell() {
  return (
    <div className='relative mx-auto flex min-h-screen max-w-[1320px] flex-col px-5 pb-16 pt-9 sm:px-9'>
      <header
        className='mb-12 flex flex-col gap-8 border-b pb-6 md:flex-row md:items-end md:justify-between'
        style={{ borderColor: 'var(--rule-strong)' }}
      >
        <div className='max-w-2xl'>
          <p className='mapa-eyebrow text-[15px]'>
            Las piezas de la IA que hemos visto
          </p>
          <h1 className='mapa-display mt-1 text-4xl font-semibold leading-[1.05] sm:text-5xl'>
            Mapa de trabajo agéntico
          </h1>
          <p
            className='mt-3 text-[15px] leading-relaxed'
            style={{ color: 'var(--ink-soft)' }}
          >
            Lo mismo se monta de varias formas. Esto es lo que conviene tener
            claro al combinar las piezas.
          </p>
        </div>

        <div className='shrink-0 md:max-w-[19rem] md:text-right'>
          <button
            type='button'
            onClick={() => window.print()}
            title='Abre el diálogo de impresión — elige «Guardar como PDF»'
            className='mapa-btn mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm print:hidden'
          >
            <FileDown size={14} strokeWidth={1.6} aria-hidden />
            Descargar PDF
          </button>
          <p className='mapa-eyebrow text-sm'>Tres ideas que cruzan todo</p>
          <ul className='mt-2 space-y-1'>
            {TAKEAWAYS.map((t) => (
              <li key={t.text} className='text-sm' style={{ color: 'var(--ink-soft)' }}>
                {t.text}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className='min-h-0 flex-1'>
        <MapPractice />
      </div>

      <MapLegend />

      {/* Nota al pie discreta — mismo patrón que el pie de /mapa-contexto:
          filete superior + texto pequeño en itálica, sin caja ni fondo. */}
      <div className='mt-14 border-t pt-4' style={{ borderColor: 'var(--rule)' }}>
        <p
          className='max-w-[78ch] text-[12.5px] italic leading-relaxed'
          style={{ color: 'var(--ink-faint)' }}
        >
          Nota — es un mapa simplificado. La realidad tiene más matices y más
          piezas de las que caben aquí, pero espero que te ayude a guiarte y a
          encontrar por dónde tirar.
        </p>
      </div>
    </div>
  );
}
