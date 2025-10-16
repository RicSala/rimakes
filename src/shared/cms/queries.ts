import { LocaleEnum } from '@/shared/cms/generated/basehub-types';
import { basehub as basehubClient, fragmentOn } from 'basehub';

const basehub = basehubClient({
  token: process.env.BASEHUB_TOKEN,
});

const imageFragment = fragmentOn('BlockImage', {
  url: true,
  width: true,
  height: true,
  alt: true,
  blurDataURL: true,
});

const postMetaFragment = fragmentOn('PostsItem', {
  _slug: true,
  _title: true,
  _sys: {
    lastModifiedAt: true,
  },
  authors: {
    _title: true,
    avatar: imageFragment,
  },
  categories: {
    _title: true,
  },
  date: true,
  description: true,
  image: imageFragment,
});

export type PostMeta = fragmentOn.infer<typeof postMetaFragment>;
export type Post = fragmentOn.infer<typeof postFragment>;
export type Author = PostMeta['authors'][number];

const postFragment = fragmentOn('PostsItem', {
  ...postMetaFragment,
  body: {
    plainText: true,
    json: {
      content: true,
      toc: true,
    },
    readingTime: true,
  },
});

export const blog = {
  // ##### Queries to be used in Pump
  postsQuery: (locale: string) =>
    fragmentOn('Query', {
      blog: {
        posts: {
          items: postMetaFragment,
          __args: {
            variants: {
              locale: locale as LocaleEnum,
            },
          },
        },
      },
      // next: {
      //   revalidate: false,
      // },
    }),

  latestPostQuery: (locale: string) =>
    fragmentOn('Query', {
      blog: {
        posts: {
          __args: {
            orderBy: '_sys_createdAt__DESC',
            variants: {
              locale: locale as LocaleEnum,
            },
          },
          item: postFragment,
        },
      },
    }),

  postQuery: (slug: string, locale: string) => ({
    blog: {
      posts: {
        __args: {
          filter: {
            _sys_slug: { eq: slug },
          },
          variants: {
            locale: locale as LocaleEnum,
          },
        },
        item: postFragment,
      },
    },
  }),

  // ##### Getters - to use in "non reactive" parts like generateMetadata
  getPosts: async (locale: string): Promise<PostMeta[]> => {
    const data = await basehub.query(blog.postsQuery(locale));
    return data.blog.posts.items;
  },

  getLatestPost: async (locale: string) => {
    const data = await basehub.query(blog.latestPostQuery(locale));

    return data.blog.posts.item;
  },

  getPost: async (slug: string, locale: string) => {
    const query = blog.postQuery(slug, locale);
    const data = await basehub.query(query);

    return data.blog.posts.item;
  },
};

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

export type Technology = fragmentOn.infer<typeof technologyFragment>;

const technologyFragment = fragmentOn('TechnologiesItem', {
  _id: true,
  _title: true,
  icon: true,
});

export const technologies = {
  technologiesQuery: (locale: string) =>
    fragmentOn('Query', {
      portfolio: {
        technologies: {
          items: technologyFragment,
        },
      },
    }),

  getTechnologies: async (locale: string) => {
    const data = await basehub.query(technologies.technologiesQuery(locale));
    return data.portfolio.technologies.items;
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
  technicalBreakdown: {
    plainText: true,
    json: {
      content: true,
      toc: true,
    },
  },
});

export const openSourceProjects = {
  openSourceProjectsQuery: (locale: string) =>
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

  getOpenSourceProjects: async (locale: string) => {
    const data = await basehub.query(
      openSourceProjects.openSourceProjectsQuery(locale)
    );
    return data.portfolio.openSource.items;
  },
};
