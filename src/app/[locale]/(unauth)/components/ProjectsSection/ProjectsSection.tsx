import { SectionHeader } from '@/app/[locale]/(unauth)/work-with-me/components/SectionHeader';
import BlurFade from '@/shared/components/BlurFade';
import { ProjectCard } from '@/shared/components/ProjectCard';
import { PORTFOLIO_PROJECTS } from '@/shared/config/portfolio';
import { Globe, Github, Book } from 'lucide-react';
import { format } from 'date-fns';
import { getTranslations } from 'next-intl/server';

export async function ProjectsSection() {
  const t = await getTranslations('projectsSection');

  return (
    <section className='home-section @container' id='projects'>
      <SectionHeader title={t('title')} description={t('description')} />
      <div className='grid grid-cols-1 @xl:grid-cols-2 gap-8 @3xl:grid-cols-4'>
        {PORTFOLIO_PROJECTS.map((project) => {
          const startDateString = project?.startDate
            ? format(new Date(project?.startDate), 'MMM yy')
            : undefined;

          const endDateString = project?.endDate
            ? format(new Date(project?.endDate), 'MMM yy')
            : undefined;

          const datesString =
            startDateString && endDateString
              ? `${startDateString} - ${endDateString}`
              : startDateString || endDateString || '';

          const links = [
            project?.link && {
              icon: <Globe />,
              type: 'Link',
              href: project?.link,
            },
            project?.githubLink && {
              icon: <Github />,
              type: 'GitHub',
              href: project?.githubLink,
            },
            project?.docsLink && {
              icon: <Book />,
              type: 'Docs',
              href: project?.docsLink,
            },
          ].filter(Boolean);
          return (
            <BlurFade key={project.slug}>
              <ProjectCard
                href={project?.link ?? ''}
                cardClassName='!py-0'
                title={project.title}
                description={project.description}
                dates={datesString}
                tags={project.technologies}
                link={project?.link ?? ''}
                // video={project?.video?.url}
                image={project?.image}
                // @ts-expect-error - TODO: fix this
                links={links || []}
                status={project?.status || ''}
              />
            </BlurFade>
          );
        })}
      </div>
    </section>
  );
}
