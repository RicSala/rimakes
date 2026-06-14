import type { Locale } from 'next-intl';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { getDeck, getDeckSlugs } from '@/features/presentations/decks';
import {
  extractSlideMeta,
  splitNodeIntoSlides,
} from '@/features/presentations/splitSlides';
import { SlideViewer } from '@/features/presentations/SlideViewer';
import { hasTrainingAccess } from '@/features/training/access';
import { TrainingGate } from '@/features/training/TrainingGate';
import { renderMarkdoc } from '@/shared/blog/render';
import { routing } from '@/shared/internationalization/i18n/config';

type Props = {
  params: Promise<{ slug: string; locale: Locale }>;
};

export async function generateStaticParams() {
  const slugs = await getDeckSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export default async function PresentPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  // Gate the audience viewer behind the shared training password (the presenter
  // /control screen has its own secret gate and is unaffected). Reading the cookie
  // makes this route render dynamically.
  if (!(await hasTrainingAccess())) {
    return <TrainingGate redirectTo={`/present/${slug}`} />;
  }

  const deck = await getDeck(slug);
  if (!deck) {
    notFound();
  }

  const parsed = splitNodeIntoSlides(deck.content.node).map(extractSlideMeta);
  const slides = parsed.map(({ node }, slideIndex) => (
    <div key={slideIndex}>
      {renderMarkdoc({ node }, { openLinksInNewTab: true })}
    </div>
  ));
  // A deck marks a leading run of covered slides as `public` via `publicThrough`
  // (their count); the audience may self-navigate those. Per-slide `public` on a
  // `{% slide %}` directive still applies for one-off slides outside that run.
  const publicThrough =
    typeof deck.publicThrough === 'number' ? deck.publicThrough : 0;
  const slidesMeta = parsed.map(({ meta }, slideIndex) => ({
    ...meta,
    public: meta.public === true || slideIndex < publicThrough,
  }));

  return <SlideViewer slug={slug} slides={slides} slidesMeta={slidesMeta} />;
}
