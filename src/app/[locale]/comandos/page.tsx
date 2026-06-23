import type { ReactNode } from 'react';
import type { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import {
  CLAUDE_KEYS,
  CLAUDE_PUNCHLINE,
  CLAUDE_RUN,
  CLAUDE_SLASH,
  GIT_ALSO,
  GIT_PUNCHLINE,
  GIT_SAVE,
  GIT_SYNC,
  PATH_SYMBOLS,
  TERMINAL_FILES,
  TERMINAL_MOVE,
  TERMINAL_PUNCHLINE,
  TERMINAL_SHORTCUTS,
  USAGE,
  type Command,
  type PathSymbol,
  type Shortcut,
} from './data';
import { PrintButton } from './PrintButton';

type Props = {
  params: Promise<{ locale: Locale }>;
};

// ── Tiny inline renderer: `code` and **bold** inside data strings ─────────────
// The design renders data as plain text; for a cheat sheet inline `code` really
// helps, so we tokenize just these two — nothing else is interpreted.
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

// Eyebrow used to open every numbered section, matching /mapa-contexto & /claude-md.
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

// Path symbols: glyph + plain-language meaning (the part people trip on).
function SymbolList({ items }: { items: PathSymbol[] }) {
  return (
    <ul className='mt-3 space-y-2'>
      {items.map((s) => (
        <li
          key={s.sym}
          className='grid grid-cols-[3rem_1fr] items-baseline gap-x-4 border-b pb-2'
          style={{ borderColor: 'var(--rule)' }}
        >
          <code
            className='mapa-display text-[15px] font-semibold'
            style={{ color: 'var(--c-core)' }}
          >
            {s.sym}
          </code>
          <span className='text-[13px] leading-snug' style={{ color: 'var(--ink-soft)' }}>
            {inline(s.meaning)}
          </span>
        </li>
      ))}
    </ul>
  );
}

// A command: code on the left, what it does + (optional) etymology stacked right.
function CommandList({ items, accent }: { items: Command[]; accent: string }) {
  return (
    <ul className='mt-3 space-y-3'>
      {items.map((c) => (
        <li
          key={c.cmd}
          className='grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-[auto_1fr] sm:items-baseline'
        >
          <code
            className='mapa-display shrink-0 text-[14px] font-semibold'
            style={{ color: accent }}
          >
            {c.cmd}
          </code>
          <span>
            <span className='text-[13px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
              {inline(c.what)}
            </span>
            {c.from ? (
              <span className='mapa-eyebrow ml-2 text-[12px]' style={{ color: 'var(--ink-faint)' }}>
                ← {c.from}
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

// Keyboard shortcuts: key chip + what it does.
function ShortcutList({ items, accent }: { items: Shortcut[]; accent: string }) {
  return (
    <ul className='mt-3 space-y-2.5'>
      {items.map((s) => (
        <li key={s.key} className='flex items-baseline gap-3'>
          <code
            className='shrink-0 rounded px-1.5 py-0.5 text-[12.5px] font-semibold'
            style={{ background: 'var(--paper-2)', color: accent }}
          >
            {s.key}
          </code>
          <span className='text-[13px] leading-snug' style={{ color: 'var(--ink-soft)' }}>
            {inline(s.what)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default async function ComandosPage({ params }: Props) {
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
          <p className='mapa-eyebrow text-[15px]'>La chuleta del taller</p>
          <h1 className='mapa-display mt-1 text-4xl font-semibold leading-[1.05] sm:text-5xl'>
            Comandos básicos
          </h1>
          <p className='mt-3 text-[15px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
            Una referencia rápida de la terminal y de Claude Code para reconocerlos y empezar
            a usarlos. Tenla a mano y consúltala cuando dudes.
          </p>
        </div>
        <div className='shrink-0 md:max-w-[21rem] md:text-right'>
          <PrintButton />
          <p className='mapa-eyebrow text-sm'>Cómo usar esta chuleta</p>
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
        {/* ── 01 · La terminal ───────────────────────────────────────────── */}
        <section>
          <SectionHead n='01' title='La terminal' hint='lo esencial' />

          <p
            className='mapa-display border-l-2 pl-4 text-lg leading-snug sm:text-xl'
            style={{ borderColor: 'var(--c-core)', color: 'var(--ink)' }}
          >
            {inline(TERMINAL_PUNCHLINE)}
          </p>

          {/* Symbols + keyboard shortcuts, side by side */}
          <div className='mt-8 grid gap-10 md:grid-cols-[1.2fr_1fr]'>
            <div>
              <p className='mapa-eyebrow text-sm'>Símbolos de rutas (cómo se «lee» una ruta)</p>
              <SymbolList items={PATH_SYMBOLS} />
            </div>
            <div>
              <p className='mapa-eyebrow text-sm'>Atajos de teclado que te salvan</p>
              <ShortcutList items={TERMINAL_SHORTCUTS} accent='var(--c-surface)' />
            </div>
          </div>

          {/* Commands, in two families */}
          <div className='mt-10 grid gap-10 md:grid-cols-2'>
            <div>
              <p className='mapa-eyebrow text-sm' style={{ color: 'var(--c-surface)' }}>
                Moverte y mirar
              </p>
              <CommandList items={TERMINAL_MOVE} accent='var(--c-surface)' />
            </div>
            <div>
              <p className='mapa-eyebrow text-sm' style={{ color: 'var(--c-core)' }}>
                Tocar archivos y carpetas
              </p>
              <CommandList items={TERMINAL_FILES} accent='var(--c-core)' />
            </div>
          </div>

          <p className='mt-8 text-sm' style={{ color: 'var(--ink-soft)' }}>
            {inline(
              'Muchos comandos aceptan **opciones** («flags») con `-` o `--` — p. ej. `ls -a`, `rm -rf`. ¿Dudas con uno? Casi todos traen ayuda: `comando --help`.',
            )}
          </p>

        </section>

        {/* ── 02 · Claude Code ───────────────────────────────────────────── */}
        <section id='claude-code' className='mt-14 border-t pt-8' style={{ borderColor: 'var(--rule-strong)' }}>
          <SectionHead n='02' title='Claude Code' hint='primeros pasos' />

          <p
            className='mapa-display border-l-2 pl-4 text-lg leading-snug sm:text-xl'
            style={{ borderColor: 'var(--c-surface)', color: 'var(--ink)' }}
          >
            {inline(CLAUDE_PUNCHLINE)}
          </p>

          <div className='mt-8'>
            <p className='mapa-eyebrow text-sm'>Arrancar y salir</p>
            <CommandList items={CLAUDE_RUN} accent='var(--c-core)' />
          </div>

          <div className='mt-10 grid gap-10 md:grid-cols-2'>
            <div>
              <p className='mapa-eyebrow text-sm' style={{ color: 'var(--c-surface)' }}>
                Comandos con «/»
              </p>
              <CommandList items={CLAUDE_SLASH} accent='var(--c-surface)' />
            </div>
            <div>
              <p className='mapa-eyebrow text-sm' style={{ color: 'var(--c-capability)' }}>
                Una tecla, un truco
              </p>
              <ShortcutList items={CLAUDE_KEYS} accent='var(--c-capability)' />
            </div>
          </div>
        </section>

        {/* ── 03 · Git y GitHub ──────────────────────────────────────────── */}
        <section id='git' className='mt-14 border-t pt-8' style={{ borderColor: 'var(--rule-strong)' }}>
          <SectionHead n='03' title='Git y GitHub' hint='checkpoints' />

          <p
            className='mapa-display border-l-2 pl-4 text-lg leading-snug sm:text-xl'
            style={{ borderColor: 'var(--c-capability)', color: 'var(--ink)' }}
          >
            {inline(GIT_PUNCHLINE)}
          </p>

          <div className='mt-8 grid gap-10 md:grid-cols-2'>
            <div>
              <p className='mapa-eyebrow text-sm' style={{ color: 'var(--c-core)' }}>
                Guardar tu trabajo
              </p>
              <CommandList items={GIT_SAVE} accent='var(--c-core)' />
            </div>
            <div>
              <p className='mapa-eyebrow text-sm' style={{ color: 'var(--c-surface)' }}>
                Sincronizar con GitHub
              </p>
              <CommandList items={GIT_SYNC} accent='var(--c-surface)' />
            </div>
          </div>

          <div className='mt-10 border-t pt-6' style={{ borderColor: 'var(--rule)' }}>
            <p className='mapa-eyebrow text-sm'>También te cruzarás con</p>
            <CommandList items={GIT_ALSO} accent='var(--c-capability)' />
          </div>
        </section>
      </div>

      {/* ── Footer note ──────────────────────────────────────────────────── */}
      <aside
        className='mt-14 border p-4'
        style={{ borderColor: 'var(--rule-strong)', background: 'var(--paper-2)' }}
      >
        <p className='mapa-eyebrow text-sm'>Sobre esta chuleta</p>
        <p className='mt-1 max-w-[74ch] text-[13.5px] leading-relaxed' style={{ color: 'var(--ink-soft)' }}>
          Una referencia para consultar: reconoce lo que ves y, con el uso, te saldrán solos. Y
          lo que no recuerdes, se lo pides a Claude.
        </p>
      </aside>
    </div>
  );
}
