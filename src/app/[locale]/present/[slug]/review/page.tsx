import type { Locale } from 'next-intl';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { getDeck } from '@/features/presentations/decks';
import {
  extractSlideMeta,
  splitNodeIntoSlides,
} from '@/features/presentations/splitSlides';
import { ReviewViewer } from '@/features/presentations/ReviewViewer';
import { hasTrainingAccess } from '@/features/training/access';
import { TrainingGate } from '@/features/training/TrainingGate';
import { renderMarkdoc } from '@/shared/blog/render';

type Props = {
  params: Promise<{ slug: string; locale: Locale }>;
};

/**
 * Self-paced review of the **covered** material — a separate surface from the
 * live, presenter-synced viewer at `/present/[slug]`. It's password-gated and
 * never subscribes to Pusher, so prepping the next session on `/control` can't
 * move anyone reviewing here. Reading the cookie makes this route dynamic.
 */
export default async function ReviewPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  if (!(await hasTrainingAccess())) {
    return <TrainingGate redirectTo={`/present/${slug}/review`} />;
  }

  const deck = await getDeck(slug);
  if (!deck) {
    notFound();
  }

  // Only the slides the deck marks public (covered material): the leading run set
  // by `publicThrough`, plus any per-slide `{% slide public=true /%}`.
  const publicThrough =
    typeof deck.publicThrough === 'number' ? deck.publicThrough : 0;
  const publicParsed = splitNodeIntoSlides(deck.content.node)
    .map(extractSlideMeta)
    .filter(({ meta }, slideIndex) => meta.public === true || slideIndex < publicThrough);

  if (publicParsed.length === 0) {
    notFound();
  }

  const slides = publicParsed.map(({ node }, slideIndex) => (
    <div key={slideIndex}>
      {renderMarkdoc({ node }, { openLinksInNewTab: true })}
    </div>
  ));
  const slidesMeta = publicParsed.map(({ meta }) => meta);

  return <ReviewViewer slug={slug} slides={slides} slidesMeta={slidesMeta} />;
}
