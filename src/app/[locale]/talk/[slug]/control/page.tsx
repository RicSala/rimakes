import type { Locale } from 'next-intl';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { getCodeDeck } from '@/features/presentations/code-decks/registry';
import { SlideController } from '@/features/presentations/SlideController';
import { CODE_THEME } from '@/features/presentations/templates';

type Props = {
  params: Promise<{ slug: string; locale: Locale }>;
  searchParams: Promise<{ key?: string }>;
};

export default async function TalkControlPage({ params, searchParams }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const { key } = await searchParams;
  const secret = process.env.PRESENTATION_CONTROL_SECRET;

  // Gate the presenter screen behind the shared secret (same as `present`).
  if (!secret || key !== secret) {
    notFound();
  }

  const deck = await getCodeDeck(slug);
  if (!deck) {
    notFound();
  }

  return (
    <SlideController
      slug={`code-${slug}`}
      slides={deck.slides}
      secret={secret}
      theme={CODE_THEME}
    />
  );
}
