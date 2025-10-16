// TODO: This should be rendered statically, but then I cannot use the session provider in the layout...?

import { getLocale, getTranslations } from 'next-intl/server';

import { BlogCard } from '@/shared/cms/components/BlogCard';
// TODO: change for shadcn breadcrumbs
import { Breadcrumbs } from '@/shared/components/Breadcrumbs';
import { blog } from '@/shared/cms/queries';

export const BlogListPage = async () => {
  // const session = await auth();

  // const altPosts = await getPosts();
  // console.log(altPosts);
  const locale = await getLocale();
  const posts = await blog.getPosts(locale);
  const t = await getTranslations();
  const breadcrumbs = [
    {
      label: 'Inicio',
      path: '/',
    },
    {
      label: 'Blog',
      path: '/blog',
    },
  ];

  return (
    <div className={`flex flex-col gap-16`}>
      <div className='space-y-4'>
        <p className='text-sm font-semibold text-primary'>
          {t('blog.preTitle')}
        </p>
        <h1 className='text-3xl font-bold'>{t('blog.blogTitle')}</h1>
        <p className='text-muted-foreground'>{t('blog.blogDescription')}</p>
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <div
        className='
                grid
                grid-cols-1
                gap-x-8
                gap-y-16
                md:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-3
                
                '
      >
        {posts.map(
          ({
            _slug,
            _title,
            description,
            image,
            authors,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            categories,
            date,
          }) => (
            <BlogCard
              abstract={description!}
              date={date!}
              key={_slug}
              title={_title!}
              image={image?.url ?? ''}
              url={`/blog/${_slug}`}
              // topic={categories?.[0]._title!}
              author={authors?.[0]}
            />
          )
        )}
      </div>
    </div>
  );
};
