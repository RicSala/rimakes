import { LocaleEnum } from '@/shared/cms/generated/basehub-types';
import { basehub } from '@/shared/cms/basehub';
import { technologyFragment } from '@/shared/cms/queries/technologyQueries';
import { fragmentOn } from 'basehub';
import { imageFragment } from '@/shared/cms/queries/otherQueries';

export const projects = {
  projectsQuery: (locale: string) =>
    fragmentOn('Query', {
      portfolio: {
        projects: {
          items: projectFragment,
          __args: {
            variants: {
              locale: locale as LocaleEnum,
            },
          },
        },
      },
    }),

  getProjects: async (locale: string) => {
    const data = await basehub.query(projects.projectsQuery(locale));
    return data.portfolio.projects.items;
  },
};

export type Project = fragmentOn.infer<typeof projectFragment>;

const projectFragment = fragmentOn('ProjectsItem', {
  _slug: true,
  _title: true,
  description: {
    plainText: true,
  },
  link: true,
  video: {
    url: true,
    width: true,
    height: true,
    duration: true,
  },
  startDate: true,
  endDate: true,
  docsLink: true,
  githubLink: true,
  technologies: technologyFragment,
  image: imageFragment,
  status: true,
});
