import { Metadata } from 'next';
import { ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

import { blog } from '@/shared/cms/queries';
import { BlogPostPage } from '@/shared/cms/pages/BlogPostPage';

// TODO: This should be rendered statically
// export const dynamic = 'error';

export default BlogPostPage;

export async function generateMetadata(
  { params }: Props,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await blog.getPost(slug, locale);
  if (!post) {
    return notFound();
  }

  return {
    title: post._title,
    description: post.description,
  };
}

export async function generateStaticParams() {
  const posts = await blog.getPosts('en');

  return posts.map((post) => ({
    slug: post._slug,
  }));
}

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};
