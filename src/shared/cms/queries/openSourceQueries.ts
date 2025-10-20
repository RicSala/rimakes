import { LocaleEnum } from '@/shared/cms/generated/basehub-types';
import { basehub } from '@/shared/cms/basehub';
import { fragmentOn } from 'basehub';
import { calloutFragment } from '@/shared/cms/queries/otherQueries';

const openSourceFragment = fragmentOn('OpenSourceItem', {
  _id: true,
  _slug: true,
  _title: true,
  description: true,
  githubLink: true,
  docsLink: true,
  imageUrl: true,
  role: true,
  why: true,
  postPath: true,
  technicalBreakdown: {
    plainText: true,
    json: {
      content: true,
      toc: true,
      blocks: {
        on_BlockDocument: {
          _id: true,
          __typename: true,
        },
        on_CalloutComponent: calloutFragment,
      },
    },
  },
});

export const openSourceProjects = {
  openSourceProjectsQuery: () =>
    fragmentOn('Query', {
      portfolio: {
        openSource: {
          items: openSourceFragment,
        },
      },
    }),

  openSourceProjectQuery: (slug: string, locale: string) =>
    fragmentOn('Query', {
      portfolio: {
        openSource: {
          __args: {
            filter: {
              _sys_slug: { eq: slug },
            },
            variants: {
              locale: locale as LocaleEnum,
            },
          },
          item: openSourceFragment,
        },
      },
    }),

  getOpenSourceProject: async (slug: string, locale: string) => {
    const data = await basehub.query(
      openSourceProjects.openSourceProjectQuery(slug, locale)
    );
    return data.portfolio.openSource.item;
  },

  getOpenSourceProjects: async () => {
    const data = await basehub.query(
      openSourceProjects.openSourceProjectsQuery()
    );
    return data.portfolio.openSource.items;
  },
};
