import type { Locale } from 'next-intl';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import {
  getCodeDeck,
  getCodeDeckSlugs,
} from '@/features/presentations/code-decks/registry';
import { SlideViewer } from '@/features/presentations/SlideViewer';
import { CODE_THEME } from '@/features/presentations/templates';
import { routing } from '@/shared/internationalization/i18n/config';

type Props = {
  params: Promise<{ slug: string; locale: Locale }>;
};

export function generateStaticParams() {
  const slugs = getCodeDeckSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export default async function TalkPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const deck = await getCodeDeck(slug);
  if (!deck) {
    notFound();
  }

  // `code-` prefix namespaces the realtime channel away from Keystatic decks.
  return (
    <SlideViewer slug={`code-${slug}`} slides={deck.slides} theme={CODE_THEME} />
  );
}
