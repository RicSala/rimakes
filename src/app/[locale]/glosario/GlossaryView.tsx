'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Search, X } from 'lucide-react';

import type { GlossarySection } from './data';

// Accent- and case-insensitive normaliser so "alucinacion" matches "Alucinación".
function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/[úü]/g, 'u')
    .replace(/ñ/g, 'n');
}

// Tiny inline renderer: `code` and **bold** inside definitions — same idea as
// /comandos. Definitions are plain text today; this keeps the door open.
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

function SectionHead({
  n,
  title,
  hint,
  count,
}: {
  n: string;
  title: string;
  hint: string;
  count: number;
}) {
  return (
    <div
      className='mb-6 flex items-baseline gap-3 border-b pb-2'
      style={{ borderColor: 'var(--rule)' }}
    >
      <span className='mapa-eyebrow text-sm' style={{ color: 'var(--ink-faint)' }}>
        {n}
      </span>
      <h2 className='mapa-display text-xl font-semibold sm:text-2xl'>{title}</h2>
      <span className='mapa-eyebrow text-sm'>
        {hint} · {count}
      </span>
    </div>
  );
}

export function GlossaryView({ sections }: { sections: GlossarySection[] }) {
  const [query, setQuery] = useState('');

  const q = norm(query.trim());

  // Filter entries by term + definition; drop sections left empty.
  const filtered = useMemo(() => {
    if (!q) return sections;
    return sections
      .map((s) => ({
        ...s,
        entries: s.entries.filter((e) => norm(e.term).includes(q) || norm(e.def).includes(q)),
      }))
      .filter((s) => s.entries.length > 0);
  }, [sections, q]);

  const total = useMemo(
    () => sections.reduce((acc, s) => acc + s.entries.length, 0),
    [sections],
  );
  const shown = filtered.reduce((acc, s) => acc + s.entries.length, 0);

  return (
    <div className='min-h-0 flex-1'>
      {/* ── Search ──────────────────────────────────────────────────────── */}
      <div className='mb-8 print:hidden'>
        <div
          className='flex items-center gap-2 border px-3 py-2'
          style={{ borderColor: 'var(--rule-strong)', background: 'var(--card)' }}
        >
          <Search size={16} strokeWidth={1.6} style={{ color: 'var(--ink-faint)' }} aria-hidden />
          <input
            type='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Busca un término o una palabra de su definición…'
            aria-label='Buscar en el glosario'
            className='w-full bg-transparent text-[15px] outline-none'
            style={{ color: 'var(--ink)' }}
          />
          {query ? (
            <button
              type='button'
              onClick={() => setQuery('')}
              aria-label='Borrar búsqueda'
              className='shrink-0'
              style={{ color: 'var(--ink-faint)' }}
            >
              <X size={16} strokeWidth={1.6} aria-hidden />
            </button>
          ) : null}
        </div>
        <p className='mapa-eyebrow mt-2 text-sm'>
          {q ? `${shown} de ${total} términos` : `${total} términos en ${sections.length} secciones`}
        </p>
      </div>

      {/* ── Section index (anchors) — only when not searching ───────────────── */}
      {!q ? (
        <nav className='mb-12 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 lg:grid-cols-4 print:hidden'>
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className='group flex items-baseline gap-2 py-1 text-[13.5px] transition-colors'
              style={{ color: 'var(--ink-soft)' }}
            >
              <span className='mapa-eyebrow text-xs' style={{ color: 'var(--ink-faint)' }}>
                {s.n}
              </span>
              <span className='underline-offset-4 group-hover:underline'>{s.title}</span>
            </a>
          ))}
        </nav>
      ) : null}

      {/* ── Sections ─────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <p className='py-10 text-center text-[15px]' style={{ color: 'var(--ink-soft)' }}>
          No hay términos que coincidan con «{query.trim()}». Prueba con otra palabra.
        </p>
      ) : (
        filtered.map((s, idx) => (
          <section
            key={s.id}
            id={s.id}
            className={idx === 0 ? 'scroll-mt-6' : 'mt-14 scroll-mt-6 border-t pt-8'}
            style={idx === 0 ? undefined : { borderColor: 'var(--rule-strong)' }}
          >
            <SectionHead n={s.n} title={s.title} hint={s.hint} count={s.entries.length} />
            <div className='grid gap-x-10 gap-y-6 md:grid-cols-2'>
              {s.entries.map((e) => (
                <div key={e.term} className='break-inside-avoid'>
                  <p
                    className='mapa-display text-[15.5px] font-semibold'
                    style={{ color: s.accent }}
                  >
                    {e.term}
                  </p>
                  <p
                    className='mt-1 text-[13.5px] leading-relaxed'
                    style={{ color: 'var(--ink-soft)' }}
                  >
                    {inline(e.def)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
