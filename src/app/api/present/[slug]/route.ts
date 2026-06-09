import { deckChannel, SLIDE_EVENT } from '@/features/presentations/channel';
import { getPusherServer } from '@/features/presentations/pusher.server';

type Props = {
  params: Promise<{ slug: string }>;
};

// TEMPORARY diagnostic — gated by the control secret. Reports presence + length
// (not values) of the prod env vars and the real Pusher error, to debug prod
// config. REMOVE after diagnosis.
export async function GET(request: Request) {
  const secret = process.env.PRESENTATION_CONTROL_SECRET;
  const url = new URL(request.url);
  if (!secret || url.searchParams.get('key') !== secret) {
    return new Response('Forbidden', { status: 403 });
  }

  const vars = {
    PUSHER_APP_ID: process.env.PUSHER_APP_ID,
    PUSHER_KEY: process.env.PUSHER_KEY,
    PUSHER_SECRET: process.env.PUSHER_SECRET,
    PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
    NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
    NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  };
  const presence = Object.fromEntries(
    Object.entries(vars).map(([k, v]) => [
      k,
      { present: Boolean(v), length: v?.length ?? 0 },
    ])
  );
  // Cluster is not secret; surfacing it makes a wrong-cluster obvious.
  const clusterValue = process.env.PUSHER_CLUSTER ?? null;

  let triggerError: string | null = null;
  try {
    await getPusherServer().trigger('cache-deck-__diag__', 'diag', { ok: true });
  } catch (error) {
    triggerError =
      error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  }

  return Response.json({ presence, clusterValue, triggerError });
}

// Broadcast a slide change. This is the ONLY place slides are published — the
// browser never publishes directly — and it's gated by the shared secret, so
// viewers cannot move the deck.
export async function POST(request: Request, { params }: Props) {
  const secret = process.env.PRESENTATION_CONTROL_SECRET;
  if (!secret) {
    return new Response('Presentation control secret is not configured', {
      status: 500,
    });
  }

  if (request.headers.get('x-presentation-secret') !== secret) {
    return new Response('Forbidden', { status: 403 });
  }

  const { slug } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  const index = (body as { index?: unknown }).index;
  if (typeof index !== 'number' || !Number.isInteger(index) || index < 0) {
    return new Response('`index` must be a non-negative integer', {
      status: 400,
    });
  }

  try {
    await getPusherServer().trigger(deckChannel(slug), SLIDE_EVENT, { index });
  } catch {
    return new Response('Realtime transport is not configured', {
      status: 500,
    });
  }

  return Response.json({ ok: true });
}
