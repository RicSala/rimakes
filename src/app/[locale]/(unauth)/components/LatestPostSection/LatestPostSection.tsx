import { SectionHeader } from '@/app/[locale]/(unauth)/work-with-me/components/SectionHeader';
import { BlogPostGrid } from '@/shared/cms/pages/BlogListPage';
import { getTranslations } from 'next-intl/server';

export async function LatestPostSection() {
  const t = await getTranslations('latestPostSection');

  return (
    <section className='home-section' id='latest-posts'>
      <SectionHeader title={t('title')} description={t('description')} />
      <BlogPostGrid />
    </section>
  );
}
