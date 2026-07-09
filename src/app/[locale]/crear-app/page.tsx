import type { ReactNode } from 'react';
import type { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import {
  FUNDAMENTOS,
  FUNDAMENTOS_PUNCHLINE,
  PASOS_PUNCHLINE,
  PHASES,
  STACK,
  STACK_NOTE,
  USAGE,
  type Step,
} from './data';
import { CopyPromptButton } from './CopyPromptButton';
import { PrintButton } from './PrintButton';

type Props = {
  params: Promise<{ locale: Locale }>;
};

// ── Tiny inline renderer: `code`, **bold**, *italic* and [links](url) ─────────
// Same idea as /comandos, extended with italics and links (the guide points at
// the shadcn preset gallery and the CLAUDE.md template download).
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      out.push(
        <code
          key={i++}
          className='rounded px-1 py-0.5 text-[0.92em]'
          style={{ background: 'var(--paper-2)', color: 'var(--ink)' }}
        >
          {m[1]}
        </code>,
      );
    } else if (m[2] !== undefined) {
      out.push(
        <strong key={i++} style={{ color: 'var(--ink)' }}>
          {m[2]}
        </strong>,
      );
    } else if (m[3] !== undefined) {
      out.push(<em key={i++}>{m[3]}</em>);
    } else {
      out.push(
        <a
          key={i++}
          href={m[5]}
          className='underline underline-offset-2'
          style={{ color: 'var(--ink)', textDecorationColor: 'var(--rule-strong)' }}
        >
          {m[4]}
        </a>,
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

// Eyebrow used to open every numbered section, matching /comandos & /claude-md.
function SectionHead({ n, title, hint }: { n: string; title: string; hint?: string }) {
  return (
    <div
      className='mb-6 flex items-baseline gap-3 border-b pb-2'
      style={{ borderColor: 'var(--rule)' }}
    >
      <span className='mapa-eyebrow text-sm' style={{ color: 'var(--ink-faint)' }}>
        {n}
      </span>
      <h2 className='mapa-display text-xl font-semibold sm:text-2xl'>{title}</h2>
      {hint ? <span className='mapa-eyebrow text-sm'>{hint}</span> : null}
    </div>
  );
}

// A step's prompt: collapsed on screen (<details>), expanded in the PDF (a
// print-only copy - CSS can't force a <details> open).
function PromptBlock({ text }: { text: string }) {
  const pre = (
    <pre
      className='overflow-x-auto whitespace-pre-wrap border-t px-3 py-2.5 text-[12.5px] leading-relaxed'
      style={{ borderColor: 'var(--rule)', color: 'var(--ink)' }}
    >
      {text}
    </pre>
  );

  return (
    <>
      <details
        className='group mt-2 max-w-[80ch] border print:hidden'
        style={{ borderColor: 'var(--rule-strong)', background: 'var(--card)' }}
      >
        <summary className='flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-1.5 [&::-webkit-details-marker]:hidden'>
          <span className='mapa-eyebrow text-[12.5px]'>
            <span className='mr-1.5 inline-block transition-transform group-open:rotate-90'>
              ▸
            </span>
            Prompt - cópialo y pégaselo a Claude
          </span>
          <CopyPromptButton text={text} />
        </summary>
        {pre}
      </details>
      <figure
        className='mt-2 hidden max-w-[80ch] border print:block'
        style={{ borderColor: 'var(--rule-strong)', background: 'var(--card)' }}
      >
        <figcaption className='mapa-eyebrow px-3 py-1.5 text-[12.5px]'>Prompt</figcaption>
        {pre}
      </figure>
    </>
  );
}

// One step of the build: number, title, one-line body, collapsed prompt.
function StepItem({ step, n }: { step: Step; n: number }) {
  return (
    <li className='break-inside-avoid border-t pt-3' style={{ borderColor: 'var(--rule)' }}>
      <div className='flex flex-wrap items-baseline gap-x-3 gap-y-1'>
        <span
          className='mapa-display text-lg font-semibold tabular-nums'
          style={{ color: 'var(--c-core)' }}
        >
          {String(n).padStart(2, '0')}
        </span>
        <h4 className='mapa-display text-[15.5px] font-semibold' style={{ color: 'var(--ink)' }}>
          {step.title}
        </h4>
        {step.concept ? (
          <a
            href={step.concept.anchor}
            className='mapa-eyebrow text-[12px] hover:underline print:hidden'
            style={{ color: 'var(--c-capability)' }}
          >
            ↑ {step.concept.label}
          </a>
        ) : null}
      </div>

      <p
        className='mt-1 max-w-[80ch] text-[13.5px] leading-relaxed'
        style={{ color: 'var(--ink-soft)' }}
      >
        {inline(step.body)}
      </p>

      {step.prompt ? <PromptBlock text={step.prompt} /> : null}
    </li>
  );
}

export default async function CrearAppPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Steps are numbered globally across phases so the build reads as one list.
  const phaseOffsets = PHASES.reduce<number[]>(
    (acc, phase) => [...acc, acc[acc.length - 1] + phase.steps.length],
    [0],
  );

  return (
    <div className='relative mx-auto flex min-h-screen max-w-[1320px] flex-col px-5 pb-16 pt-9 sm:px-9 print:py-0'>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header
        className='mb-10 flex flex-col gap-8 border-b pb-6 md:flex-row md:items-end md:justify-between'
        style={{ borderColor: 'var(--rule-strong)' }}
      >
        <div className='max-w-2xl'>
          <p className='mapa-eyebrow text-[15px]'>De la idea a la URL pública</p>
          <h1 className='mapa-display mt-1 text-4xl font-semibold leading-[1.05] sm:text-5xl'>
            Crear una app con Claude
          </h1>
          <p className='mt-3 text-[15px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
            Los nueve fundamentos, el stack por defecto y el paso a paso - del proyecto
            vacío a una app publicada.
          </p>
        </div>
        <div className='shrink-0 md:max-w-[21rem] md:text-right'>
          <PrintButton />
          <p className='mapa-eyebrow text-sm'>Cómo usar esta guía</p>
          <ul className='mt-2 space-y-1'>
            {USAGE.map((t) => (
              <li key={t} className='text-sm' style={{ color: 'var(--ink-soft)' }}>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className='min-h-0 flex-1'>
        {/* ── 01 · Las nueve piezas ──────────────────────────────────────── */}
        <section id='fundamentos'>
          <SectionHead n='01' title='Las nueve piezas' hint='los fundamentos' />

          <p
            className='mapa-display border-l-2 pl-4 text-lg leading-snug sm:text-xl'
            style={{ borderColor: 'var(--c-core)', color: 'var(--ink)' }}
          >
            {FUNDAMENTOS_PUNCHLINE}
          </p>

          <div className='mt-7 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3'>
            {FUNDAMENTOS.map((f, i) => (
              <div
                key={f.id}
                id={f.id}
                className='break-inside-avoid scroll-mt-6 border-t pt-3'
                style={{ borderColor: 'var(--rule)' }}
              >
                <h3 className='mapa-display text-[15px] font-semibold'>
                  <span className='tabular-nums' style={{ color: 'var(--ink-faint)' }}>
                    {i + 1} ·{' '}
                  </span>
                  <span style={{ color: 'var(--c-surface)' }}>{f.title}</span>
                </h3>
                <p
                  className='mt-1 text-[13px] leading-relaxed'
                  style={{ color: 'var(--ink-soft)' }}
                >
                  {inline(f.what)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 02 · El stack por defecto ──────────────────────────────────── */}
        <section
          id='stack'
          className='mt-12 border-t pt-8'
          style={{ borderColor: 'var(--rule-strong)' }}
        >
          <SectionHead n='02' title='El stack por defecto' hint='decidido una vez, para siempre' />

          <ul className='max-w-[86ch]'>
            {STACK.map((row) => (
              <li
                key={row.lib}
                className='grid grid-cols-1 gap-x-6 gap-y-0.5 border-b py-1.5 sm:grid-cols-[9rem_13rem_1fr] sm:items-baseline'
                style={{ borderColor: 'var(--rule)' }}
              >
                <span className='text-[12.5px]' style={{ color: 'var(--ink-faint)' }}>
                  {row.need}
                </span>
                <span
                  className='mapa-display text-[14px] font-semibold'
                  style={{ color: 'var(--c-capability)' }}
                >
                  {row.lib}
                </span>
                <span className='text-[13px] leading-snug' style={{ color: 'var(--ink-soft)' }}>
                  {row.gives}
                </span>
              </li>
            ))}
          </ul>

          <p
            className='mt-4 max-w-[86ch] text-[12.5px] leading-relaxed'
            style={{ color: 'var(--ink-faint)' }}
          >
            {inline(STACK_NOTE)}
          </p>
        </section>

        {/* ── 03 · De cero a publicada ───────────────────────────────────── */}
        <section
          id='pasos'
          className='mt-12 border-t pt-8'
          style={{ borderColor: 'var(--rule-strong)' }}
        >
          <SectionHead n='03' title='De cero a publicada' hint='el paso a paso' />

          <p
            className='mapa-display border-l-2 pl-4 text-lg leading-snug sm:text-xl'
            style={{ borderColor: 'var(--c-core)', color: 'var(--ink)' }}
          >
            {PASOS_PUNCHLINE}
          </p>

          {PHASES.map((phase, pi) => (
            <div key={phase.title} className='mt-8'>
              <div className='flex flex-wrap items-baseline gap-x-3 gap-y-1'>
                <span className='mapa-eyebrow text-sm' style={{ color: 'var(--ink-faint)' }}>
                  Fase {pi + 1}
                </span>
                <h3 className='mapa-display text-lg font-semibold' style={{ color: 'var(--ink)' }}>
                  {phase.title}
                </h3>
                {phase.intro ? <span className='mapa-eyebrow text-sm'>{phase.intro}</span> : null}
              </div>
              <ol className='mt-3 space-y-4'>
                {phase.steps.map((step, si) => (
                  <StepItem key={step.title} step={step} n={phaseOffsets[pi] + si + 1} />
                ))}
              </ol>
            </div>
          ))}
        </section>
      </div>

      {/* ── Footer note ──────────────────────────────────────────────────── */}
      <aside
        className='mt-12 border p-4'
        style={{ borderColor: 'var(--rule-strong)', background: 'var(--paper-2)' }}
      >
        <p className='mt-0 max-w-[74ch] text-[13.5px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
          Los prompts son los de la sesión: lo que va en [corchetes] lo adaptas a tu app.
          Ante la duda, pregúntale a Claude.
        </p>
      </aside>
    </div>
  );
}
