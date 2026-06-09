'use client';

import { useEffect, useState } from 'react';

import { deckChannel, SLIDE_EVENT, type SlidePayload } from './channel';
import { getPusherClient } from './pusher.client';

/**
 * Read-only sync for viewers: returns the current slide index, kept in sync with
 * the presenter via a Pusher cache channel. Late joiners/refreshers receive the
 * last slide on subscribe; a cache miss (nothing published yet) falls back to 0.
 */
export function useSyncedSlide(slug: string): number {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const client = getPusherClient();
    if (!client) return;

    const channelName = deckChannel(slug);
    const channel = client.subscribe(channelName);

    const onSlide = (data: SlidePayload) => {
      if (typeof data?.index === 'number') {
        setIndex(data.index);
      }
    };

    channel.bind(SLIDE_EVENT, onSlide);
    channel.bind('pusher:cache_miss', () => setIndex(0));

    return () => {
      channel.unbind(SLIDE_EVENT, onSlide);
      client.unsubscribe(channelName);
    };
  }, [slug]);

  return index;
}
