'use client';

import { useEffect } from 'react';

import { useControlNav } from './control-nav-context';

type GotoProps = {
  /** Destination slide, referenced by its first-heading text (case/space exact). */
  title?: string;
  /** Button text; defaults to `Ver: <title>`. */
  label?: string;
};

/**
 * `{% goto title="Librerías y el stack" label="Ver: ¿Qué son las librerías?" /%}`
 * — a presenter shortcut, authored inside a build step's "A explicar" callout, to
 * hop to the fundamentals slide that explains the concept and return with «Volver».
 *
 * - On /control (has the nav context): a clickable button that jumps reversibly
 *   and broadcasts, so the room follows.
 * - Everywhere else (audience viewer, self-paced review): renders nothing — the
 *   audience never navigates on its own; they just follow the presenter's jump
 *   over Pusher. This is why it needs its OWN context (see control-nav-context).
 * - If the title no longer resolves (heading renamed/removed), it degrades to a
 *   muted, non-clickable chip so the presenter notices instead of a dead button,
 *   plus a dev-only console warning.
 */
export function Goto({ title, label }: GotoProps) {
  const nav = useControlNav();
  const index = nav && title ? nav.resolveTitle(title) : null;

  useEffect(() => {
    if (
      nav &&
      title &&
      index === null &&
      process.env.NODE_ENV !== 'production'
    ) {
      console.warn(
        `[goto] No slide titled "${title}" — link is inert. Did a heading get renamed?`
      );
    }
  }, [nav, title, index]);

  // Not under /control, or no destination given → nothing for the audience.
  if (!nav || !title) return null;

  const text = label ?? `Ver: ${title}`;

  if (index === null) {
    return (
      <span className='not-prose my-1 mr-2 inline-flex items-center gap-1.5 rounded-md border border-dashed border-muted-foreground/40 px-3 py-1.5 text-sm font-medium text-muted-foreground'>
        ↪ {text}
      </span>
    );
  }

  return (
    <button
      type='button'
      onClick={() => nav.jumpToTitle(title)}
      title={`Saltar a «${title}» — vuelve con «⤺ Volver» (b)`}
      className='not-prose my-1 mr-2 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground no-underline shadow-sm transition hover:opacity-90'
    >
      ↪ {text}
    </button>
  );
}
