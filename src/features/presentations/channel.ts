// Single source of truth for the realtime channel + event shape, shared by the
// server (publish) and the client (subscribe).

export const SLIDE_EVENT = 'slide-change';

export type SlidePayload = { index: number };

/**
 * Pusher channel for a deck. The `cache-` prefix makes this a cache channel:
 * Pusher replays the last triggered event to any newly subscribing client, so
 * late joiners / refreshers land on the current slide without a separate store.
 */
export function deckChannel(slug: string): string {
  return `cache-deck-${slug}`;
}
