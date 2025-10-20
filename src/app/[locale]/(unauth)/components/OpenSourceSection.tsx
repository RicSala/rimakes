import { SectionHeader } from '@/app/[locale]/(unauth)/work-with-me/components/SectionHeader';
import { openSourceProjects as openSourceProjectsQuery } from '@/shared/cms/queries/openSourceQueries';
import { OpenSourceCard } from '@/shared/components/OpenSourceCard';

export const OpenSourceSection = async () => {
  const openSourceProjects =
    await openSourceProjectsQuery.getOpenSourceProjects();

  return (
    <section className='home-section' id='open-source'>
      <SectionHeader
        title='Open Source'
        description='Projects created and maintained for the developer community'
      />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {openSourceProjects.map((project) => (
          <OpenSourceCard
            key={project._id}
            title={project._title}
            description={project.description}
            githubLink={project.githubLink ?? undefined}
            docsLink={project.docsLink ?? undefined}
            imageUrl={project.imageUrl ?? undefined}
            why={project.why ?? undefined}
            role={project.role ?? undefined}
            postPath={project.postPath ?? undefined}
          />
        ))}
      </div>
    </section>
  );
};
