import Pusher from 'pusher';

let server: Pusher | null = null;

/**
 * Lazily construct the server-side Pusher client. Kept lazy so the app builds
 * and runs even when Pusher env vars are absent — only the broadcast route,
 * which calls this, fails (with a clear error) until they're configured.
 */
export function getPusherServer(): Pusher {
  if (server) {
    return server;
  }

  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.PUSHER_CLUSTER;

  if (!appId || !key || !secret || !cluster) {
    throw new Error('Pusher server environment variables are not configured.');
  }

  server = new Pusher({ appId, key, secret, cluster, useTLS: true });
  return server;
}
