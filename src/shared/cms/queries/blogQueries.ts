import { basehub } from '@/shared/cms/basehub';
import { fragmentOn } from 'basehub';
import { LocaleEnum } from '@/shared/cms/generated/basehub-types';
import {
  calloutFragment,
  imageFragment,
} from '@/shared/cms/queries/otherQueries';

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
      blocks: {
        on_BlockDocument: {
          _id: true,
          __typename: true,
        },
        on_CalloutComponent: calloutFragment,
        on_CodeEditorComponent: {
          _id: true,
          collectionOfCodeFile: {
            items: {
              _id: true,
              _title: true,
              filename: true,
              active: true,
              hidden: true,
              readOnly: true,
              code: {
                language: true,
                html: true,
                code: true,
              },
              _sys: {
                lastModifiedAt: true,
              },
            },
          },
        },
      },
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
