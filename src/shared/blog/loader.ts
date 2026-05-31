import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import type { Locale } from 'next-intl';

import { routing } from '@/shared/internationalization/i18n/config';
import {
  normalizePostMeta,
  splitFrontmatter,
} from '@/shared/blog/frontmatter';
import type { MarkdocPost, MarkdocPostMeta } from '@/shared/blog/types';

const CONTENT_ROOT = path.join(process.cwd(), 'content/blog');

// TODO: Consider replacing the local filesystem reader with Keystatic's
// GitHub-backed Reader API plus ISR so new posts can publish without redeploys.
export const getMarkdocPosts = cache(async (locale: Locale) => {
  const posts = await readPostsForLocale(locale);

  return posts
    .filter((post) => post.status === 'published')
    .sort(
      (left, right) =>
        new Date(right.publishedAt).getTime() -
        new Date(left.publishedAt).getTime()
    );
});

export const getMarkdocPost = cache(
  async (slug: string, locale: Locale): Promise<MarkdocPost | undefined> => {
    const post = await readPost(slug, locale);

    if (post?.status !== 'published') {
      return undefined;
    }

    return post;
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

async function readPostsForLocale(locale: Locale): Promise<MarkdocPostMeta[]> {
  const directory = path.join(CONTENT_ROOT, locale);

  try {
    const files = await readdir(directory);
    const posts = await Promise.all(
      files
        .filter((file) => file.endsWith('.mdoc'))
        .map(async (file) => {
          const slug = file.replace(/\.mdoc$/, '');
          const post = await readPost(slug, locale);

          return post;
        })
    );

    return posts.filter(isMarkdocPost).map(toPostMeta);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

function isMarkdocPost(post: MarkdocPost | undefined): post is MarkdocPost {
  return Boolean(post);
}

function toPostMeta(post: MarkdocPost): MarkdocPostMeta {
  return {
    slug: post.slug,
    locale: post.locale,
    title: post.title,
    description: post.description,
    publishedAt: post.publishedAt,
    status: post.status,
    authors: post.authors,
    categories: post.categories,
    tags: post.tags,
    image: post.image,
    imageAlt: post.imageAlt,
    readingTime: post.readingTime,
  };
}

async function readPost(
  slug: string,
  locale: Locale
): Promise<MarkdocPost | undefined> {
  const filePath = path.join(CONTENT_ROOT, locale, `${slug}.mdoc`);

  try {
    const file = await readFile(filePath, 'utf8');
    const { frontmatter, content } = splitFrontmatter(file);
    const meta = normalizePostMeta({ frontmatter, slug, locale });

    return {
      ...meta,
      content,
    };
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return undefined;
    }

    throw error;
  }
}
