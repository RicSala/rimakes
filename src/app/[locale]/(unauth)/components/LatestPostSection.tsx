import { SectionHeader } from '@/app/[locale]/(unauth)/work-with-me/components/SectionHeader';
import { BlogPostGrid } from '@/shared/cms/pages/BlogListPage';

export async function LatestPostSection() {
  return (
    <section className='home-section' id='latest-posts'>
      <SectionHeader
        title='Latest posts'
        description='From technical stuff to personal insights and everything in between'
      />
      <BlogPostGrid />
    </section>
  );
}
