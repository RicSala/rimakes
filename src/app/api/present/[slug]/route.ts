import { deckChannel, SLIDE_EVENT } from '@/features/presentations/channel';
import { getPusherServer } from '@/features/presentations/pusher.server';

type Props = {
  params: Promise<{ slug: string }>;
};

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
