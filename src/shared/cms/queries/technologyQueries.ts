import { basehub } from '@/shared/cms/basehub';
import { fragmentOn } from 'basehub';

export type Technology = fragmentOn.infer<typeof technologyFragment>;

export const technologyFragment = fragmentOn('TechnologiesItem', {
  _id: true,
  _title: true,
  icon: true,
});

export const technologies = {
  technologiesQuery: () =>
    fragmentOn('Query', {
      portfolio: {
        technologies: {
          items: technologyFragment,
        },
      },
    }),

  getTechnologies: async () => {
    const data = await basehub.query(technologies.technologiesQuery());
    return data.portfolio.technologies.items;
  },
};
