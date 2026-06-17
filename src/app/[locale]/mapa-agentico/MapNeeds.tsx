'use client';

import {
  Brain,
  Clock,
  Hammer,
  MessagesSquare,
  Package,
  Plug,
  SquareTerminal,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { byId, FAMILIES, piecesOf, type Piece } from './data';

// ── Tira de harneses (¿dónde trabajas?) ──────────────────────────────────────
// Cada celda lleva un icono de fondo muteado de lo que hace ese harnés.
const SURFACE_ICON: Record<string, LucideIcon> = {
  chat: MessagesSquare,
  cowork: Hammer,
  code: SquareTerminal,
};

export function SurfacesStrip() {
  const surfaces = piecesOf('surface');
  return (
    <div
      className='flex flex-col border-y sm:flex-row'
      style={{ borderColor: 'var(--rule)' }}
    >
      {surfaces.map((surface) => {
        const Icon = SURFACE_ICON[surface.id];
        return (
          <div
            key={surface.id}
            className='relative flex-1 overflow-hidden py-2.5 sm:border-l sm:px-4 sm:first:border-l-0 sm:first:pl-0'
            style={{ borderColor: 'var(--rule)' }}
          >
            {Icon && (
              <Icon
                aria-hidden
                className='pointer-events-none absolute right-3 top-2.5'
                size={44}
                strokeWidth={1.4}
                style={{ color: 'var(--c-surface)', opacity: 0.2 }}
              />
            )}
            <div className='relative z-10'>
              <p className='text-[15px]'>
                <span
                  className='font-semibold'
                  style={{ color: FAMILIES.surface.color }}
                >
                  {surface.name}
                </span>
              </p>
              <p
                className='text-[13px] leading-snug'
                style={{ color: 'var(--ink-soft)' }}
              >
                {surface.tagline}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Índice por necesidad (qué quieres → qué pieza) ────────────────────────────
const BUCKETS: { title: string; icon: LucideIcon; pieces: string[] }[] = [
  { title: 'Que conozca mi mundo', icon: Brain, pieces: ['claudemd', 'memoria'] },
  {
    title: 'Que haga tareas por mí',
    icon: Wrench,
    pieces: ['skills', 'subagentes', 'artifacts'],
  },
  {
    title: 'Que se conecte a mis apps y datos',
    icon: Plug,
    pieces: ['mcps', 'chrome', 'computeruse'],
  },
  { title: 'Que trabaje solo', icon: Clock, pieces: ['tareas', 'dispatch'] },
  {
    title: 'Aprovechar lo que ya hicieron otros',
    icon: Package,
    pieces: ['plugins'],
  },
];

// Marca de "primitivo": un cuadradito en color ladrillo antes de las 4 piezas
// core, mismo lenguaje que la muestra de la leyenda del pie.
function PieceName({ piece }: { piece: Piece }) {
  const color = FAMILIES[piece.family].color;
  if (piece.family !== 'core') return <span style={{ color }}>{piece.name}</span>;
  return (
    <span className='inline-flex items-center gap-1.5'>
      <span
        aria-hidden
        className='inline-block'
        style={{ width: 8, height: 8, background: color }}
      />
      <span style={{ color }}>{piece.name}</span>
    </span>
  );
}

function NeedRow({ piece }: { piece: Piece }) {
  const combos = (piece.combines ?? []).map(byId).filter(Boolean) as Piece[];
  return (
    <li
      className='grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-t py-3'
      style={{ borderColor: 'var(--rule)' }}
    >
      <span className='text-[15px] leading-snug'>{piece.need}</span>
      <span className='justify-self-end text-[15px] font-semibold'>
        <PieceName piece={piece} />
      </span>
      <p
        className='col-span-2 mt-1 max-w-[52ch] text-[13px] leading-snug'
        style={{ color: 'var(--ink-soft)' }}
      >
        {piece.tagline}
        {combos.length > 0 && (
          <span style={{ color: 'var(--ink-faint)' }}>
            {'  ·  con '}
            {combos.map((c) => c.name).join(', ')}
          </span>
        )}
        {piece.altHint && (
          <span className='italic' style={{ color: 'var(--ink-faint)' }}>
            {'  ·  '}
            {piece.altHint}
          </span>
        )}
      </p>
    </li>
  );
}

// Icono por bucket: dentro de una cajita con fondo suave.
function BucketTitle({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <h3 className='mapa-display flex items-center gap-2 text-lg font-semibold'>
      <span
        className='inline-flex h-7 w-7 items-center justify-center'
        style={{ background: 'var(--paper-2)' }}
      >
        <Icon size={15} strokeWidth={1.6} style={{ color: 'var(--ink-soft)' }} />
      </span>
      {title}
    </h3>
  );
}

export function NeedIndex() {
  return (
    <div className='gap-x-20 md:columns-2'>
      {BUCKETS.map((bucket) => (
        <section key={bucket.title} className='mb-11 break-inside-avoid'>
          <BucketTitle icon={bucket.icon} title={bucket.title} />
          <ul className='mt-2'>
            {bucket.pieces.map((id) => {
              const piece = byId(id);
              return piece ? <NeedRow key={id} piece={piece} /> : null;
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
