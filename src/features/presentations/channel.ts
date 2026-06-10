// Single source of truth for the realtime channel + event shape, shared by the
// server (publish) and the client (subscribe).

export const SLIDE_EVENT = 'slide-change';

export type SlidePayload = { index: number };

export const TIMER_EVENT = 'timer';

/**
 * Synced countdown state for a `{% timer %}` slide. `running` carries an absolute
 * `endsAt` (server epoch ms) so every client counts down to the same instant; the
 * presenter stays exact, viewers skew only by their own clock offset. `idle` is
 * the stopped/reset state showing `durationMs`. `id` lets multiple timers in one
 * deck stay independent (defaults to `'default'`).
 */
export type TimerPayload =
  | { id: string; status: 'idle'; durationMs: number }
  | { id: string; status: 'running'; durationMs: number; endsAt: number };

/**
 * Pusher channel for a deck. The `cache-` prefix makes this a cache channel:
 * Pusher replays the last triggered event to any newly subscribing client, so
 * late joiners / refreshers land on the current slide without a separate store.
 */
export function deckChannel(slug: string): string {
  return `cache-deck-${slug}`;
}

/**
 * Separate cache channel for timer events. Kept apart from `deckChannel` so a
 * timer broadcast never overwrites the cached last-slide event that positions
 * late joiners — each channel replays its own most recent event.
 */
export function timerChannel(slug: string): string {
  return `cache-deck-${slug}-timer`;
}
