---
name: add-markdoc-component
description: How to add or change a custom Markdoc tag/component (callout-style blocks) in this project. Custom tags must be registered in TWO places — the front-end renderer AND the Keystatic editor — or authoring breaks. Use when adding/editing a Markdoc tag, a blog/deck content component, or when you see "Missing component definition for <tag>" in the Keystatic admin.
---

# Adding a custom Markdoc component

Markdoc content (blog posts and presentation decks) is authored in Keystatic and
rendered on the site. A custom tag like `{% callout %}` only works if it is
registered in **both** layers below. Registering one but not the other is the #1
cause of breakage:

- Renderer only → the Keystatic admin throws **`Missing component definition for <tag>`** when opening/saving content that uses the tag.
- Editor only → the tag saves fine but renders as nothing (or errors) on the page.

**Always do both. Keep the attribute names/types identical between them.**

## The two layers and their files

| Layer | Purpose | File |
|---|---|---|
| Renderer – React component | What the tag looks like on the live site | `src/shared/components/…` (e.g. `Callout.tsx`) |
| Renderer – Markdoc wiring | Maps the tag → component + declares attributes | `src/shared/blog/custom-components.tsx` |
| Renderer – pipeline (no edits needed) | Validates + renders using the wiring above | `src/shared/blog/render.tsx` |
| Editor – Keystatic registration | Lets the admin parse/validate/edit the tag | `src/keystatic.config.ts` (`markdocComponents`) |

> Note: `{% tag %}` syntax = a Markdoc **tag** (what this skill covers).
> Block-level Markdown like fenced code/headings are **nodes** (`src/shared/blog/markdoc-nodes.ts`) — different mechanism, rarely touched.

## Steps to add a new tag (worked example: `{% note %}`)

### 1. Build the React component (renderer display)
Create `src/shared/components/Note.tsx` (a normal client/server React component).
Its props are the tag's attributes plus `children`:

```tsx
export function Note({ tone, children }: { tone?: string; children?: React.ReactNode }) {
  return <aside className={`note note-${tone ?? 'info'}`}>{children}</aside>;
}
```

### 2. Wire it into the renderer — `src/shared/blog/custom-components.tsx`
Add the component to `CustomMarkdocComponents` (keyed by the **render name**) and
the tag to `CustomMarkdocTags` (keyed by the **tag name**):

```tsx
export const CustomMarkdocComponents = {
  Callout: Callout as Component,
  Note: Note as Component,            // ← render name → component
  // …
};

export const CustomMarkdocTags = {
  note: {                              // ← tag name == `{% note %}`
    render: 'Note',                    // ← must match a key above
    children: ['paragraph', 'tag', 'list', 'fence'], // omit if self-closing
    attributes: {
      tone: { type: String, matches: ['info', 'warning', 'danger'] },
    },
  },
  // …
};
```

- `render` must match a key in `CustomMarkdocComponents`.
- For a **self-closing** tag (no body), drop `children` and add `selfClosing: true`.

### 3. Register it in the Keystatic editor — `src/keystatic.config.ts`
Add an entry to the shared `markdocComponents` object, keyed by the **same tag
name** (`note`). Pick the right kind from `@keystatic/core/content-components`:

| Tag shape | content-component | Example here |
|---|---|---|
| Block tag **with body content** (`{% note %}…{% /note %}`) | `wrapper` | `callout` |
| **Self-closing** block (`{% youtube /%}`) | `block` | `code-editor` |
| Inline component | `inline` | — |
| Inline formatting mark | `mark` | — |

```ts
const markdocComponents = {
  callout: wrapper({ /* … */ }),
  note: wrapper({
    label: 'Note',
    schema: {
      // MIRROR the attributes from CustomMarkdocTags exactly:
      tone: fields.select({
        label: 'Tone',
        options: [
          { label: 'Info', value: 'info' },
          { label: 'Warning', value: 'warning' },
          { label: 'Danger', value: 'danger' },
        ],
        defaultValue: 'info',
      }),
    },
  }),
};
```

`markdocComponents` is shared by **both** the `posts` and `decks` collections
(`fields.markdoc({ … components: markdocComponents })`). Adding it once covers
blog posts and presentation decks.

### 4. Keep renderer ↔ editor in sync
The attribute **names** and **types** in `CustomMarkdocTags.<tag>.attributes`
must match the Keystatic `schema`. Examples:
- Markdoc `{ type: String, matches: [...] }` ↔ Keystatic `fields.select({ options: [...] })`
- Markdoc `{ type: String }` ↔ Keystatic `fields.text(...)`
- Markdoc `{ type: Boolean }` ↔ Keystatic `fields.checkbox(...)`
- Markdoc `{ type: Number }` ↔ Keystatic `fields.integer(...)` / `number(...)`

A name/type mismatch produces validation errors in the admin even after both
sides "exist".

## Verify
1. `pnpm type:check` — catches schema/typing mistakes.
2. `pnpm build` — confirms the config still loads server-side (the reader imports
   `keystatic.config.ts`) and pages prerender.
3. Restart the dev server (`pnpm dev`) — **Keystatic config changes require a
   restart**, HMR is not enough.
4. Open `http://localhost:3210/keystatic`, insert/edit the tag in a post or deck,
   and **Save** — no `Missing component definition` error.
5. Load the page (`/blog/<slug>` or `/present/<slug>`) and confirm it renders.

## Troubleshooting
- **`Missing component definition for <tag>`** in the admin → the tag is missing
  from `markdocComponents` in `keystatic.config.ts` (Step 3), or the key doesn't
  match the tag name.
- **Tag renders as nothing / React error on the page** → missing from
  `CustomMarkdocComponents`/`CustomMarkdocTags` (Step 2), or `render` doesn't
  match a component key.
- **Admin validation error despite both sides existing** → attribute name/type
  mismatch between the two registrations (Step 4).
- **Optional:** to make the tag look styled *inside* the Keystatic editor (not
  just on the live page), add a `ContentView` to its `wrapper`/`block` definition.
