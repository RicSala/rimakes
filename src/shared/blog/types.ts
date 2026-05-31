import type { ReactNode } from 'react';
import type { Locale } from 'next-intl';

export type MarkdocPostStatus = 'draft' | 'published';

export type MarkdocPostMeta = {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  publishedAt: string;
  status: MarkdocPostStatus;
  authors: string[];
  categories: string[];
  tags: string[];
  image?: string;
  imageAlt?: string;
  readingTime?: number;
};

export type MarkdocPost = MarkdocPostMeta & {
  content: string;
};

export type MarkdocContent = ReactNode;
