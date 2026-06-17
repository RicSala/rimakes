// The matrix itself. Columns are grouped under a coloured band so the column
// colours mean something: colour = "what kind of place it is". The scale value
// is shown as a 5-step "signal strength" indicator.
import {
  BANDS,
  GROUPS,
  MECHS,
  mechColor,
  vectorsByBand,
  type Band,
  type GroupId,
  type Vector,
} from './data';
import { SectionHead } from './shared';

// Columns are already ordered by group (momento, fondo, paquete), 2 each.
const GROUP_ORDER: GroupId[] = ['momento', 'fondo', 'paquete'];
const STEPS = 5;

function Pasos({ n, color }: { n: number; color: string }) {
  const filled = Math.round(Math.max(0, Math.min(1, n)) * STEPS);
  return (
    <div className='flex gap-[3px]'>
      {Array.from({ length: STEPS }).map((_, i) => (
        <span
          key={i}
          className='h-[7px] flex-1 rounded-[2px]'
          style={{ background: i < filled ? color : 'var(--rule)' }}
        />
      ))}
    </div>
  );
}

function Cells({ vector }: { vector: Vector }) {
  return (
    <>
      {MECHS.map((m) => {
        const cell = m.v[vector.id];
        return (
          <div key={m.id} className='border-l px-3 py-2.5' style={{ borderColor: 'var(--rule)' }}>
            {vector.kind === 'scale' && typeof cell.n === 'number' ? (
              <div className='mb-1.5 pt-1'>
                <Pasos n={cell.n} color={mechColor(m)} />
              </div>
            ) : null}
            <span className='block text-[12px] leading-tight' style={{ color: 'var(--ink-soft)' }}>
              {cell.t}
            </span>
          </div>
        );
      })}
    </>
  );
}

function BandBlock({ band }: { band: Band }) {
  return (
    <>
      <div
        className='px-3 py-2'
        style={{ gridColumn: '1 / -1', background: 'var(--paper-2)', borderTop: '1px solid var(--rule-strong)' }}
      >
        <span className='mapa-eyebrow text-[13px]' style={{ color: 'var(--ink)' }}>
          {BANDS[band].label}
        </span>{' '}
        <span className='text-[12px]' style={{ color: 'var(--ink-faint)' }}>
          — {BANDS[band].sub}
        </span>
      </div>
      {vectorsByBand(band).map((vector) => (
        <div key={vector.id} className='contents'>
          <div className='border-t px-3 py-2.5' style={{ borderColor: 'var(--rule)' }}>
            <span className='mapa-display text-[15px] font-semibold'>{vector.label}</span>
            <span className='mt-0.5 block text-[11.5px] italic leading-tight' style={{ color: 'var(--ink-faint)' }}>
              {vector.question}
            </span>
          </div>
          <Cells vector={vector} />
        </div>
      ))}
    </>
  );
}

export function MatrixGrid() {
  return (
    <section>
      <SectionHead n='01' title='La matriz' hint='fila = vector · columna = sitio' />

      <div className='overflow-x-auto print:overflow-visible'>
        <div
          className='grid min-w-[940px] text-sm'
          style={{ gridTemplateColumns: '190px repeat(6, minmax(120px, 1fr))' }}
        >
          {/* Group band — this is what makes the column colours legible */}
          <div />
          {GROUP_ORDER.map((g) => (
            <div key={g} className='border-l px-3 pb-2' style={{ gridColumn: 'span 2', borderColor: 'var(--rule)' }}>
              <span className='mapa-eyebrow text-[12px]' style={{ color: GROUPS[g].color }}>
                {GROUPS[g].label}
              </span>
              <span className='mt-0.5 block text-[11px] leading-tight' style={{ color: 'var(--ink-faint)' }}>
                {GROUPS[g].sub}
              </span>
              <span className='mt-1.5 block h-[3px] w-full rounded-full' style={{ background: GROUPS[g].color }} />
            </div>
          ))}

          {/* Column headers */}
          <div className='px-3 pb-3' />
          {MECHS.map((m) => (
            <div key={m.id} className='border-l px-3 pb-3' style={{ borderColor: 'var(--rule)' }}>
              <span className='mapa-display text-[15px] font-semibold leading-tight' style={{ color: mechColor(m) }}>
                {m.name}
              </span>
              <span className='mt-1 block text-[11px] leading-tight' style={{ color: 'var(--ink-faint)' }}>
                {m.kicker}
              </span>
            </div>
          ))}

          <BandBlock band='forma' />
          <BandBlock band='fuerza' />
        </div>
      </div>

      <p className='mt-3 text-[12.5px]' style={{ color: 'var(--ink-faint)' }}>
        Más pasos = más <em>bajo demanda · aislado · vinculante · barato · fácil de compartir</em>. El
        color agrupa los seis sitios por tipo (la banda de arriba).
      </p>
      <p className='mt-1 text-[12.5px]' style={{ color: 'var(--ink-faint)' }}>
        * La skill normalmente comparte tu contexto; de hecho, se puede configurar para que abra un
        contexto nuevo (como un subagente), pero es un caso avanzado.
      </p>
    </section>
  );
}
