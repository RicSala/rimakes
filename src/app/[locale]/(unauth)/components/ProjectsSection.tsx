import { SectionHeader } from '@/app/[locale]/(unauth)/work-with-me/components/SectionHeader';
import { projects as projectsQuery } from '@/shared/cms/queries';
import BlurFade from '@/shared/components/BlurFade';
import { ProjectCard } from '@/shared/components/ProjectCard';
import { Globe, Github, Book } from 'lucide-react';
import { format } from 'date-fns';

type ProjectsSectionProps = {};
export async function ProjectsSection({}: ProjectsSectionProps) {
  const projects = await projectsQuery.getProjects('en');
  return (
    <section className='space-y-6 @container scroll-mt-24' id='projects'>
      <SectionHeader
        title='Projects'
        description='I love what I do, so I keep doing it on my free time 💻'
      />
      <div className='grid grid-cols-2 gap-4 @3xl:grid-cols-4'>
        {projects.map((project) => {
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
            <BlurFade key={project?._slug}>
              <ProjectCard
                href={project?.link!}
                cardClassName='!py-0'
                title={project?._title}
                description={project?.description?.plainText || ''}
                dates={datesString}
                tags={
                  project?.technologies?.map(
                    (technology) => technology?._title
                  ) || []
                }
                link={project?.link!}
                // video={project?.video?.url}
                image={project?.image?.url}
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
