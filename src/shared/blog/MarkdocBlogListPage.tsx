import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';

import { BlogCard } from '@/shared/blog/components/BlogCard';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb';
import { Link } from '@/shared/internationalization/navigation';
import { getMarkdocPosts } from '@/shared/blog/loader';
import type { WithLocaleParams } from '@/shared/types/globals';

export async function MarkdocBlogListPage({ params }: WithLocaleParams) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className='flex flex-col gap-16'>
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
      <MarkdocBlogPostGrid />
    </div>
  );
}

export async function MarkdocBlogPostGrid() {
  const locale = await getLocale();
  const posts = await getMarkdocPosts(locale);

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
      {posts.map((post) => (
        <BlogCard
          abstract={post.description}
          author={{ name: post.authors[0] }}
          categories={post.categories}
          date={post.publishedAt}
          image={post.image ?? ''}
          key={post.slug}
          title={post.title}
          url={`/blog/${post.slug}`}
        />
      ))}
    </div>
  );
}
