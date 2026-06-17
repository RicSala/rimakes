'use client';

import {
  Gauge,
  LifeBuoy,
  ShieldAlert,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { FAMILIES } from './data';
import { NeedIndex, SurfacesStrip } from './MapNeeds';

// V4 — "Cómo encajan". La versión completa: arriba el índice por necesidad
// (dónde trabajas + qué pieza coger) y debajo el criterio para combinarlas — la
// misma necesidad envuelta de varias formas, los proyectos y su CLAUDE.md, cómo
// no reventar el contexto, y un puñado de ideas que no se deben olvidar.

function SectionHead({ n, title, sub }: { n: string; title: string; sub?: string }) {
  return (
    <div
      className='mb-5 flex items-baseline gap-3 border-t pt-5'
      style={{ borderColor: 'var(--rule-strong)' }}
    >
      <span className='mapa-display text-sm tabular-nums' style={{ color: 'var(--ink-faint)' }}>
        {n}
      </span>
      <h2 className='mapa-display text-2xl font-semibold leading-none'>{title}</h2>
      {sub && (
        <span className='mapa-display text-sm italic' style={{ color: 'var(--ink-soft)' }}>
          {sub}
        </span>
      )}
    </div>
  );
}

// "Envoltorios" — the same goal, packaged differently.
const WRAPPERS = [
  {
    label: 'Como Skill',
    color: 'var(--c-core)',
    body: 'Una skill “responder-emails” con tu estilo y tus reglas; la lanzas tú cuando quieres (con /).',
  },
  {
    label: 'Como Subagente',
    color: 'var(--c-core)',
    body: 'Le delegas la bandeja entera y te trae los borradores hechos, sin ocupar tu conversación.',
  },
  {
    label: 'En CLAUDE.md + un MCP',
    color: 'var(--c-core)',
    body: 'Las reglas de cómo respondes, siempre activas, y un MCP de email para leer y enviar de verdad.',
  },
];

const PRINCIPLES: { lead: string; body: string; icon: LucideIcon }[] = [
  {
    lead: 'De generar a actuar',
    icon: Zap,
    body: 'El salto de valor no es que escriba mejor, es que haga cosas: tocar archivos, ejecutar, mandar. Apunta siempre a que actúe.',
  },
  {
    lead: 'El reflejo: pásaselo al agente',
    icon: LifeBuoy,
    body: 'Cuando te atascas, no pelees solo. Cuéntaselo (con pantallazo si hace falta) y deja que te guíe. Ese reflejo es medio curso.',
  },
  {
    lead: 'Ojo con lo de terceros',
    icon: ShieldAlert,
    body: 'Instalar skills, MCPs o plugins de otros es cargar el conocimiento (y los permisos) de alguien más. Mira qué instalas.',
  },
  {
    lead: 'El contexto es limitado',
    icon: Gauge,
    body: 'Por eso el CLAUDE.md va corto, por eso existe el progressive disclosure y por eso delegas en subagentes: para no llenarlo.',
  },
];

export function MapPractice() {
  return (
    <div className='space-y-14'>
      {/* 01 — Dónde trabajas y tus proyectos */}
      <section>
        <SectionHead n='01' title='Dónde trabajas, y tus proyectos' />
        <SurfacesStrip />
        <p className='mt-3 max-w-[80ch] text-[15px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
          Tanto en <strong style={{ color: 'var(--ink)' }}>Cowork</strong> como en{' '}
          <strong style={{ color: 'var(--ink)' }}>Chat</strong> puedes agrupar tu
          trabajo en <strong style={{ color: 'var(--ink)' }}>proyectos</strong>. No
          son lo mismo, pero los dos tienen su propio{' '}
          <span style={{ color: FAMILIES.core.color }}>CLAUDE.md</span>: las
          instrucciones que valen solo dentro de ese proyecto.
        </p>
      </section>

      {/* 02 — Encuentra tu pieza */}
      <section>
        <SectionHead n='02' title='Encuentra tu pieza' sub='lo que quieres → la pieza' />
        <NeedIndex />
      </section>

      {/* 03 — La misma cosa, de varias formas */}
      <section>
        <SectionHead n='03' title='La misma cosa, de varias formas' />
        <p className='mb-3 max-w-[80ch] text-[15px] leading-relaxed'>
          No hay una forma “correcta”. Imagina que quieres{' '}
          <em>algo que te ayude a contestar emails</em>. Lo puedes envolver así:
        </p>
        <div className='flex flex-col border-y sm:flex-row' style={{ borderColor: 'var(--rule)' }}>
          {WRAPPERS.map((w) => (
            <div
              key={w.label}
              className='flex-1 py-3 sm:border-l sm:px-4 sm:first:border-l-0 sm:first:pl-0'
              style={{ borderColor: 'var(--rule)' }}
            >
              <p
                className='mapa-display flex items-center gap-1.5 text-lg font-semibold'
                style={{ color: w.color }}
              >
                <span
                  aria-hidden
                  className='inline-block'
                  style={{ width: 8, height: 8, background: w.color }}
                />
                {w.label}
              </p>
              <p className='mt-0.5 text-[13.5px] leading-snug' style={{ color: 'var(--ink-soft)' }}>
                {w.body}
              </p>
            </div>
          ))}
        </div>
        <p className='mapa-display mt-3 max-w-[80ch] text-[15px] italic' style={{ color: 'var(--ink-soft)' }}>
          Eliges el envoltorio según cuánto se repite, cuánto quieres delegar y
          cuánto quieres que actúe solo. La pieza importa menos que el encaje.
        </p>
      </section>

      {/* 03 — Cuida tu CLAUDE.md */}
      <section>
        <SectionHead n='04' title='Cuida tu CLAUDE.md' />
        <p className='max-w-[80ch] text-[15px] leading-relaxed'>
          Mantenlo escueto: Claude lo lee entero cada vez. Si crece, no lo
          metas todo de golpe —{' '}
          <strong style={{ color: 'var(--ink)' }}>apunta a otro archivo</strong> y
          deja que lo lea solo cuando haga falta. Eso es{' '}
          <strong style={{ color: 'var(--ink)' }}>progressive disclosure</strong>:
          mantienes el contexto despejado y no lo revientas con cosas que casi
          nunca usas.
        </p>
        <p
          className='mt-3 max-w-[80ch] border-l-2 py-1 pl-3 font-mono text-[13px]'
          style={{ borderColor: 'var(--rule-strong)', color: 'var(--ink-soft)' }}
        >
          “Para el estilo de escritura, mira <span style={{ color: 'var(--ink)' }}>docs/estilo.md</span>.”
        </p>
      </section>

      {/* 05 — Para no olvidar */}
      <section>
        <SectionHead n='05' title='Para no olvidar' />
        <div className='gap-x-20 md:columns-2'>
          {PRINCIPLES.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.lead}
                className='mb-2 break-inside-avoid border-t py-4'
                style={{ borderColor: 'var(--rule)' }}
              >
                <p className='flex items-center gap-2 font-semibold'>
                  <span
                    className='inline-flex h-7 w-7 items-center justify-center'
                    style={{ background: 'var(--paper-2)' }}
                  >
                    <Icon
                      size={15}
                      strokeWidth={1.6}
                      style={{ color: 'var(--ink-soft)' }}
                    />
                  </span>
                  {p.lead}
                </p>
                <p
                  className='mt-1 max-w-[52ch] text-[13.5px] leading-snug'
                  style={{ color: 'var(--ink-soft)' }}
                >
                  {p.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
