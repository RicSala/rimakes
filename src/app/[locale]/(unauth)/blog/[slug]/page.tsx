import { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { notFound } from 'next/navigation';

import {
  getMarkdocPost,
  getMarkdocPostStaticParams,
} from '@/shared/blog/loader';
import { MarkdocBlogPostPage } from '@/shared/blog/MarkdocBlogPostPage';

export default MarkdocBlogPostPage;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getMarkdocPost(slug, locale);

  if (!post) {
    return notFound();
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export const generateStaticParams = getMarkdocPostStaticParams;

type Props = {
  params: Promise<{ slug: string; locale: Locale }>;
};
