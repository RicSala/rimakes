import PusherJS from 'pusher-js';

let client: PusherJS | null = null;

/**
 * Lazily construct the browser Pusher client from the public (subscribe-only)
 * key. Returns null when env vars are missing so viewers degrade gracefully to
 * a static slide 0 instead of throwing.
 */
export function getPusherClient(): PusherJS | null {
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  if (!key || !cluster) {
    return null;
  }

  if (!client) {
    client = new PusherJS(key, { cluster });
  }

  return client;
}
