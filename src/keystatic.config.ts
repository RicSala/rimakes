import { createElement } from 'react';
import { CircleDot, Highlighter } from 'lucide-react';
import { collection, config, fields } from '@keystatic/core';
import { block, mark, wrapper } from '@keystatic/core/content-components';

// Marker colors for the `{% highlight %}` mark, as hex so the Keystatic editor
// can render the real swipe inline (the admin app isn't styled by Tailwind, so
// `style` must carry concrete CSS). Mirrors HIGHLIGHT_COLORS in Highlight.tsx.
const HIGHLIGHT_HEX: Record<string, string> = {
  yellow: '#fde047',
  green: '#86efac',
  blue: '#7dd3fc',
  pink: '#f9a8d4',
  orange: '#fdba74',
};

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
  // Inline marker-pen highlight. As a `mark` it lives in the inline formatting
  // toolbar (like bold/italic): select text, toggle it on, and it's yellow by
  // default. `style` renders the real color inside the editor; to use another
  // color, set `color` in the .mdoc source. Mirror of the `highlight` tag in
  // src/shared/blog/custom-components.tsx.
  highlight: mark({
    label: 'Resaltar',
    icon: createElement(Highlighter),
    tag: 'mark',
    schema: {
      color: fields.select({
        label: 'Color',
        options: [
          { label: 'Amarillo', value: 'yellow' },
          { label: 'Verde', value: 'green' },
          { label: 'Azul', value: 'blue' },
          { label: 'Rosa', value: 'pink' },
          { label: 'Naranja', value: 'orange' },
        ],
        defaultValue: 'yellow',
      }),
    },
    style: ({ value }) => ({
      backgroundColor: HIGHLIGHT_HEX[value.color] ?? HIGHLIGHT_HEX.yellow,
      color: '#171717',
      borderRadius: '0.25em',
      padding: '0 0.15em',
    }),
  }),
  'code-editor': block({
    label: 'Code editor',
    schema: {
      title: fields.text({ label: 'Title' }),
    },
  }),
  prompt: wrapper({
    label: 'Prompt',
    schema: {
      title: fields.text({ label: 'Title' }),
    },
  }),
  // Per-slide chrome: place at the top of a slide to set its background scheme
  // and/or corner tags. Rendered by SlideStage, not inline.
  slide: block({
    label: 'Slide settings',
    schema: {
      bg: fields.select({
        label: 'Background',
        options: [
          { label: 'Default (white)', value: 'none' },
          { label: 'Brand (indigo)', value: 'brand' },
          { label: 'Dark', value: 'dark' },
        ],
        defaultValue: 'none',
      }),
      tags: fields.text({ label: 'Corner tags (comma-separated)' }),
      width: fields.select({
        label: 'Content width',
        options: [
          { label: 'Normal', value: 'normal' },
          { label: 'Wide (comparisons / tables)', value: 'wide' },
          { label: 'Full', value: 'full' },
        ],
        defaultValue: 'normal',
      }),
      public: fields.checkbox({
        label: 'Public — audience can navigate to this slide on their own',
      }),
      section: fields.text({
        label: 'Section header (e.g. "Módulo 1: …") — groups slides in the review index',
      }),
    },
  }),
  // Side-by-side comparison cards. `columns` wraps two or more `column`s.
  columns: wrapper({
    label: 'Columns (comparison)',
    schema: {},
  }),
  column: wrapper({
    label: 'Column (card)',
    schema: {
      title: fields.text({ label: 'Title' }),
      subtitle: fields.text({ label: 'Subtitle' }),
      badge: fields.text({ label: 'Badge (small pill)' }),
      highlight: fields.checkbox({ label: 'Highlight this card' }),
    },
  }),
  // Presenter-only speaker notes. Authored at the top of a slide (like a
  // callout); pulled out before render and shown only on the /control screen —
  // never sent to the audience viewer. See extractSlideMeta + SlideController.
  notes: wrapper({
    label: 'Speaker notes (presenter-only)',
    schema: {},
  }),
  // Synced countdown timer. Presenter drives Play/Reset on /control; every viewer
  // counts down together and chimes at zero. See features/presentations/Timer.
  timer: block({
    label: 'Timer',
    schema: {
      minutes: fields.integer({ label: 'Minutes' }),
      seconds: fields.integer({ label: 'Seconds' }),
      label: fields.text({ label: 'Label (optional)' }),
      id: fields.text({ label: 'Id (only if multiple timers in one deck)' }),
    },
  }),
  // Self-check for the audience. `quiz` wraps one or more `question`s (each with
  // its `option`s + optional `explanation`) and shows a score at the end; each
  // viewer answers locally. See features/Quiz.
  quiz: wrapper({
    label: 'Quiz',
    schema: {
      title: fields.text({ label: 'Title (optional)' }),
      // Single-question shorthand (no `question` wrapper needed).
      question: fields.text({ label: 'Question (single-question shorthand)' }),
      mode: fields.select({
        label: 'Mode',
        options: [
          { label: 'Inline (card on the slide)', value: 'inline' },
          { label: 'Modal (trigger button)', value: 'modal' },
        ],
        defaultValue: 'inline',
      }),
    },
  }),
  question: wrapper({
    label: 'Quiz question',
    schema: {
      text: fields.text({ label: 'Question text' }),
    },
  }),
  // Options are authored inline (`{% option %}…{% /option %}` on one line), so
  // Markdoc parses them as *inline* tags. Keystatic can only round-trip an inline
  // tag that carries text content as a `mark` — a `wrapper`/`block` is block-level
  // and rejects inline placement ("tag has unexpected children"). As a mark, the
  // `correct` attribute and any bold/inline markup are preserved on round-trip.
  option: mark({
    label: 'Quiz option',
    icon: createElement(CircleDot),
    schema: {
      correct: fields.checkbox({ label: 'Correct answer' }),
    },
  }),
  explanation: wrapper({
    label: 'Quiz explanation',
    schema: {},
  }),
  // Matching self-check. `match` wraps one or more self-closing `pair`s; the
  // audience connects each left label to its right label (the right column is
  // scrambled) and checks the result. See features/presentations/Match.
  match: wrapper({
    label: 'Match (connect columns)',
    schema: {
      title: fields.text({ label: 'Title (optional)' }),
      instructions: fields.text({ label: 'Instructions (optional)' }),
    },
  }),
  pair: block({
    label: 'Match pair',
    schema: {
      left: fields.text({ label: 'Left label' }),
      right: fields.text({ label: 'Right label (its match)' }),
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
        // The audience can self-navigate the first N slides (covered material).
        // Bump this as the course progresses. Per-slide `{% slide public=true /%}`
        // still works for one-off public slides outside this leading run.
        publicThrough: fields.integer({
          label: 'Public through slide # (audience can self-navigate slides 1..N)',
          validation: { isRequired: false },
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
