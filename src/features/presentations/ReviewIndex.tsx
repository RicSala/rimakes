'use client';

import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import type { SlideMeta } from './SlideStage';

type ResourceLink = { path: string; label: string; description?: string };

/**
 * Course-wide "maps" already linked from the deck (the "Recursos para ubicarte"
 * slide). Surfaced in the review index so attendees can reach them while
 * reviewing. `path` is locale-prefixed at render time.
 */
const RESOURCES: ResourceLink[] = [
  {
    path: '/mapa-agentico',
    label: 'Mapa de trabajo agéntico',
    description: 'Una foto de todos los conceptos',
  },
  {
    path: '/mapa-contexto',
    label: 'Dónde poner el contexto',
    description: 'CLAUDE.md, skills, MCPs… cuál elegir',
  },
  {
    path: '/claude-md',
    label: 'Tips para el CLAUDE.md',
    description: 'Qué poner y qué no',
  },
];

type ReviewIndexProps = {
  /** Per-slide metadata, parallel to the review deck's (already public-filtered) slides. */
  slidesMeta: SlideMeta[];
  /** Index of the slide currently shown, highlighted in the list. */
  current: number;
  /** Jump the review deck to a slide (the caller clamps + closes the drawer). */
  onJump: (index: number) => void;
  open: boolean;
  onClose: () => void;
};

type IndexEntry = { index: number; title: string };
type IndexGroup = {
  /** Section/module label; absent for the leading run before the first module. */
  section?: string;
  /** The divider slide the section header links to. */
  sectionIndex?: number;
  entries: IndexEntry[];
};

/**
 * Fold the flat slide list into module groups: a slide with a `section` starts a
 * new group (its header links to that divider slide, so it isn't repeated as a
 * child), and the slides that follow become its entries. Slides before the first
 * section land in a leading, header-less group.
 */
function buildGroups(slidesMeta: SlideMeta[]): IndexGroup[] {
  const groups: IndexGroup[] = [];
  let current: IndexGroup | undefined;

  slidesMeta.forEach((meta, index) => {
    if (meta.section) {
      current = { section: meta.section, sectionIndex: index, entries: [] };
      groups.push(current);
      return;
    }
    if (!current) {
      current = { entries: [] };
      groups.push(current);
    }
    current.entries.push({ index, title: meta.title?.trim() || `Slide ${index + 1}` });
  });

  return groups;
}

/**
 * Slide-over table of contents for the self-paced review deck. It's built from
 * the **already public-filtered** slide list (so it can never point at a slide
 * the audience shouldn't see) and grouped into modules by `{% slide section /%}`
 * markers. Rendered outside `SlideStage`, so it stays on neutral tokens rather
 * than re-coloring with the current slide's background scheme.
 */
export function ReviewIndex({
  slidesMeta,
  current,
  onJump,
  open,
  onClose,
}: ReviewIndexProps) {
  const groups = useMemo(() => buildGroups(slidesMeta), [slidesMeta]);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-[60] flex'>
      <button
        type='button'
        aria-label='Cerrar índice'
        onClick={onClose}
        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
      />
      <nav className='relative z-10 flex h-full w-full max-w-sm flex-col border-r border-border bg-background text-foreground shadow-xl'>
        <div className='flex items-center justify-between border-b border-border px-5 py-4'>
          <h2 className='text-base font-semibold'>Índice</h2>
          <button
            type='button'
            onClick={onClose}
            aria-label='Cerrar'
            className='rounded-md p-1 text-muted-foreground transition hover:text-foreground'
          >
            ✕
          </button>
        </div>

        <div className='flex-1 overflow-y-auto px-2 py-3'>
          {groups.map((group, groupIndex) => (
            <div key={group.sectionIndex ?? `lead-${groupIndex}`} className='mb-2'>
              {group.section !== undefined ? (
                <button
                  type='button'
                  onClick={() => onJump(group.sectionIndex!)}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-semibold transition hover:bg-muted ${
                    current === group.sectionIndex ? 'bg-muted' : ''
                  }`}
                >
                  {group.section}
                </button>
              ) : null}
              <ul
                className={
                  group.section !== undefined
                    ? 'mt-0.5 space-y-0.5 pl-3'
                    : 'space-y-0.5'
                }
              >
                {group.entries.map((entry) => {
                  const active = current === entry.index;
                  return (
                    <li key={entry.index}>
                      <button
                        type='button'
                        onClick={() => onJump(entry.index)}
                        aria-current={active ? 'true' : undefined}
                        className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition hover:bg-muted ${
                          active
                            ? 'bg-primary/10 font-medium text-foreground ring-1 ring-primary/30'
                            : 'text-muted-foreground'
                        }`}
                      >
                        <span className='w-7 shrink-0 text-right text-xs tabular-nums text-muted-foreground/70'>
                          {entry.index + 1}
                        </span>
                        <span className='flex-1 truncate'>{entry.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className='border-t border-border'>
          <button
            type='button'
            onClick={() => setResourcesOpen((open) => !open)}
            aria-expanded={resourcesOpen}
            className='flex w-full items-center justify-between px-5 py-3 text-sm font-semibold transition hover:bg-muted'
          >
            <span>Recursos</span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                resourcesOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          {resourcesOpen ? (
            <ul className='space-y-0.5 px-2 pb-3'>
              {RESOURCES.map((resource) => (
                <li key={resource.path}>
                  <a
                    href={`/${locale}${resource.path}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-start gap-2 rounded-md px-3 py-2 transition hover:bg-muted'
                  >
                    <ArrowUpRight className='mt-0.5 h-4 w-4 shrink-0 text-muted-foreground' />
                    <span className='flex flex-col'>
                      <span className='text-sm font-medium text-foreground'>
                        {resource.label}
                      </span>
                      {resource.description ? (
                        <span className='text-xs text-muted-foreground'>
                          {resource.description}
                        </span>
                      ) : null}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
