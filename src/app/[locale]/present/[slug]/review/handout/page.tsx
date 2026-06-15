import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { ContinuousDeck } from '@/features/presentations/ContinuousDeck';
import { getDeck } from '@/features/presentations/decks';
import {
  extractSlideMeta,
  splitNodeIntoSlides,
} from '@/features/presentations/splitSlides';
import { hasTrainingAccess } from '@/features/training/access';
import { TrainingGate } from '@/features/training/TrainingGate';
import { renderMarkdoc } from '@/shared/blog/render';

type Props = {
  params: Promise<{ slug: string; locale: Locale }>;
  searchParams: Promise<{ print?: string }>;
};

/**
 * The page title doubles as the default "Save as PDF" filename, so derive it
 * from the deck rather than letting it fall back to the app-wide default. Also
 * keep this unlinked, password-gated route out of search.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const deck = await getDeck(slug);
  const title = deck?.title ? `${deck.title} — Diapositivas` : slug;
  return {
    title,
    robots: { index: false, follow: false },
  };
}

/**
 * A continuous, printable handout of the **covered** material — the same public
 * slides as `/present/[slug]/review`, but stacked vertically so the browser can
 * "Save as PDF". Reached only via the review view's "Download PDF" button (with
 * `?print=1`, which auto-opens the print dialog). Like review, it's gated and
 * never subscribes to Pusher, so prepping the next session can't disturb it.
 */
export default async function HandoutPage({ params, searchParams }: Props) {
  const { slug, locale } = await params;
  const { print } = await searchParams;
  setRequestLocale(locale);

  if (!(await hasTrainingAccess())) {
    return <TrainingGate redirectTo={`/present/${slug}/review/handout`} />;
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

  return (
    <ContinuousDeck
      slug={slug}
      slides={slides}
      slidesMeta={slidesMeta}
      autoPrint={print === '1'}
    />
  );
}
