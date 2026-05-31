import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { AuthorCard } from '@/shared/blog/components/AuthorCard';
import { TagCloud } from '@/shared/components/TagCloud';
import { getMarkdocPost } from '@/shared/blog/loader';
import { renderMarkdoc } from '@/shared/blog/render';
import type { WithLocaleParams } from '@/shared/types/globals';

type MarkdocBlogPostParams = WithLocaleParams<{ slug: string }>;

export async function generateMarkdocBlogPostMetadata({
  params,
}: MarkdocBlogPostParams): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getMarkdocPost(slug, locale);

  if (!post) {
    notFound();
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

export async function MarkdocBlogPostPage({ params }: MarkdocBlogPostParams) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const post = await getMarkdocPost(slug, locale);

  if (!post) {
    notFound();
  }

  return (
    <article className='mx-auto flex max-w-[60ch] flex-col gap-8'>
      <header className='flex flex-col items-center gap-6'>
        <h1 className='text-3xl font-semibold'>{post.title}</h1>
        <p className='text-center text-muted-foreground'>
          {post.description}
        </p>

        <AuthorCard
          author={{ name: post.authors[0] }}
          date={post.publishedAt}
        />
        <TagCloud tags={post.categories} />
      </header>

      {post.image ? (
        <Image
          src={post.image}
          alt={post.imageAlt ?? post.title}
          width={1024}
          height={560}
          sizes='(max-width: 768px) 100vw, 60ch'
          className='mx-auto max-h-[360px] max-w-full rounded-xl object-cover'
        />
      ) : null}

      <div className='markdoc prose text-primary prose-a:text-primary prose-h2:text-2xl prose-h2:font-bold prose-h2:text-primary'>
        {renderMarkdoc(post.content)}
      </div>
    </article>
  );
}
