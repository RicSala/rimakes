import type { Locale } from 'next-intl';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { getDeck, getDeckSlugs } from '@/features/presentations/decks';
import { splitNodeIntoSlides } from '@/features/presentations/splitSlides';
import { SlideViewer } from '@/features/presentations/SlideViewer';
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

  const deck = await getDeck(slug);
  if (!deck) {
    notFound();
  }

  const slides = splitNodeIntoSlides(deck.content.node).map((node, slideIndex) => (
    <div key={slideIndex}>{renderMarkdoc({ node })}</div>
  ));

  return <SlideViewer slug={slug} slides={slides} />;
}
