import { collection, config, fields } from '@keystatic/core';
import { block, wrapper } from '@keystatic/core/content-components';

const blogDir = 'content/blog';
const blogAssetPath = '/cms-assets/blog';

const decksDir = 'content/decks';
const decksAssetPath = '/cms-assets/decks';

// Custom Markdoc tags used in post/deck bodies. These must be registered on the
// markdoc field so the Keystatic editor can parse, validate, and edit them.
// (Front-end rendering is handled separately in src/shared/blog/render.tsx — the
// schemas here just mirror the tag attributes so the admin understands them.)
const markdocComponents = {
  callout: wrapper({
    label: 'Callout',
    schema: {
      title: fields.text({ label: 'Title' }),
      emoji: fields.text({ label: 'Emoji' }),
      variant: fields.select({
        label: 'Variant',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Info', value: 'info' },
          { label: 'Warning', value: 'warning' },
          { label: 'Error', value: 'error' },
          { label: 'Success', value: 'success' },
        ],
        defaultValue: 'info',
      }),
    },
  }),
  'code-editor': block({
    label: 'Code editor',
    schema: {
      title: fields.text({ label: 'Title' }),
    },
  }),
};

export const keystaticConfig = config({
  storage: { kind: 'local' },
  collections: {
    posts: collection({
      label: 'Blog posts',
      slugField: 'title',
      // `**` lets the slug carry the locale prefix, e.g. `en/my-post`.
      path: `${blogDir}/**/`,
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'status', 'publishedAt'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({
          label: 'Description',
          multiline: true,
        }),
        publishedAt: fields.date({
          label: 'Published date',
          validation: { isRequired: true },
        }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
          defaultValue: 'published',
        }),
        authors: fields.array(fields.text({ label: 'Author' }), {
          label: 'Authors',
          itemLabel: (props) => props.value,
        }),
        categories: fields.array(fields.text({ label: 'Category' }), {
          label: 'Categories',
          itemLabel: (props) => props.value,
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value,
        }),
        image: fields.image({
          label: 'Cover image',
          directory: blogDir,
          publicPath: blogAssetPath,
        }),
        imageAlt: fields.text({ label: 'Image alt text' }),
        readingTime: fields.integer({ label: 'Reading time' }),
        content: fields.markdoc({
          label: 'Content',
          options: {
            image: {
              directory: blogDir,
              publicPath: blogAssetPath,
            },
          },
          components: markdocComponents,
        }),
      },
    }),
    decks: collection({
      label: 'Presentations',
      slugField: 'title',
      // Trailing slash => each deck is a directory with an `index.mdoc`
      // (same layout as the blog), so slide images can be colocated.
      path: `${decksDir}/*/`,
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({
          label: 'Description',
          multiline: true,
        }),
        content: fields.markdoc({
          // Slides are one document split on `---` (a thematic break) at present time.
          label: 'Slides (separate each slide with a --- on its own line)',
          options: {
            image: {
              directory: decksDir,
              publicPath: decksAssetPath,
            },
          },
          components: markdocComponents,
        }),
      },
    }),
  },
});
