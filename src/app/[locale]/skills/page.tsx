import type { ReactNode } from 'react';
import type { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import {
  ABOUT,
  ADVANCED,
  ADVANCED_INTRO,
  ADVANCED_NOTE,
  ANATOMY_NOTES,
  ANTIPATTERNS,
  DESC_BAD,
  DESC_CALLOUT,
  DESC_GOOD,
  DESC_GOTCHA,
  DESC_RULES,
  EXAMPLE,
  FRONTMATTER,
  HOW,
  LAYOUT,
  LEVELS,
  LEVELS_NOTE,
  PRINCIPLES,
  PUNCHLINE,
  TAKEAWAYS,
  TREE,
  type Example,
} from './data';
import { PrintButton } from './PrintButton';

type Props = {
  params: Promise<{ locale: Locale }>;
};

// ── Tiny inline renderer: `code` and **bold** inside data strings ─────────────
// The design renders data as plain text; for a guide full of file names and
// fields, inline `code` really helps, so we tokenize just these two.
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /`([^`]+)`|\*\*([^*]+)\*\*/g;
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
    } else {
      out.push(
        <strong key={i++} style={{ color: 'var(--ink)' }}>
          {m[2]}
        </strong>,
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

// Eyebrow used to open every numbered section, matching /claude-md & /comandos.
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

// A worked description example - left rule + label, the text, and why it works.
function ExampleCard({ ex, accent }: { ex: Example; accent: string }) {
  return (
    <div className='border-l-2 pl-3' style={{ borderColor: accent }}>
      <p className='mapa-eyebrow text-sm' style={{ color: accent }}>
        {ex.label}
      </p>
      <p className='mt-1 text-[14px] leading-relaxed' style={{ color: 'var(--ink)' }}>
        «{ex.text}»
      </p>
      <p className='mt-1.5 text-[12.5px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
        {ex.note}
      </p>
    </div>
  );
}

export default async function SkillsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Accent per progressive-disclosure level: hero → work → assembly.
  const levelAccents = ['var(--c-core)', 'var(--c-surface)', 'var(--c-capability)'];

  return (
    <div className='relative mx-auto flex min-h-screen max-w-[1320px] flex-col px-5 pb-16 pt-9 sm:px-9 print:py-0'>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header
        className='mb-12 flex flex-col gap-8 border-b pb-6 md:flex-row md:items-end md:justify-between'
        style={{ borderColor: 'var(--rule-strong)' }}
      >
        <div className='max-w-2xl'>
          <p className='mapa-eyebrow text-[15px]'>Enseñarle una habilidad a Claude</p>
          <h1 className='mapa-display mt-1 text-4xl font-semibold leading-[1.05] sm:text-5xl'>
            Crear buenas skills
          </h1>
          <p className='mt-3 text-[15px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
            Qué es una skill, por qué la descripción lo decide casi todo, y cómo escribir una
            que Claude active en el momento justo -y siga- sea cual sea el proyecto.
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

      <div className='min-h-0 flex-1'>
        {/* ── 01 · Cómo funciona ─────────────────────────────────────────── */}
        <section>
          <SectionHead n='01' title='Cómo funciona' hint='el modelo mental' />

          {/* The punchline box */}
          <p
            className='mapa-display border-l-2 pl-4 text-lg leading-snug sm:text-xl'
            style={{ borderColor: 'var(--c-core)', color: 'var(--ink)' }}
          >
            {PUNCHLINE}
          </p>

          {/* The mechanics */}
          <div className='mt-7 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3'>
            {HOW.map((h) => (
              <div key={h.title} className='border-t pt-3' style={{ borderColor: 'var(--rule)' }}>
                <h3
                  className='mapa-display text-[15px] font-semibold'
                  style={{ color: 'var(--c-surface)' }}
                >
                  {h.title}
                </h3>
                <p className='mt-1 text-[13.5px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
                  {inline(h.body)}
                </p>
              </div>
            ))}
          </div>

          {/* The three levels of progressive disclosure - the central mechanic */}
          <div className='mt-10'>
            <p className='mapa-eyebrow text-sm'>La carga progresiva (los tres niveles)</p>
            <ul className='mt-3 space-y-2.5'>
              {LEVELS.map((lvl, i) => (
                <li
                  key={lvl.n}
                  className='grid grid-cols-[auto_1fr] items-baseline gap-x-4 border-b pb-2.5 sm:grid-cols-[auto_1.1fr_1fr]'
                  style={{ borderColor: 'var(--rule)' }}
                >
                  <span
                    className='mapa-display text-2xl font-semibold'
                    style={{ color: levelAccents[i] }}
                  >
                    {lvl.n}
                  </span>
                  <span>
                    <span
                      className='mapa-display block text-[14.5px] font-semibold'
                      style={{ color: 'var(--ink)' }}
                    >
                      {lvl.name}
                    </span>
                    <span className='text-[12.5px]' style={{ color: 'var(--ink-faint)' }}>
                      {lvl.when} · {lvl.size}
                    </span>
                  </span>
                  <span
                    className='col-span-2 text-[13px] leading-snug sm:col-span-1'
                    style={{ color: 'var(--ink-soft)' }}
                  >
                    {lvl.nick}
                  </span>
                </li>
              ))}
            </ul>
            <p className='mt-3 text-[13px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
              {inline(LEVELS_NOTE)}
            </p>
          </div>
        </section>

        {/* ── 02 · La descripción lo es todo ─────────────────────────────── */}
        <section className='mt-14 border-t pt-8' style={{ borderColor: 'var(--rule-strong)' }}>
          <SectionHead n='02' title='La descripción lo es todo' hint='lo de mayor impacto' />

          <p
            className='mb-8 border-l-2 pl-4 text-[15px] leading-relaxed'
            style={{ borderColor: 'var(--c-core)', color: 'var(--ink-soft)' }}
          >
            {DESC_CALLOUT}
          </p>

          <div className='grid gap-10 md:grid-cols-[1fr_1fr]'>
            {/* Rules */}
            <div>
              <p className='mapa-eyebrow text-sm'>Cómo escribirla</p>
              <ul className='mt-3 space-y-3'>
                {DESC_RULES.map((r) => (
                  <li key={r.title} className='border-l-2 pl-3' style={{ borderColor: 'var(--c-surface)' }}>
                    <p className='mapa-display text-[14.5px] font-semibold' style={{ color: 'var(--ink)' }}>
                      {r.title}
                    </p>
                    <p className='mt-0.5 text-[13px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
                      {r.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Worked good/bad examples + the gotcha */}
            <div>
              <p className='mapa-eyebrow text-sm'>De floja a buena</p>
              <div className='mt-3 space-y-4'>
                <ExampleCard ex={DESC_BAD} accent='var(--c-core)' />
                <ExampleCard ex={DESC_GOOD} accent='var(--c-surface)' />
              </div>
              <div
                className='mt-5 border p-3'
                style={{ borderColor: 'var(--rule-strong)', background: 'var(--paper-2)' }}
              >
                <p className='mapa-eyebrow text-sm' style={{ color: 'var(--c-capability)' }}>
                  Evita el flujo en la descripción
                </p>
                <p className='mt-1 text-[13px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
                  {DESC_GOTCHA}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 03 · La anatomía ───────────────────────────────────────────── */}
        <section className='mt-14 border-t pt-8' style={{ borderColor: 'var(--rule-strong)' }}>
          <SectionHead n='03' title='La anatomía' hint='el archivo y la carpeta' />

          <div className='grid gap-10 md:grid-cols-[1fr_1.1fr]'>
            {/* Left: what each part does + frontmatter + notes */}
            <div className='min-w-0'>
              <p className='mapa-eyebrow text-sm'>Qué hace cada parte</p>
              <ul className='mt-3 space-y-2'>
                {LAYOUT.map((l) => (
                  <li
                    key={l.path}
                    className='grid grid-cols-1 gap-x-4 gap-y-0.5 border-b pb-2 sm:grid-cols-[auto_1fr] sm:items-baseline'
                    style={{ borderColor: 'var(--rule)' }}
                  >
                    <code
                      className='mapa-display text-[14px] font-semibold'
                      style={{ color: 'var(--c-surface)' }}
                    >
                      {l.path}
                    </code>
                    <span className='text-[13px] leading-snug' style={{ color: 'var(--ink-soft)' }}>
                      {l.role}
                    </span>
                  </li>
                ))}
              </ul>

              <div className='mt-5'>
                <p className='mapa-eyebrow text-sm'>La cabecera (frontmatter)</p>
                <ul className='mt-3 space-y-2.5'>
                  {FRONTMATTER.map((f) => (
                    <li key={f.name} className='flex items-baseline gap-3'>
                      <code
                        className='shrink-0 rounded px-1.5 py-0.5 text-[12.5px] font-semibold'
                        style={{ background: 'var(--c-capability-soft)', color: 'var(--c-capability)' }}
                      >
                        {f.name}
                      </code>
                      <span className='text-[13px] leading-snug' style={{ color: 'var(--ink-soft)' }}>
                        {inline(f.rule)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <ul className='mt-5 space-y-1.5'>
                {ANATOMY_NOTES.map((n) => (
                  <li key={n} className='text-[12.5px] leading-relaxed' style={{ color: 'var(--ink-faint)' }}>
                    {inline(n)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: folder tree + an annotated SKILL.md */}
            <div className='min-w-0'>
              <p className='mapa-eyebrow text-sm'>La estructura</p>
              <pre
                className='mt-3 overflow-x-auto rounded border p-3 text-[12px] leading-relaxed'
                style={{ borderColor: 'var(--rule-strong)', background: 'var(--card)', color: 'var(--ink)' }}
              >
                <code className='block whitespace-pre font-mono'>{TREE}</code>
              </pre>
              <p className='mapa-eyebrow mt-6 text-sm'>Un SKILL.md de ejemplo</p>
              <pre
                className='mt-3 rounded border p-4 text-[12px] leading-relaxed'
                style={{ borderColor: 'var(--rule-strong)', background: 'var(--card)', color: 'var(--ink)' }}
              >
                <code className='block whitespace-pre-wrap break-words font-mono'>{EXAMPLE}</code>
              </pre>
              <p className='mt-2 text-[12.5px] leading-relaxed' style={{ color: 'var(--ink-faint)' }}>
                Fíjate: la descripción es puro «cuándo»; los pasos viven en el cuerpo, y el trabajo
                frágil se delega a un script que se ejecuta, no se lee.
              </p>
            </div>
          </div>
        </section>

        {/* ── 04 · Cómo escribirla bien ──────────────────────────────────── */}
        <section className='mt-14 border-t pt-8' style={{ borderColor: 'var(--rule-strong)' }}>
          <SectionHead n='04' title='Cómo escribirla bien' hint='principios y trampas' />

          <div className='grid gap-x-8 gap-y-5 sm:grid-cols-2'>
            {PRINCIPLES.map((p) => (
              <div key={p.title}>
                <h3 className='mapa-display text-[14.5px] font-semibold' style={{ color: 'var(--c-capability)' }}>
                  {p.title}
                </h3>
                <p className='mt-0.5 text-[13px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>

          {/* Anti-patterns */}
          <div className='mt-10 border-t pt-6' style={{ borderColor: 'var(--rule)' }}>
            <p className='mapa-eyebrow text-sm' style={{ color: 'var(--c-core)' }}>
              Lo que la hace fallar
            </p>
            <ul className='mt-3 grid gap-x-8 gap-y-2.5 sm:grid-cols-2'>
              {ANTIPATTERNS.map((a) => (
                <li
                  key={a.wrong}
                  className='border-l-2 pl-3'
                  style={{ borderColor: 'var(--c-core)' }}
                >
                  <p className='text-[13.5px] font-semibold' style={{ color: 'var(--ink)' }}>
                    {a.wrong}
                  </p>
                  <p className='text-[12.5px] leading-snug' style={{ color: 'var(--ink-soft)' }}>
                    {a.why}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── 05 · Avanzado ──────────────────────────────────────────────── */}
        <section className='mt-14 border-t pt-8' style={{ borderColor: 'var(--rule-strong)' }}>
          <SectionHead n='05' title='Avanzado' hint='afinar el control' />

          <p
            className='mb-8 border-l-2 pl-4 text-[15px] leading-relaxed'
            style={{ borderColor: 'var(--c-capability)', color: 'var(--ink-soft)' }}
          >
            {ADVANCED_INTRO}
          </p>

          <div className='grid gap-x-8 gap-y-6 md:grid-cols-2'>
            {ADVANCED.map((a) => (
              <div key={a.title} className='min-w-0 border-t pt-3' style={{ borderColor: 'var(--rule)' }}>
                <h3 className='mapa-display text-[15px] font-semibold' style={{ color: 'var(--c-surface)' }}>
                  {a.title}
                </h3>
                <p className='mt-1 text-[13.5px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
                  {a.body}
                </p>
                <pre
                  className='mt-2.5 rounded border p-2.5 text-[12px] leading-relaxed'
                  style={{ borderColor: 'var(--rule-strong)', background: 'var(--card)', color: 'var(--ink)' }}
                >
                  <code className='block whitespace-pre-wrap break-words font-mono'>{a.code}</code>
                </pre>
                {a.codeNote ? (
                  <p className='mt-1.5 text-[12px] leading-snug' style={{ color: 'var(--ink-faint)' }}>
                    {a.codeNote}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          <p className='mt-8 text-[13px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
            {inline(ADVANCED_NOTE)}
          </p>
        </section>
      </div>

      {/* ── Footer note ──────────────────────────────────────────────────── */}
      <aside
        className='mt-14 border p-4'
        style={{ borderColor: 'var(--rule-strong)', background: 'var(--paper-2)' }}
      >
        <p className='mapa-eyebrow text-sm'>Sobre esta guía</p>
        <p className='mt-1 max-w-[74ch] text-[13.5px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
          {ABOUT}
        </p>
      </aside>
    </div>
  );
}
