import type { Locale } from 'next-intl';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { getDeck } from '@/features/presentations/decks';
import {
  extractSlideMeta,
  splitNodeIntoSlides,
} from '@/features/presentations/splitSlides';
import { SlideController } from '@/features/presentations/SlideController';
import { renderMarkdoc } from '@/shared/blog/render';

type Props = {
  params: Promise<{ slug: string; locale: Locale }>;
  searchParams: Promise<{ key?: string }>;
};

export default async function ControlPage({ params, searchParams }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const { key } = await searchParams;
  const secret = process.env.PRESENTATION_CONTROL_SECRET;

  // Gate the presenter screen behind the shared secret.
  if (!secret || key !== secret) {
    notFound();
  }

  const deck = await getDeck(slug);
  if (!deck) {
    notFound();
  }

  const parsed = splitNodeIntoSlides(deck.content.node).map(extractSlideMeta);
  const slides = parsed.map(({ node }, slideIndex) => (
    <div key={slideIndex}>{renderMarkdoc({ node })}</div>
  ));
  const slidesMeta = parsed.map(({ meta }) => meta);
  // Presenter-only: rendered here (the secret-gated /control screen) and never on
  // the audience viewer, which doesn't read `notes` at all.
  const notes = parsed.map(({ notes: slideNotes }, slideIndex) =>
    slideNotes ? (
      <div key={slideIndex}>{renderMarkdoc({ node: slideNotes })}</div>
    ) : null
  );

  return (
    <SlideController
      slug={slug}
      slides={slides}
      secret={secret}
      slidesMeta={slidesMeta}
      notes={notes}
    />
  );
}
