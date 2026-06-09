import { cache } from 'react';
import { createReader } from '@keystatic/core/reader';
import type { Locale } from 'next-intl';

import { keystaticConfig } from '@/keystatic.config';
import { routing } from '@/shared/internationalization/i18n/config';
import type { MarkdocPost, MarkdocPostMeta } from '@/shared/blog/types';

const reader = createReader(process.cwd(), keystaticConfig);

type PostEntry = Awaited<
  ReturnType<typeof reader.collections.posts.all>
>[number]['entry'];

export const getMarkdocPosts = cache(async (locale: Locale) => {
  const entries = await reader.collections.posts.all({
    resolveLinkedFiles: true,
  });

  return entries
    .map(({ slug, entry }) => splitLocale(slug, entry))
    .filter((post): post is LocalizedEntry => post !== null)
    .filter((post) => post.locale === locale)
    .filter((post) => post.entry.status === 'published')
    .map((post) => toPostMeta(post.slug, post.locale, post.entry))
    .sort(
      (left, right) =>
        new Date(right.publishedAt).getTime() -
        new Date(left.publishedAt).getTime()
    );
});

export const getMarkdocPost = cache(
  async (slug: string, locale: Locale): Promise<MarkdocPost | undefined> => {
    const entry = await reader.collections.posts.read(`${locale}/${slug}`, {
      resolveLinkedFiles: true,
    });

    if (!entry || entry.status !== 'published') {
      return undefined;
    }

    return {
      ...toPostMeta(slug, locale, entry),
      content: entry.content,
    };
  }
);

export async function getMarkdocPostStaticParams() {
  const params = await Promise.all(
    routing.locales.map(async (locale) => {
      const posts = await getMarkdocPosts(locale);

      return posts.map((post) => ({
        locale,
        slug: post.slug,
      }));
    })
  );

  return params.flat();
}

type LocalizedEntry = {
  locale: Locale;
  slug: string;
  entry: PostEntry;
};

function splitLocale(slug: string, entry: PostEntry): LocalizedEntry | null {
  const separatorIndex = slug.indexOf('/');

  if (separatorIndex === -1) {
    return null;
  }

  const locale = slug.slice(0, separatorIndex);
  const postSlug = slug.slice(separatorIndex + 1);

  if (!postSlug || !isSupportedLocale(locale)) {
    return null;
  }

  return { locale, slug: postSlug, entry };
}

function isSupportedLocale(locale: string): locale is Locale {
  return (routing.locales as readonly string[]).includes(locale);
}

function toPostMeta(
  slug: string,
  locale: Locale,
  entry: PostEntry
): MarkdocPostMeta {
  return {
    slug,
    locale,
    title: entry.title,
    description: entry.description,
    publishedAt: entry.publishedAt ?? '',
    status: entry.status,
    authors: [...entry.authors],
    categories: [...entry.categories],
    tags: [...entry.tags],
    image: entry.image ?? undefined,
    imageAlt: entry.imageAlt || undefined,
    readingTime: entry.readingTime ?? undefined,
  };
}
