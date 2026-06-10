import {
  deckChannel,
  SLIDE_EVENT,
  TIMER_EVENT,
  timerChannel,
  type TimerPayload,
} from '@/features/presentations/channel';
import { getPusherServer } from '@/features/presentations/pusher.server';

type Props = {
  params: Promise<{ slug: string }>;
};

const MIN_TIMER_MS = 1000;
const MAX_TIMER_MS = 6 * 60 * 60 * 1000;

// Broadcast a slide change or a timer command. This is the ONLY place either is
// published — the browser never publishes directly — and it's gated by the shared
// secret, so viewers cannot drive the deck or the timer.
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

  // Timer command (play / reset / adjust). Broadcast on its own cache channel so
  // it never clobbers the slide-position cache used by late joiners.
  const timer = (body as { timer?: unknown }).timer;
  if (timer !== undefined) {
    const t = (timer ?? {}) as Record<string, unknown>;
    const id = typeof t.id === 'string' && t.id ? t.id : 'default';
    const status = t.status;
    const durationMs = t.durationMs;
    if (
      (status !== 'running' && status !== 'idle') ||
      typeof durationMs !== 'number' ||
      !Number.isFinite(durationMs) ||
      durationMs < MIN_TIMER_MS ||
      durationMs > MAX_TIMER_MS
    ) {
      return new Response('Invalid `timer` payload', { status: 400 });
    }
    // The server stamps the absolute end time so every client counts down to the
    // same instant (modulo each device's clock skew).
    const payload: TimerPayload =
      status === 'running'
        ? { id, status, durationMs, endsAt: Date.now() + durationMs }
        : { id, status, durationMs };
    try {
      await getPusherServer().trigger(timerChannel(slug), TIMER_EVENT, payload);
    } catch {
      return new Response('Realtime transport is not configured', {
        status: 500,
      });
    }
    return Response.json({ ok: true });
  }

  // Slide change.
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
