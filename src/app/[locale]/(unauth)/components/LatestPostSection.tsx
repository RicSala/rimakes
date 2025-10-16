import { SectionHeader } from '@/app/[locale]/(unauth)/work-with-me/components/SectionHeader';
import { BlogPostGrid } from '@/shared/cms/pages/BlogListPage';

type LatestPostSectionProps = {};
export async function LatestPostSection(props: LatestPostSectionProps) {
  return (
    <section className='space-y-6' id='latest-posts'>
      <SectionHeader
        title='Latest posts'
        description='From technical stuff to personal insights and everything in between'
      />
      <BlogPostGrid />
    </section>
  );
}
