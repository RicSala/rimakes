import { SectionHeader } from '@/app/[locale]/(unauth)/work-with-me/components/SectionHeader';
import { openSourceProjects as openSourceProjectsQuery } from '@/shared/cms/queries';
import { OpenSourceCard } from '@/shared/components/OpenSourceCard';
import { getLocale } from 'next-intl/server';

type OpenSourceSectionProps = {};

export const OpenSourceSection = async (props: OpenSourceSectionProps) => {
  const locale = await getLocale();
  const openSourceProjects =
    await openSourceProjectsQuery.getOpenSourceProjects(locale);

  return (
    <section className='space-y-6 scroll-mt-24' id='open-source'>
      <SectionHeader
        title='Open Source'
        description='Projects created and maintained for the developer community'
      />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {openSourceProjects.map((project) => (
          <OpenSourceCard
            slug={project._slug}
            key={project._id}
            title={project._title}
            description={project.description}
            githubLink={project.githubLink ?? undefined}
            docsLink={project.docsLink ?? undefined}
            imageUrl={project.imageUrl ?? undefined}
            why={project.why ?? undefined}
            role={project.role ?? undefined}
          />
        ))}
      </div>
    </section>
  );
};
