import type { Locale } from 'next-intl';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { getDeck } from '@/features/presentations/decks';
import { splitNodeIntoSlides } from '@/features/presentations/splitSlides';
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

  const slides = splitNodeIntoSlides(deck.content.node).map((node, slideIndex) => (
    <div key={slideIndex}>{renderMarkdoc({ node })}</div>
  ));

  return <SlideController slug={slug} slides={slides} secret={secret} />;
}
