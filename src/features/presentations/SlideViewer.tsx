'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { PresentationProvider } from './presentation-context';
import { SlideStage, type SlideMeta, type SlideTheme } from './SlideStage';
import { useSyncedSlide } from './useSyncedSlide';

type SlideViewerProps = {
  slug: string;
  slides: ReactNode[];
  theme?: SlideTheme;
  slidesMeta?: SlideMeta[];
};

/**
 * Audience surface. By default it follows the presenter over Pusher. When the
 * deck marks slides `public` (covered material), the audience can additionally
 * step ←/→ among those slides on their own — but the presenter stays the source
 * of truth: every live broadcast snaps the viewer back to the projected slide,
 * so during a session everyone mirrors what's on screen. A deck with no public
 * slides (e.g. the code-deck `/talk` viewer, which passes no `slidesMeta`)
 * behaves exactly as before: passive, no controls.
 */
export function SlideViewer({
  slug,
  slides,
  theme,
  slidesMeta,
}: SlideViewerProps) {
  const synced = useSyncedSlide(slug);
  const [index, setIndex] = useState(synced);

  // Each presenter move re-asserts the live slide. Between moves the audience may
  // roam the public slides; a `synced` change here pulls them back to the room.
  useEffect(() => {
    setIndex(synced);
  }, [synced]);

  // Slide indices the audience is allowed to navigate to on their own.
  const publicIndexes = useMemo(
    () =>
      slidesMeta
        ? slides.map((_, i) => i).filter((i) => slidesMeta[i]?.public === true)
        : [],
    [slides, slidesMeta]
  );
  const canSelfNavigate = publicIndexes.length >= 2;

  // Nearest public slide from `from` walking in `dir` (+1 / -1); -1 if none.
  const seekPublic = useCallback(
    (from: number, dir: 1 | -1) => {
      for (let i = from + dir; i >= 0 && i < slides.length; i += dir) {
        if (slidesMeta?.[i]?.public === true) return i;
      }
      return -1;
    },
    [slides.length, slidesMeta]
  );

  const goNext = useCallback(() => {
    const next = seekPublic(index, 1);
    if (next >= 0) setIndex(next);
  }, [index, seekPublic]);

  const goPrev = useCallback(() => {
    const prev = seekPublic(index, -1);
    if (prev >= 0) setIndex(prev);
  }, [index, seekPublic]);

  useEffect(() => {
    if (!canSelfNavigate) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        event.preventDefault();
        goNext();
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [canSelfNavigate, goNext, goPrev]);

  const hasPrev = canSelfNavigate && seekPublic(index, -1) >= 0;
  const hasNext = canSelfNavigate && seekPublic(index, 1) >= 0;
  // Position within the public run (1..N). When the live slide isn't itself
  // public, fall back to the count of public slides at/before it.
  const publicPos = publicIndexes.filter((i) => i <= index).length;

  const overlay = canSelfNavigate ? (
    <div className='pointer-events-auto fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-3 p-4'>
      <button
        type='button'
        onClick={goPrev}
        disabled={!hasPrev}
        className='rounded-md border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm transition disabled:opacity-40'
      >
        ← Anterior
      </button>
      <span className='min-w-20 text-center text-sm font-medium tabular-nums text-muted-foreground'>
        {Math.max(publicPos, 1)} / {publicIndexes.length}
      </span>
      <button
        type='button'
        onClick={goNext}
        disabled={!hasNext}
        className='rounded-md border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm transition disabled:opacity-40'
      >
        Siguiente →
      </button>
    </div>
  ) : undefined;

  return (
    <PresentationProvider slug={slug}>
      <SlideStage
        slides={slides}
        index={index}
        theme={theme}
        slidesMeta={slidesMeta}
        overlay={overlay}
        hideCounter
      />
    </PresentationProvider>
  );
}
