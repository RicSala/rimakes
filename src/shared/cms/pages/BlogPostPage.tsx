import { Pump } from 'basehub/react-pump';
import { RichText } from 'basehub/react-rich-text';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';

import { AuthorCard } from '@/shared/cms/components/AuthorCard';
import { blog } from '@/shared/cms/queries/blogQueries';
import { Link } from '@/shared/internationalization/navigation';
import { WithLocaleParams } from '@/shared/types/globals';
import { TagCloud } from '@/shared/components/TagCloud';
import { Callout } from '@/shared/components/Callout';
import { Sandpack } from '@codesandbox/sandpack-react';
import { monokaiPro } from '@codesandbox/sandpack-themes';
import { CodeBlock } from 'basehub/react-code-block';

// TODO: This should be rendered statically
// export const dynamic = 'error';

export const BlogPostPage = async ({
  params,
}: WithLocaleParams<{ slug: string }>) => {
  const { slug, locale } = await params;
  console.log('rendering blog post page');
  setRequestLocale(locale);
  const post = await blog.getPost(slug, locale);
  if (!post) {
    return notFound();
  }

  return (
    <Pump queries={[blog.postQuery(slug, locale)]}>
      {async ([data]) => {
        'use server';
        return (
          <article className=' mx-auto flex  max-w-[60ch] flex-col gap-8'>
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
                <TagCloud
                  tags={
                    data.blog.posts.item?.categories.map(
                      (category) => category._title
                    ) ?? []
                  }
                />
              )}
            </header>
            <Image
              src={data.blog.posts.item?.image?.url ?? ''}
              alt={data.blog.posts.item?._title ?? ''}
              width={1024}
              height={560}
              sizes='(max-width: 768px) 100vw, 60ch'
              className='mx-auto max-w-full rounded-xl max-h-[360px] object-cover'
            />
            <div className='prose text-primary'>
              <RichText
                blocks={data.blog.posts.item?.body.json.blocks}
                components={{
                  h2: ({ children }) => {
                    return (
                      <h2 className='text-2xl font-bold text-primary'>
                        {children}
                      </h2>
                    );
                  },
                  pre: ({ language, code }) => {
                    return (
                      <CodeBlock
                        snippets={[
                          {
                            code: code,
                            language: language,
                          },
                        ]}
                        theme='monokai'
                      />
                    );
                  },
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
                  CodeEditorComponent: ({
                    _id,
                    collectionOfCodeFile,
                    ..._props // eslint-disable-line @typescript-eslint/no-unused-vars
                  }) => {
                    const files = collectionOfCodeFile.items.reduce(
                      (acc, item) => ({
                        ...acc,
                        [item.filename as string]: {
                          code: item.code.code,
                          hidden: item.hidden,
                          readOnly: item.readOnly,
                          active: item.active,
                          filename: item.filename,
                          _id: item._id,
                          _title: item._title,
                          _sys: item._sys,
                        },
                      }),
                      {}
                    );
                    return (
                      <div className='-mx-32'>
                        <Sandpack
                          theme={monokaiPro}
                          key={_id}
                          template='react-ts'
                          files={files}
                          options={{
                            layout: 'preview',
                            showConsole: true,
                          }}
                        />
                      </div>
                    );
                  },
                  CalloutComponent: ({
                    title,
                    description,
                    emoji,
                    variant,
                    ..._props // eslint-disable-line @typescript-eslint/no-unused-vars
                  }) => {
                    return (
                      <Callout
                        title={title ?? ''}
                        description={description?.plainText ?? ''}
                        emoji={emoji ?? ''}
                        variant={variant ?? 'default'}
                      />
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
  );
};
