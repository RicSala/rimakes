import { Pump } from 'basehub/react-pump';
import { RichText } from 'basehub/react-rich-text';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';

import { AuthorCard } from '@/shared/cms/components/AuthorCard';
import { blog } from '@/shared/cms/queries';
import { Link } from '@/shared/internationalization/navigation';
import { WithLocaleParams } from '@/shared/types/globals';

// TODO: This should be rendered statically
// export const dynamic = 'error';

export const BlogPostPage = async ({
  params,
}: WithLocaleParams<{ slug: string }>) => {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const post = await blog.getPost(slug, locale);
  if (!post) {
    return notFound();
  }

  return (
    <>
      <Pump queries={[blog.postQuery(slug, locale)]}>
        {async ([data]) => {
          'use server';
          return (
            <article className=' mx-auto flex  max-w-[60ch] flex-col gap-12'>
              <header className='flex flex-col items-center gap-6'>
                <h1 className='text-3xl font-semibold'>
                  {data.blog.posts.item?._title}
                </h1>
                <p className=' text-center text-muted-foreground'>
                  {data.blog.posts.item?.description}
                </p>
                <AuthorCard
                  date={data.blog.posts.item?.date ?? ''}
                  author={data.blog.posts.item?.authors[0]}
                />
                {data.blog.posts.item?.categories && (
                  <div className='flex gap-2'>
                    {data.blog.posts.item?.categories.map((tag) => (
                      <span
                        key={tag._title}
                        className='rounded-full border border-border bg-muted px-2 py-1 text-xs text-muted-foreground'
                      >
                        {tag._title}
                      </span>
                    ))}
                  </div>
                )}
              </header>
              <Image
                src={data.blog.posts.item?.image?.url ?? ''}
                alt={data.blog.posts.item?._title ?? ''}
                width={1024}
                height={560}
                className='mx-auto max-w-full'
              />
              <div className='prose mx-auto'>
                <RichText
                  components={{
                    a: ({ children, ...props }) => {
                      return (
                        <Link
                          {...props}
                          // @ts-expect-error "idk"
                          href={props.href as string}
                          className='text-primary'
                        >
                          {children}
                        </Link>
                      );
                    },
                  }}
                >
                  {data.blog.posts.item?.body.json.content}
                </RichText>
              </div>
            </article>
          );
        }}
      </Pump>
    </>
  );
};
