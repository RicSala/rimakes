// Shared, static building blocks for "Dónde poner el contexto". Server-rendered,
// no hooks.
import type { CSSProperties, ReactNode } from 'react';
import { DECISION, PRECEDENCE, TAKEAWAYS } from './data';
import { PrintButton } from './PrintButton';

// Page chrome: cream header with eyebrow + the three takeaways, footer note.
export function Shell({
  eyebrow,
  subtitle,
  children,
  footer,
  style,
}: {
  eyebrow: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode; // the bottom callout (swappable while we pick a design)
  style?: CSSProperties; // lets a variant darken the muted text tokens, page-scoped
}) {
  return (
    <div
      className='relative mx-auto flex min-h-screen max-w-[1320px] flex-col px-5 pb-16 pt-9 sm:px-9 print:py-0'
      style={style}
    >
      <header
        className='mb-12 flex flex-col gap-8 border-b pb-6 md:flex-row md:items-end md:justify-between print:hidden'
        style={{ borderColor: 'var(--rule-strong)' }}
      >
        <div className='max-w-2xl'>
          <p className='mapa-eyebrow text-[15px]'>{eyebrow}</p>
          <h1 className='mapa-display mt-1 text-4xl font-semibold leading-[1.05] sm:text-5xl'>
            Dónde poner el contexto
          </h1>
          <p className='mt-3 text-[15px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
            {subtitle}
          </p>
        </div>
        <div className='shrink-0 md:max-w-[21rem] md:text-right'>
          <PrintButton />
          <p className='mapa-eyebrow text-sm'>Tres ideas que cruzan todo</p>
          <ul className='mt-2 space-y-1'>
            {TAKEAWAYS.map((t) => (
              <li key={t} className='text-sm' style={{ color: 'var(--ink-soft)' }}>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className='min-h-0 flex-1'>{children}</div>

      {footer}
    </div>
  );
}

// Eyebrow used to open every numbered section, matching /mapa-agentico.
export function SectionHead({ n, title, hint }: { n: string; title: string; hint?: string }) {
  return (
    <div className='mb-5 flex items-baseline gap-3 border-b pb-2' style={{ borderColor: 'var(--rule)' }}>
      <span className='mapa-eyebrow text-sm' style={{ color: 'var(--ink-faint)' }}>
        {n}
      </span>
      <h2 className='mapa-display text-xl font-semibold sm:text-2xl'>{title}</h2>
      {hint ? <span className='mapa-eyebrow text-sm'>{hint}</span> : null}
    </div>
  );
}

// Precedence strip — who wins when layers contradict.
export function Precedencia() {
  return (
    <div>
      <p className='mapa-eyebrow text-sm'>Quién gana si se contradicen</p>
      <div className='mt-2 flex flex-wrap items-center gap-x-2 gap-y-1'>
        {PRECEDENCE.map((p, i) => (
          <span key={p} className='flex items-center gap-2'>
            <span className='text-[13px]' style={{ color: 'var(--ink)' }}>
              {p}
            </span>
            {i < PRECEDENCE.length - 1 ? (
              <span style={{ color: 'var(--ink-faint)' }}>▸</span>
            ) : null}
          </span>
        ))}
      </div>
      <p className='mt-1 text-[12.5px]' style={{ color: 'var(--ink-faint)' }}>
        Manda lo más concreto y lo más reciente: el prompt pesa más que una línea enterrada en el
        CLAUDE.md.
      </p>
    </div>
  );
}

// Decision spine — "what goes where", the punchline.
export function Decision() {
  return (
    <div>
      <p className='mapa-eyebrow text-sm'>La regla: qué va dónde</p>
      <ul className='mt-3 space-y-2'>
        {DECISION.map((d) => (
          <li
            key={d.pick}
            className='grid grid-cols-1 gap-x-4 gap-y-0.5 sm:grid-cols-[1fr_auto] sm:items-baseline'
          >
            <span className='text-[14px]' style={{ color: 'var(--ink-soft)' }}>
              {d.when}
            </span>
            <span className='mapa-display text-[15px] font-semibold' style={{ color: 'var(--c-core)' }}>
              {d.pick}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
