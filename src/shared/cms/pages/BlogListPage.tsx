// TODO: This should be rendered statically, but then I cannot use the session provider in the layout...?

import { getLocale, getTranslations } from 'next-intl/server';

import { BlogCard } from '@/shared/cms/components/BlogCard';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb';
import { Link } from '@/shared/internationalization/navigation';
import { blog } from '@/shared/cms/queries';

export const BlogListPage = async () => {
  const t = await getTranslations();

  return (
    <div className={`flex flex-col gap-16`}>
      <div className='space-y-4'>
        <p className='text-sm font-semibold text-primary'>
          {t('blog.preTitle')}
        </p>
        <h1 className='text-3xl font-bold'>{t('blog.blogTitle')}</h1>
        <p className='text-muted-foreground'>{t('blog.blogDescription')}</p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href='/'>{t('blog.breadcrumb.home')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t('blog.breadcrumb.blog')}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <BlogPostGrid />
    </div>
  );
};

export const BlogPostGrid = async () => {
  const locale = await getLocale();
  const posts = await blog.getPosts(locale);

  return (
    <div
      className='
          grid
          grid-cols-1
          gap-x-8
          gap-y-16
          md:grid-cols-2
          lg:grid-cols-2
          xl:grid-cols-2'
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
  );
};
