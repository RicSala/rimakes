import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

type Align = 'start' | 'center' | 'end';

// In a flex column: cross axis = horizontal (items-*), main axis = vertical (justify-*).
const HORIZONTAL: Record<Align, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
};
const VERTICAL: Record<Align, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
};

export type SlideFrameProps = {
  children: ReactNode;
  /** Extra classes on the outer full-screen surface — typically a background. */
  background?: string;
  /** Horizontal placement of the content block. */
  align?: Align;
  /** Vertical placement of the content block. */
  justify?: Align;
  /** Small label rendered above the title. */
  eyebrow?: ReactNode;
  /** Optional slide heading rendered above `children`. */
  title?: ReactNode;
  /** Optional footer pinned to the bottom of the slide. */
  footer?: ReactNode;
  /** Extra classes on the inner content container. */
  className?: string;
};

/**
 * Shared full-bleed chrome for code-deck slides. Every template composes this:
 * it owns the screen-filling surface, padding, alignment, and the optional
 * eyebrow/title/footer scaffolding, so each template only describes its body.
 * Pure layout — a server component with no hooks.
 */
export function SlideFrame({
  children,
  background,
  align = 'center',
  justify = 'center',
  eyebrow,
  title,
  footer,
  className,
}: SlideFrameProps) {
  return (
    <div
      className={cn(
        'relative flex min-h-screen w-full flex-col px-10 py-16 sm:px-16 lg:px-24',
        HORIZONTAL[align],
        VERTICAL[justify],
        background
      )}
    >
      {/* Entrance animation is centralized in SlideStage (applies to every deck). */}
      <div className={cn('flex w-full max-w-5xl flex-col', className)}>
        {eyebrow ? (
          <div className='mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground'>
            {eyebrow}
          </div>
        ) : null}
        {title ? (
          <h2 className='text-balance text-4xl font-bold tracking-tight text-primary sm:text-5xl'>
            {title}
          </h2>
        ) : null}
        {children}
      </div>

      {footer ? (
        <div className='pointer-events-none absolute inset-x-0 bottom-6 flex justify-center text-sm text-muted-foreground'>
          {footer}
        </div>
      ) : null}
    </div>
  );
}
