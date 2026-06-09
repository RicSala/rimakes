'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { deckChannel, SLIDE_EVENT, type SlidePayload } from './channel';
import { getPusherClient } from './pusher.client';
import { SlideStage } from './SlideStage';

// Keep the (<=30min) cache channel warm so late joiners stay correct on long talks.
const HEARTBEAT_MS = 4 * 60 * 1000;

type SlideControllerProps = {
  slug: string;
  slides: ReactNode[];
  secret: string;
};

/**
 * Presenter surface: drives the deck locally and broadcasts each change through
 * the secret-gated server route. Publishing never happens directly from the
 * browser, so viewers can't move the deck. Every move — prev/next, keyboard, or
 * jumping straight to a slide from the overview grid — goes through `go()`, which
 * broadcasts, so the whole room follows along.
 */
export function SlideController({ slug, slides, secret }: SlideControllerProps) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [overview, setOverview] = useState(false);
  const indexRef = useRef(0);

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

  // Jump straight to any slide (from the overview) and close the grid.
  const jumpTo = useCallback(
    (target: number) => {
      go(target);
      setOverview(false);
    },
    [go]
  );

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
      if (
        event.key === 'ArrowRight' ||
        event.key === 'PageDown' ||
        event.key === ' '
      ) {
        event.preventDefault();
        go(indexRef.current + 1);
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        go(indexRef.current - 1);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  // Heartbeat keeps the cache channel warm.
  useEffect(() => {
    const id = setInterval(() => publish(indexRef.current), HEARTBEAT_MS);
    return () => clearInterval(id);
  }, [publish]);

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
            {slides.map((slide, slideIndex) => (
              <button
                type='button'
                key={slideIndex}
                onClick={() => jumpTo(slideIndex)}
                aria-current={slideIndex === index}
                className={`group relative aspect-[16/10] overflow-hidden rounded-lg border-2 bg-background text-left transition ${
                  slideIndex === index
                    ? 'border-primary ring-2 ring-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {/* Scaled-down live render of the slide as a thumbnail. */}
                <div
                  className='pointer-events-none absolute left-0 top-0 origin-top-left scale-[0.32]'
                  style={{ width: '312.5%', height: '312.5%' }}
                >
                  <div className='markdoc prose px-6 py-6 text-primary'>
                    {slide}
                  </div>
                </div>
                <span className='absolute bottom-1 right-1 rounded bg-background/80 px-1.5 text-xs font-medium tabular-nums'>
                  {slideIndex + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className='pointer-events-auto fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-3 p-4'>
        <button
          type='button'
          onClick={() => go(indexRef.current - 1)}
          disabled={index <= 0}
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
          {overview ? 'Close' : `⊞ ${index + 1} / ${count}`}
        </button>
        <button
          type='button'
          onClick={() => go(indexRef.current + 1)}
          disabled={index >= count - 1}
          className='rounded-md border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm transition disabled:opacity-40'
        >
          Next →
        </button>
      </div>
    </>
  );

  return <SlideStage slides={slides} index={index} overlay={overlay} />;
}
