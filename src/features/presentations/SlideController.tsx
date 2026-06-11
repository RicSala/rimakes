'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';

import { deckChannel, SLIDE_EVENT, type SlidePayload } from './channel';
import { PresentationProvider } from './presentation-context';
import { getPusherClient } from './pusher.client';
import {
  SCHEME_CLASS,
  SlideStage,
  type SlideMeta,
  type SlideTheme,
} from './SlideStage';

// Keep the (<=30min) cache channel warm so late joiners stay correct on long talks.
const HEARTBEAT_MS = 4 * 60 * 1000;

const DEFAULT_THUMBNAIL_CONTENT = 'markdoc prose px-6 py-6 text-primary';

// Per-deck, presenter-only list of slides to skip. It lives in localStorage, not
// the realtime channel: viewers never navigate, so a hidden slide simply never
// gets broadcast and they never see it — no protocol/viewer change needed.
const HIDDEN_STORAGE_PREFIX = 'deck-hidden:';

/**
 * Read a deck's persisted hidden slides. Indices are absolute, so editing the
 * deck can shift them — unhide/re-hide to correct. Returns an empty set on the
 * server (no localStorage) or any parse error.
 */
function loadHidden(slug: string): Set<number> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(`${HIDDEN_STORAGE_PREFIX}${slug}`);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((n): n is number => typeof n === 'number'));
    }
  } catch {}
  return new Set();
}

type SlideControllerProps = {
  slug: string;
  slides: ReactNode[];
  secret: string;
  theme?: SlideTheme;
  slidesMeta?: SlideMeta[];
  /** Presenter-only speaker notes, indexed per slide (null where a slide has none). */
  notes?: (ReactNode | null)[];
};

/**
 * One overview thumbnail. The (potentially heavy) slide content is only rendered
 * once the cell scrolls near the viewport, so opening the overview on a large
 * deck mounts a handful of thumbnails instead of all of them at once.
 */
function SlideThumbnail({
  number,
  active,
  hidden,
  onSelect,
  onToggleHidden,
  contentClass,
  schemeClass,
  children,
}: {
  /** Position in the visible run (1..N); null for hidden slides, shown as "—". */
  number: number | null;
  active: boolean;
  /** Presenter-only skip flag. A hidden slide is never broadcast, so viewers —
   *  who only ever see the slide we send — never see it. */
  hidden: boolean;
  onSelect: () => void;
  onToggleHidden: () => void;
  contentClass: string;
  /** Per-slide theme scope (e.g. `slide-theme-brand`) so `bg-background` tints. */
  schemeClass?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || revealed) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [revealed]);

  // Opening the overview (this mounts) on the active slide — or advancing while
  // it's open — centers the current thumbnail, so on a long deck you instantly
  // see where you are instead of scanning for the highlighted cell.
  useEffect(() => {
    if (active) {
      ref.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [active]);

  // The cell is a <div> (not the jump <button>) so the eye toggle can sit inside
  // it as a real sibling <button> — nesting buttons would be invalid HTML.
  return (
    <div ref={ref} className='group relative aspect-[16/10]'>
      <button
        type='button'
        onClick={onSelect}
        aria-current={active}
        className={`absolute inset-0 overflow-hidden rounded-lg border-2 text-left transition ${
          active
            ? 'z-10 scale-[1.04] border-primary shadow-xl ring-4 ring-primary ring-offset-2 ring-offset-background'
            : 'border-border hover:border-primary/50'
        }`}
      >
        {/* The scheme scope tints the fill + content but stops short of the
            button, so the active border/ring keep using the root tokens and stay
            visible even over a brand/dark thumbnail. */}
        <div
          className={`absolute inset-0 bg-background ${schemeClass ?? ''} ${
            hidden ? 'grayscale' : ''
          }`}
        >
          {revealed ? (
            <div
              className='pointer-events-none absolute left-0 top-0 origin-top-left scale-[0.32]'
              style={{ width: '312.5%', height: '312.5%' }}
            >
              <div className={contentClass}>{children}</div>
            </div>
          ) : null}
        </div>
        {/* A flat gray veil — not a fade — so a hidden slide reads clearly grayed
            out in the grid even when its own background is white or brand. */}
        {hidden ? (
          <div className='pointer-events-none absolute inset-0 bg-gray-500/45' />
        ) : null}
        <span className='absolute bottom-1 right-1 rounded bg-background/80 px-1.5 text-xs font-medium tabular-nums'>
          {number ?? '—'}
        </span>
      </button>

      {hidden ? (
        <span className='pointer-events-none absolute left-1 top-1 z-10 rounded bg-foreground/80 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-background shadow-sm'>
          Oculta
        </span>
      ) : null}

      <button
        type='button'
        onClick={onToggleHidden}
        aria-pressed={hidden}
        title={
          hidden
            ? 'Mostrar — volverá a verla todo el mundo'
            : 'Ocultar — no la verá nadie'
        }
        className={`absolute right-1 top-1 z-10 rounded bg-background/80 px-1.5 py-0.5 text-xs shadow-sm transition hover:bg-background ${
          hidden
            ? 'opacity-100'
            : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
        }`}
      >
        {hidden ? '🙈' : '👁'}
      </button>
    </div>
  );
}

/**
 * Presenter surface: drives the deck locally and broadcasts each change through
 * the secret-gated server route. Publishing never happens directly from the
 * browser, so viewers can't move the deck. Every move — prev/next, keyboard, or
 * jumping straight to a slide from the overview grid — goes through `go()`, which
 * broadcasts, so the whole room follows along.
 */
export function SlideController({
  slug,
  slides,
  secret,
  theme,
  slidesMeta,
  notes,
}: SlideControllerProps) {
  const count = slides.length;
  const thumbnailContent = theme?.content ?? DEFAULT_THUMBNAIL_CONTENT;
  const [index, setIndex] = useState(0);
  const [overview, setOverview] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  // Presenter-only skip list for this deck, seeded from localStorage. Mirrored
  // into a ref so the stable nav callbacks read the latest set.
  const [hidden, setHidden] = useState<Set<number>>(() => loadHidden(slug));
  const hiddenRef = useRef<Set<number>>(hidden);
  // Where the speaker-notes panel sits (viewport top-left). null = default corner.
  // It's plain state, so the panel stays put across slide changes (the controller
  // never unmounts) without needing localStorage.
  const [notesPos, setNotesPos] = useState<{ x: number; y: number } | null>(null);
  const notesRef = useRef<HTMLDivElement>(null);
  const notesDrag = useRef<{
    pointerStartX: number;
    pointerStartY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const indexRef = useRef(0);
  const currentNotes = notes?.[index] ?? null;

  const setBoth = useCallback((next: number) => {
    indexRef.current = next;
    setIndex(next);
  }, []);

  const publish = useCallback(
    (next: number) => {
      void fetch(`/api/present/${slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-presentation-secret': secret,
        },
        body: JSON.stringify({ index: next }),
      }).catch(() => {});
    },
    [slug, secret]
  );

  const go = useCallback(
    (target: number) => {
      const clamped = Math.min(Math.max(target, 0), Math.max(count - 1, 0));
      setBoth(clamped);
      publish(clamped);
    },
    [count, publish, setBoth]
  );

  // Nearest non-hidden slide from `from` walking in `dir` (+1 / -1). -1 if none.
  const seekVisible = useCallback(
    (from: number, dir: 1 | -1, skip: Set<number>) => {
      for (let i = from + dir; i >= 0 && i < count; i += dir) {
        if (!skip.has(i)) return i;
      }
      return -1;
    },
    [count]
  );

  // Prev/next step over hidden slides instead of landing on them.
  const goNext = useCallback(() => {
    const next = seekVisible(indexRef.current, 1, hiddenRef.current);
    if (next >= 0) go(next);
  }, [seekVisible, go]);

  const goPrev = useCallback(() => {
    const prev = seekVisible(indexRef.current, -1, hiddenRef.current);
    if (prev >= 0) go(prev);
  }, [seekVisible, go]);

  // Toggle a slide's hidden flag and persist it. Hiding the slide we're currently
  // showing also advances the room to the next visible slide, so it disappears for
  // viewers right away (they only ever render the slide we broadcast).
  const toggleHidden = useCallback(
    (target: number) => {
      const isHidingCurrent =
        target === indexRef.current && !hiddenRef.current.has(target);

      setHidden((prev) => {
        const next = new Set(prev);
        if (next.has(target)) next.delete(target);
        else next.add(target);
        try {
          localStorage.setItem(
            `${HIDDEN_STORAGE_PREFIX}${slug}`,
            JSON.stringify([...next])
          );
        } catch {}
        return next;
      });

      if (isHidingCurrent) {
        const skip = new Set(hiddenRef.current).add(target);
        let dest = seekVisible(target, 1, skip);
        if (dest < 0) dest = seekVisible(target, -1, skip);
        if (dest >= 0) go(dest);
      }
    },
    [slug, seekVisible, go]
  );

  // Jump straight to any slide (from the overview) and close the grid.
  const jumpTo = useCallback(
    (target: number) => {
      go(target);
      setOverview(false);
    },
    [go]
  );

  // Drag the speaker-notes panel by its header. Pointer capture keeps the move
  // tracking even when the cursor leaves the handle; the position is clamped to
  // the viewport so the panel can't be dragged off-screen.
  const startNotesDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const panel = notesRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    notesDrag.current = {
      pointerStartX: event.clientX,
      pointerStartY: event.clientY,
      originX: rect.left,
      originY: rect.top,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const onNotesDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = notesDrag.current;
    const panel = notesRef.current;
    if (!drag || !panel) return;
    const x = drag.originX + (event.clientX - drag.pointerStartX);
    const y = drag.originY + (event.clientY - drag.pointerStartY);
    const maxX = Math.max(window.innerWidth - panel.offsetWidth, 0);
    const maxY = Math.max(window.innerHeight - panel.offsetHeight, 0);
    setNotesPos({
      x: Math.min(Math.max(x, 0), maxX),
      y: Math.min(Math.max(y, 0), maxY),
    });
  }, []);

  const endNotesDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    notesDrag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  // Keep the ref in sync so stable nav callbacks read the latest hidden set.
  useEffect(() => {
    hiddenRef.current = hidden;
  }, [hidden]);

  // Recover the current slide if the presenter refreshes — the cache channel
  // replays the last event — and stay consistent with our own broadcasts.
  useEffect(() => {
    const client = getPusherClient();
    if (!client) return;

    const channelName = deckChannel(slug);
    const channel = client.subscribe(channelName);
    const onSlide = (data: SlidePayload) => {
      if (typeof data?.index === 'number') {
        setBoth(Math.min(Math.max(data.index, 0), Math.max(count - 1, 0)));
      }
    };

    channel.bind(SLIDE_EVENT, onSlide);

    return () => {
      channel.unbind(SLIDE_EVENT, onSlide);
      client.unsubscribe(channelName);
    };
  }, [slug, count, setBoth]);

  // Keyboard navigation.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOverview(false);
        return;
      }
      if (event.key === 'o' || event.key === 'O') {
        event.preventDefault();
        setOverview((value) => !value);
        return;
      }
      if (event.key === 'n' || event.key === 'N') {
        event.preventDefault();
        setShowNotes((value) => !value);
        return;
      }
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
  }, [goNext, goPrev]);

  // Heartbeat keeps the cache channel warm.
  useEffect(() => {
    const id = setInterval(() => publish(indexRef.current), HEARTBEAT_MS);
    return () => clearInterval(id);
  }, [publish]);

  // Disable prev/next when no visible slide remains in that direction.
  const hasPrev = seekVisible(index, -1, hidden) >= 0;
  const hasNext = seekVisible(index, 1, hidden) >= 0;

  // Sequence numbers that skip hidden slides, so the grid + counter show the run
  // the audience actually sees (1..N) instead of raw positions. Hidden → null.
  const visibleNumbers: (number | null)[] = [];
  let runningVisible = 0;
  for (let i = 0; i < count; i += 1) {
    if (hidden.has(i)) {
      visibleNumbers.push(null);
    } else {
      runningVisible += 1;
      visibleNumbers.push(runningVisible);
    }
  }
  const visibleCount = runningVisible;

  const overlay = (
    <>
      {overview ? (
        <div className='fixed inset-0 z-40 flex flex-col overflow-auto bg-background/95 p-6 backdrop-blur'>
          <div className='mb-4 flex items-center justify-between gap-4'>
            <h2 className='text-lg font-semibold'>
              Jump to slide{' '}
              <span className='font-normal text-muted-foreground'>
                — everyone follows
              </span>
            </h2>
            <button
              type='button'
              onClick={() => setOverview(false)}
              className='shrink-0 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium shadow-sm'
            >
              Close ✕
            </button>
          </div>

          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
            {slides.map((slide, slideIndex) => {
              // Mirror SlideStage: a slide's `bg` scheme tints the thumbnail so
              // brand/dark slides stand out in the grid. With a scope active,
              // invert the prose so the content stays legible on the dark fill.
              const bg = slidesMeta?.[slideIndex]?.bg;
              const schemeClass = bg ? SCHEME_CLASS[bg] ?? '' : '';
              return (
                <SlideThumbnail
                  key={slideIndex}
                  number={visibleNumbers[slideIndex]}
                  active={slideIndex === index}
                  hidden={hidden.has(slideIndex)}
                  onSelect={() => jumpTo(slideIndex)}
                  onToggleHidden={() => toggleHidden(slideIndex)}
                  contentClass={
                    schemeClass
                      ? `${thumbnailContent} prose-invert`
                      : thumbnailContent
                  }
                  schemeClass={schemeClass}
                >
                  {slide}
                </SlideThumbnail>
              );
            })}
          </div>
        </div>
      ) : null}

      {!overview && currentNotes ? (
        showNotes ? (
          <div
            ref={notesRef}
            style={notesPos ? { left: notesPos.x, top: notesPos.y } : undefined}
            className={`pointer-events-auto fixed z-50 max-h-[40vh] w-[min(28rem,calc(100vw-2rem))] overflow-auto rounded-lg border border-border bg-background/95 p-4 shadow-lg backdrop-blur ${
              notesPos ? '' : 'bottom-24 left-4'
            }`}
          >
            <div
              onPointerDown={startNotesDrag}
              onPointerMove={onNotesDrag}
              onPointerUp={endNotesDrag}
              className='mb-2 flex cursor-move touch-none select-none items-center justify-between gap-2'
            >
              <span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                Notas del ponente
              </span>
              <button
                type='button'
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => setShowNotes(false)}
                className='shrink-0 cursor-pointer text-xs text-muted-foreground transition hover:text-foreground'
              >
                Ocultar (n)
              </button>
            </div>
            <div className='markdoc prose prose-sm max-w-none text-primary prose-headings:text-primary prose-a:text-primary'>
              {currentNotes}
            </div>
          </div>
        ) : (
          <button
            type='button'
            onClick={() => setShowNotes(true)}
            className='pointer-events-auto fixed bottom-24 left-4 z-50 rounded-md border border-border bg-background/95 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur transition hover:text-foreground'
          >
            📝 Notas (n)
          </button>
        )
      ) : null}

      <div className='pointer-events-auto fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-3 p-4'>
        <button
          type='button'
          onClick={goPrev}
          disabled={!hasPrev}
          className='rounded-md border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm transition disabled:opacity-40'
        >
          ← Prev
        </button>
        <button
          type='button'
          onClick={() => setOverview((value) => !value)}
          title='Overview — jump to any slide (o)'
          className='min-w-24 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium tabular-nums shadow-sm transition hover:border-primary/50'
        >
          {overview
            ? 'Close'
            : `⊞ ${visibleNumbers[index] ?? '–'} / ${visibleCount}`}
        </button>
        <button
          type='button'
          onClick={goNext}
          disabled={!hasNext}
          className='rounded-md border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm transition disabled:opacity-40'
        >
          Next →
        </button>
      </div>
    </>
  );

  return (
    <PresentationProvider slug={slug} secret={secret}>
      <SlideStage
        slides={slides}
        index={index}
        overlay={overlay}
        theme={theme}
        slidesMeta={slidesMeta}
      />
    </PresentationProvider>
  );
}
