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
 * browser, so viewers can't move the deck.
 */
export function SlideController({ slug, slides, secret }: SlideControllerProps) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
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
    <div className='pointer-events-auto fixed inset-x-0 bottom-0 flex items-center justify-center gap-3 p-4'>
      <button
        type='button'
        onClick={() => go(indexRef.current - 1)}
        disabled={index <= 0}
        className='rounded-md border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm transition disabled:opacity-40'
      >
        ← Prev
      </button>
      <span className='min-w-16 text-center text-sm tabular-nums text-muted-foreground'>
        {index + 1} / {count}
      </span>
      <button
        type='button'
        onClick={() => go(indexRef.current + 1)}
        disabled={index >= count - 1}
        className='rounded-md border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm transition disabled:opacity-40'
      >
        Next →
      </button>
    </div>
  );

  return <SlideStage slides={slides} index={index} overlay={overlay} />;
}
