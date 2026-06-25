import type { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import {
  CALLOUT,
  DO,
  DONT,
  HOW,
  PLACES,
  PRECEDENCE,
  PRINCIPLES,
  PUNCHLINE,
  SHORTCUTS,
  TAKEAWAYS,
} from './data';

type Props = {
  params: Promise<{ locale: Locale }>;
};

// Eyebrow used to open every numbered section, matching /mapa-contexto & /mapa-agentico.
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

export default async function ClaudeMdPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className='relative mx-auto flex min-h-screen max-w-[1320px] flex-col px-5 pb-16 pt-9 sm:px-9'>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header
        className='mb-12 flex flex-col gap-8 border-b pb-6 md:flex-row md:items-end md:justify-between'
        style={{ borderColor: 'var(--rule-strong)' }}
      >
        <div className='max-w-2xl'>
          <p className='mapa-eyebrow text-[15px]'>La memoria del proyecto</p>
          <h1 className='mapa-display mt-1 text-4xl font-semibold leading-[1.05] sm:text-5xl'>
            Entender el CLAUDE.md
          </h1>
          <p className='mt-3 text-[15px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
            Cómo funciona el archivo que Claude lee solo, y qué conviene meter dentro —
            y qué no— sea cual sea el proyecto.
          </p>
        </div>
        <div className='shrink-0 md:max-w-[21rem] md:text-right'>
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
              <div
                key={h.title}
                className='border-t pt-3'
                style={{ borderColor: 'var(--rule)' }}
              >
                <h3 className='mapa-display text-[15px] font-semibold' style={{ color: 'var(--c-surface)' }}>
                  {h.title}
                </h3>
                <p className='mt-1 text-[13.5px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
                  {h.body}
                </p>
              </div>
            ))}
          </div>

          {/* Where it lives + precedence + shortcuts */}
          <div className='mt-10 grid gap-10 md:grid-cols-[1.2fr_1fr]'>
            <div>
              <p className='mapa-eyebrow text-sm'>Dónde vive (y para quién)</p>
              <ul className='mt-3 space-y-2'>
                {PLACES.map((p) => (
                  <li
                    key={p.name}
                    className='grid grid-cols-1 gap-x-4 gap-y-0.5 border-b pb-2 sm:grid-cols-[auto_1fr] sm:items-baseline'
                    style={{ borderColor: 'var(--rule)' }}
                  >
                    <span className='mapa-display text-[14.5px] font-semibold' style={{ color: 'var(--c-surface)' }}>
                      {p.name}
                    </span>
                    <span className='text-[13px]' style={{ color: 'var(--ink-soft)' }}>
                      <code className='text-[12px]' style={{ color: 'var(--ink-faint)' }}>
                        {p.path}
                      </code>
                      {' · '}
                      {p.scope}
                    </span>
                  </li>
                ))}
              </ul>

              <div className='mt-4'>
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
                  Manda lo más concreto y lo más reciente.
                </p>
              </div>
            </div>

            <div>
              <p className='mapa-eyebrow text-sm'>Atajos que conviene conocer</p>
              <ul className='mt-3 space-y-2.5'>
                {SHORTCUTS.map((s) => (
                  <li key={s.key} className='flex items-baseline gap-3'>
                    <code
                      className='shrink-0 rounded px-1.5 py-0.5 text-[12.5px] font-semibold'
                      style={{ background: 'var(--c-capability-soft)', color: 'var(--c-capability)' }}
                    >
                      {s.key}
                    </code>
                    <span className='text-[13px] leading-snug' style={{ color: 'var(--ink-soft)' }}>
                      {s.what}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── 02 · Qué poner y qué no ────────────────────────────────────── */}
        <section className='mt-14 border-t pt-8' style={{ borderColor: 'var(--rule-strong)' }}>
          <SectionHead n='02' title='Qué poner y qué no' hint='vale para todos' />

          {/* The balance the whole section turns on */}
          <p
            className='mb-8 border-l-2 pl-4 text-[15px] leading-relaxed'
            style={{ borderColor: 'var(--c-capability)', color: 'var(--ink-soft)' }}
          >
            {CALLOUT}
          </p>

          <div className='grid gap-10 md:grid-cols-2'>
            {/* IN */}
            <div>
              <p className='mapa-eyebrow text-sm' style={{ color: 'var(--c-surface)' }}>
                Va dentro
              </p>
              <ul className='mt-3 space-y-3'>
                {DO.map((d) => (
                  <li key={d.title} className='border-l-2 pl-3' style={{ borderColor: 'var(--c-surface)' }}>
                    <p className='mapa-display text-[14.5px] font-semibold' style={{ color: 'var(--ink)' }}>
                      {d.title}
                    </p>
                    <p className='mt-0.5 text-[13px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
                      {d.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* OUT */}
            <div>
              <p className='mapa-eyebrow text-sm' style={{ color: 'var(--c-core)' }}>
                Se queda fuera
              </p>
              <ul className='mt-3 space-y-3'>
                {DONT.map((d) => (
                  <li key={d.title} className='border-l-2 pl-3' style={{ borderColor: 'var(--c-core)' }}>
                    <p className='mapa-display text-[14.5px] font-semibold' style={{ color: 'var(--ink)' }}>
                      {d.title}
                    </p>
                    <p className='mt-0.5 text-[13px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
                      {d.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* How to write it — cross-cutting principles */}
          <div className='mt-10 border-t pt-6' style={{ borderColor: 'var(--rule)' }}>
            <p className='mapa-eyebrow text-sm'>Y cómo escribirlo (vale para cualquiera)</p>
            <div className='mt-3 grid gap-x-8 gap-y-4 sm:grid-cols-2'>
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
          </div>
        </section>

      </div>

      {/* ── Footer note ──────────────────────────────────────────────────── */}
      <aside
        className='mt-14 border p-4'
        style={{ borderColor: 'var(--rule-strong)', background: 'var(--paper-2)' }}
      >
        <p className='mapa-eyebrow text-sm'>Sobre esta guía</p>
        <p className='mt-1 max-w-[74ch] text-[13.5px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
          Estas directrices valen para <em>cualquier</em> CLAUDE.md. Lo que cambia de un
          proyecto a otro son los ejemplos concretos: qué comando, qué carpeta, qué gotcha.
        </p>
      </aside>
    </div>
  );
}
