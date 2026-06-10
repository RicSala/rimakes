'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { TIMER_EVENT, timerChannel, type TimerPayload } from './channel';
import { usePresentation } from './presentation-context';
import { getPusherClient } from './pusher.client';

const MIN_MS = 15_000;
const MAX_MS = 6 * 60 * 60 * 1000;
const DEFAULT_MS = 5 * 60 * 1000;

function parseDurationMs(minutes?: number, seconds?: number): number {
  const m = Number.isFinite(minutes) ? Number(minutes) : 0;
  const s = Number.isFinite(seconds) ? Number(seconds) : 0;
  const ms = Math.round((m * 60 + s) * 1000);
  if (!Number.isFinite(ms) || ms <= 0) return DEFAULT_MS;
  return Math.min(MAX_MS, Math.max(MIN_MS, ms));
}

function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const mm = Math.floor(total / 60);
  const ss = total % 60;
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

/**
 * A short triple-beep via Web Audio — nothing to ship, and it can be unlocked on
 * a user gesture so the presenter (who clicks Play) always hears it. Viewers
 * unlock on their first interaction; if they never interact, browser autoplay
 * policy may mute it, which is why the clock also flashes at zero.
 */
function useChime() {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensure = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    if (!ctxRef.current) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      ctxRef.current = new Ctor();
    }
    return ctxRef.current;
  }, []);

  const unlock = useCallback(() => {
    const ctx = ensure();
    if (ctx && ctx.state === 'suspended') void ctx.resume();
  }, [ensure]);

  const play = useCallback(() => {
    const ctx = ensure();
    if (!ctx) return;
    if (ctx.state === 'suspended') void ctx.resume();
    const start = ctx.currentTime;
    [0, 0.28, 0.56].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = i === 2 ? 1175 : 880;
      const at = start + offset;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.35, at + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.24);
      osc.connect(gain).connect(ctx.destination);
      osc.start(at);
      osc.stop(at + 0.26);
    });
  }, [ensure]);

  return { play, unlock };
}

type TimerProps = {
  minutes?: number;
  seconds?: number;
  id?: string;
  label?: string;
};

/**
 * Renders a synced countdown. The presenter (/control) gets Play / Reset and
 * ±time controls; pressing Play POSTs to the secret-gated API, which stamps an
 * absolute end time and broadcasts it so every viewer's clock starts together.
 * At zero it chimes and flashes. Display-only for viewers.
 */
export function Timer({ minutes, seconds, id, label }: TimerProps) {
  const timerId = id ? String(id) : 'default';
  const { slug, secret } = usePresentation();
  const isPresenter = Boolean(secret);

  const [durationMs, setDurationMs] = useState(() =>
    parseDurationMs(minutes, seconds)
  );
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const firedRef = useRef(false);
  const { play, unlock } = useChime();

  const running = endsAt !== null;
  const remainingMs = running ? endsAt - nowMs : durationMs;
  const finished = running && remainingMs <= 0;

  // Tick while running so the clock re-renders. `nowMs` is already seeded by
  // `apply` whenever it sets `endsAt`, so the effect only owns the interval.
  useEffect(() => {
    if (endsAt === null) return;
    const handle = setInterval(() => setNowMs(Date.now()), 200);
    return () => clearInterval(handle);
  }, [endsAt]);

  // Chime + flash exactly once, when the countdown crosses zero while watching.
  useEffect(() => {
    if (finished && !firedRef.current) {
      firedRef.current = true;
      play();
    }
  }, [finished, play]);

  const apply = useCallback(
    (payload: TimerPayload) => {
      if (!payload || payload.id !== timerId) return;
      if (payload.status === 'running') {
        // Suppress the chime if this run is already over on arrival (a late
        // joiner or a remount replaying a finished timer from the cache channel).
        firedRef.current = payload.endsAt - Date.now() <= 0;
        setDurationMs(payload.durationMs);
        setEndsAt(payload.endsAt);
        setNowMs(Date.now());
      } else {
        firedRef.current = false;
        setEndsAt(null);
        setDurationMs(payload.durationMs);
      }
    },
    [timerId]
  );

  // Both presenter and viewers follow the timer channel (a cache channel, so a
  // running timer is replayed to anyone landing on the slide mid-countdown).
  useEffect(() => {
    if (!slug) return;
    const client = getPusherClient();
    if (!client) return;
    const name = timerChannel(slug);
    const channel = client.subscribe(name);
    const onTimer = (data: TimerPayload) => apply(data);
    channel.bind(TIMER_EVENT, onTimer);
    return () => {
      channel.unbind(TIMER_EVENT, onTimer);
      client.unsubscribe(name);
    };
  }, [slug, apply]);

  // Viewers never click Play, so unlock audio on their first page interaction —
  // best-effort so the end chime can also sound on their device.
  useEffect(() => {
    if (isPresenter) return;
    const onInteract = () => unlock();
    window.addEventListener('pointerdown', onInteract, { once: true });
    window.addEventListener('keydown', onInteract, { once: true });
    return () => {
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
    };
  }, [isPresenter, unlock]);

  const post = useCallback(
    (next: { status: 'running' | 'idle'; durationMs: number }) => {
      if (!secret || !slug) return;
      void fetch(`/api/present/${slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-presentation-secret': secret,
        },
        body: JSON.stringify({ timer: { id: timerId, ...next } }),
      }).catch(() => {});
    },
    [secret, slug, timerId]
  );

  const startOrReset = () => {
    if (running) {
      post({ status: 'idle', durationMs });
    } else {
      unlock(); // presenter gesture — guarantees the chime later
      post({ status: 'running', durationMs });
    }
  };

  const adjust = (deltaMs: number) => {
    const next = Math.min(MAX_MS, Math.max(MIN_MS, durationMs + deltaMs));
    setDurationMs(next);
    post({ status: 'idle', durationMs: next }); // keep viewers' shown time in sync
  };

  const tone = finished
    ? 'text-red-500'
    : running && remainingMs <= 10_000
      ? 'text-amber-500'
      : 'text-primary';

  const adjustButton = 'rounded-md border border-border bg-background px-3 py-2 text-sm font-medium shadow-sm transition hover:border-primary/50';

  return (
    <div className='not-prose my-4 flex flex-col items-center gap-5'>
      {label ? (
        <div className='text-lg font-medium text-muted-foreground'>{label}</div>
      ) : null}

      <div
        className={`font-mono text-7xl font-bold tabular-nums sm:text-8xl ${tone} ${
          finished ? 'animate-pulse' : ''
        }`}
      >
        {formatClock(remainingMs)}
      </div>

      {isPresenter ? (
        <div className='flex flex-wrap items-center justify-center gap-2'>
          {!running ? (
            <>
              <button type='button' onClick={() => adjust(-60_000)} className={adjustButton}>
                −1 min
              </button>
              <button type='button' onClick={() => adjust(-15_000)} className={adjustButton}>
                −15 s
              </button>
              <button type='button' onClick={() => adjust(15_000)} className={adjustButton}>
                +15 s
              </button>
              <button type='button' onClick={() => adjust(60_000)} className={adjustButton}>
                +1 min
              </button>
            </>
          ) : null}
          <button
            type='button'
            onClick={startOrReset}
            className='rounded-md border border-primary bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90'
          >
            {running ? '↺ Reset' : '▶ Play'}
          </button>
        </div>
      ) : null}
    </div>
  );
}
