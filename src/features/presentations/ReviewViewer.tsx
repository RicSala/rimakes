'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';

import { PresentationProvider } from './presentation-context';
import { ReviewIndex } from './ReviewIndex';
import { SlideStage, type SlideMeta, type SlideTheme } from './SlideStage';

type ReviewViewerProps = {
  slug: string;
  slides: ReactNode[];
  theme?: SlideTheme;
  slidesMeta?: SlideMeta[];
};

/**
 * Self-paced review surface. Unlike `SlideViewer`, it **never subscribes to the
 * deck's Pusher channel** — the audience drives it locally with ←/→ — so the
 * presenter moving the *live* deck (e.g. while prepping the next session) can't
 * disturb someone reviewing here. It's handed an already-filtered slide list
 * (typically only the covered/`public` slides), so navigation is a simple 1..N.
 *
 * The provider slug is namespaced (`review-<slug>`) so any in-slide component
 * that talks to Pusher (e.g. `Timer`) uses its own channel rather than the live
 * deck's — the review surface stays fully decoupled from a running session.
 */
export function ReviewViewer({
  slug,
  slides,
  theme,
  slidesMeta,
}: ReviewViewerProps) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [indexOpen, setIndexOpen] = useState(false);

  const goNext = useCallback(
    () => setIndex((i) => Math.min(i + 1, count - 1)),
    [count]
  );
  const goPrev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);
  const jumpTo = useCallback(
    (target: number) => {
      setIndex(Math.min(Math.max(target, 0), count - 1));
      setIndexOpen(false);
    },
    [count]
  );

  useEffect(() => {
    // The index drawer owns the keyboard while open (it handles Escape); don't
    // also step the deck underneath it.
    if (indexOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (
        event.key === 'ArrowRight' ||
        event.key === 'PageDown' ||
        event.key === ' '
      ) {
        event.preventDefault();
        goNext();
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, indexOpen]);

  const overlay =
    count > 1 ? (
      <div className='pointer-events-auto fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-3 p-4'>
        {slidesMeta ? (
          <button
            type='button'
            onClick={() => setIndexOpen(true)}
            className='rounded-md border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm transition'
          >
            ☰ Índice
          </button>
        ) : null}
        <button
          type='button'
          onClick={goPrev}
          disabled={index === 0}
          className='rounded-md border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm transition disabled:opacity-40'
        >
          ← Anterior
        </button>
        <span className='min-w-20 text-center text-sm font-medium tabular-nums text-muted-foreground'>
          {index + 1} / {count}
        </span>
        <button
          type='button'
          onClick={goNext}
          disabled={index === count - 1}
          className='rounded-md border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm transition disabled:opacity-40'
        >
          Siguiente →
        </button>
        <button
          type='button'
          // Opens the (hidden, gated) continuous handout in a new tab; `?print=1`
          // makes it auto-open the print dialog, so this stays a one-click "Save
          // as PDF". Pathname-relative so we don't need the locale here.
          onClick={() =>
            window.open(
              `${window.location.pathname}/handout?print=1`,
              '_blank',
              'noopener'
            )
          }
          className='rounded-md border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm transition'
        >
          Descargar PDF
        </button>
      </div>
    ) : undefined;

  return (
    <PresentationProvider slug={`review-${slug}`}>
      <SlideStage
        slides={slides}
        index={index}
        theme={theme}
        slidesMeta={slidesMeta}
        overlay={overlay}
        hideCounter
      />
      {slidesMeta ? (
        <ReviewIndex
          slidesMeta={slidesMeta}
          current={index}
          onJump={jumpTo}
          open={indexOpen}
          onClose={() => setIndexOpen(false)}
        />
      ) : null}
    </PresentationProvider>
  );
}
