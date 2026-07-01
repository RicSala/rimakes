# Presentation system — technical implementation

> **Two deck systems share one realtime layer.** The **Markdoc/Keystatic** system
> (`/present/<slug>`) renders decks authored as `.mdoc` (see
> `content/decks/CLAUDE.md` for the authoring guide). A separate **code-deck**
> system (`/talk/<slug>`) is one React component per slide — same Pusher sync,
> different source (see the file map). Everything below describes the Markdoc
> system unless it says otherwise. All paths are from the repo root (this doc
> lives at `src/features/presentations/ARCHITECTURE.md`).

## Render pipeline

Both routes are **server components** that do the same build, then hand off to a
client surface:

```
getDeck(slug)                       // Keystatic reader → parsed Markdoc AST
  → splitNodeIntoSlides(node)       // split body on top-level `---` (hr) → Node[]
  → extractSlideMeta(slide)         // per slide → { node, meta, notes }
        • peels the `{% slide %}` directive into meta (bg, tags, width, public)
        • peels `{% notes %}` out into a separate `notes` node
  → renderMarkdoc({ node })         // → one React element per slide
  → <SlideViewer> | <SlideController>   // both render <SlideStage>
```

`slidesMeta[]` rides alongside `slides[]`; `SlideStage` reads the **current**
slide's meta to theme/size it. **The control page additionally renders `notes[]`
and passes them down; the viewer page never reads notes — that is the whole
privacy model** (presenter-only data is computed only where the secret lives, so
it never reaches the audience's HTML).

The audience viewer (`/present/<slug>`) is **passive** (presenter-synced, open). A
**separate** self-paced route, `/present/<slug>/review`, serves only the covered
(`public`) slides and is password-gated — see *Audience review & access gate* below.

## Realtime sync (Pusher)

- One **cache channel** per deck: `deckChannel(slug)` = `cache-deck-<slug>`. The
  presenter's moves POST to `/api/present/[slug]` — the **only** publisher, gated
  by `PRESENTATION_CONTROL_SECRET` — which triggers `SLIDE_EVENT` carrying just
  `{ index }`. Viewers subscribe via `useSyncedSlide`. The `cache-` prefix
  replays the last event to late joiners / refreshers (no separate store).
- The **timer** uses its own cache channel, `timerChannel(slug)` =
  `cache-deck-<slug>-timer`, so a timer broadcast never clobbers the
  slide-position cache. Same POST endpoint; on `start` the server stamps an
  absolute `endsAt` so every client counts down to the same instant.
- **Graceful degradation:** `pusher.client.ts` returns `null` when its public env
  vars are missing → viewers just sit on slide 0. `pusher.server.ts` throws only
  inside the publish route.

## Theming & width

`{% slide %}` meta is applied by `SlideStage`, never inline, because it
recolors/resizes the whole stage. `bg` → a token-scope class
(`.slide-theme-brand` / `.dark` in `globals.css`) on the slide subtree, which
re-points the shared design tokens so background + prose + every token-based
component re-theme together. `width` → a paired max-width on the frame + content
column. `tags` → the corner rail (`SlideTags.tsx`).

## Adding a new custom component

A `{% mytag %}` must be registered in **two** places (or the Keystatic reader /
Markdoc validator rejects it):

1. **`src/shared/blog/custom-components.tsx`**
   - `CustomMarkdocTags.mytag` — the schema (`render` name, `children`,
     `attributes`, `selfClosing`).
   - `CustomMarkdocComponents.MyTag` — map that `render` name to a React component.
2. **`src/keystatic.config.ts`** → `markdocComponents.mytag` — a `block`/`wrapper`
   mirroring the attributes. **Required even for hand-authored `.mdoc`**, because
   `getDeck` reads through Keystatic and validates against this schema.
3. If the component is **client-interactive or needs deck context** (slug/secret),
   make it `'use client'` and read `usePresentation()` (see `Timer` / `Columns`),
   under `src/features/presentations/`.
4. If it's a **slide-level directive to strip or extract** (like `slide` / `notes`),
   handle it in `extractSlideMeta` (`splitSlides.ts`) and render it from the right
   page (e.g. notes only on `/control`).

Built-in Markdown (tables, lists, blockquotes…) needs no registration — Markdoc's
defaults cover it; only `fence`/`heading`/`image` are overridden (in
`markdoc-nodes.ts`).

### Compound components (parent needs child data) — use a transform, not children

A parent like `{% quiz %}` that must KNOW about its `{% question %}` / `{% option %}`
children (their nesting, which option is correct, their bodies) **cannot read
them as React children at runtime**: every Markdoc-mapped client component is
`React.lazy`-wrapped across the RSC boundary, so `child.type === Option` never
matches and `React.Children` sees opaque lazy nodes. Instead, give the parent a
Markdoc **`transform`** that walks the AST and folds the children into props:

- Walk **descendants recursively**, not just `node.children` — consecutive inline
  child tags (e.g. `{% option %}` on adjacent lines) get wrapped in a
  `paragraph` → `inline`, so they aren't direct children.
- Stash each child's rendered body via `child.transformChildren(config)` into a
  prop. Markdoc's `deepRender` recurses into attribute values and renders any
  `Tag` it finds, so `options: [{ correct, body }]` arrives at the component as
  real React nodes.
- The child tags (`option`/`explanation`) still need schemas (for validation /
  Keystatic) and keep a passthrough renderer as a fallback, but the parent's
  transform emits them as props and renders the children list itself.

See `quiz`/`option`/`explanation` in `custom-components.tsx` + `Quiz.tsx`.

A component produced by a **node transform** instead of a `{% tag %}` (e.g.
`CodeBlock`; `FileTree` for a ` ```tree ` fence; `ZoomableImage` for the built-in
`image` node) needs **only** the `CustomMarkdocComponents` entry — no
`CustomMarkdocTags` schema and no Keystatic block, since the author writes native
Markdown (a fenced block, an `![](…)` image) and `markdoc-nodes.ts` rewrites it to
the component.

## Audience review & access gate

- **Two surfaces, one deck.** The live viewer (`/present/<slug>`, `SlideViewer`) is
  **passive** — it only follows the presenter, so prepping the next session on `/control`
  can't desync a live room. A **separate** route, `/present/<slug>/review`
  (`ReviewViewer`), serves the same deck **self-paced** with ←/→ controls and **no Pusher
  subscription**, so a presenter moving `/control` can't move a reviewer. Its
  `PresentationProvider` slug is namespaced `review-<slug>` so an in-slide `Timer` uses
  its own channel too.
- **Which slides.** The review page renders **only** public slides — a leading run via
  the deck's `publicThrough` frontmatter, plus any per-slide `{% slide public=true /%}`.
  No content is copied; it reads the same `getDeck` and filters.
- **Access gate.** `/present/<slug>/review` is gated by a shared password.
  `hasTrainingAccess()` (`features/training/access.ts`) compares a hashed cookie to
  `sha256(TRAINING_PASSWORD)`; on miss the page renders `<TrainingGate>` instead of the
  deck. `unlockTraining` (`features/training/actions.ts`, a server action) validates the
  password, sets the cookie (~30 days), and redirects back. Reading the cookie makes the
  review route **dynamic**. The live viewer and `/control` are **not** gated. The site's
  `/training` page is the front door.

## File map

| Path | Role |
|---|---|
| `content/decks/<slug>/index.mdoc` | Deck source. One file = one deck. |
| `content/decks/CLAUDE.md` | Authoring guide (components, syntax). Points here for internals. |
| `src/app/[locale]/present/[slug]/page.tsx` | **Viewer** route (server): build slides + meta → `<SlideViewer>`. Open, presenter-synced. |
| `src/app/[locale]/present/[slug]/review/page.tsx` | **Review** route (server): password-gated; filters to `public` slides → `<ReviewViewer>`. |
| `src/app/[locale]/present/[slug]/control/page.tsx` | **Presenter** route (server): secret-gated; also builds `notes[]` → `<SlideController>`. |
| `src/app/[locale]/present/layout.tsx` | Full-screen layout for both. |
| `src/app/api/present/[slug]/route.ts` | POST publish endpoint (secret-gated). Broadcasts slide `index` or timer payload. |
| `src/features/presentations/decks.ts` | Keystatic reader: `getDeck`, `getDeckSlugs`. |
| `src/features/presentations/splitSlides.ts` | `splitNodeIntoSlides` + `extractSlideMeta` (peels `{% slide %}`→meta, `{% notes %}`→notes). |
| `src/features/presentations/SlideStage.tsx` | Renders current slide; applies `bg` scheme + `width`; counter; entrance anim. Exports `SlideMeta`. |
| `src/features/presentations/SlideViewer.tsx` | `'use client'` passive viewer; `useSyncedSlide`; wraps in `PresentationProvider` (slug). |
| `src/features/presentations/ReviewViewer.tsx` | `'use client'` self-paced review surface; local ←/→ nav, **no Pusher**; `PresentationProvider` (`review-<slug>`). |
| `src/features/presentations/SlideController.tsx` | `'use client'` presenter: publishes moves, keyboard/overview nav, notes panel; provider (slug + secret). |
| `src/features/presentations/useSyncedSlide.ts` | Viewer hook: subscribe to slide channel → current index. |
| `src/features/presentations/channel.ts` | Channel names + event names + payload types (`SLIDE_EVENT`, `TIMER_EVENT`, `deckChannel`, `timerChannel`). |
| `src/features/presentations/pusher.client.ts` | Lazy browser Pusher (subscribe); `null` if env missing. |
| `src/features/presentations/pusher.server.ts` | Lazy server Pusher (publish/trigger). |
| `src/features/presentations/presentation-context.tsx` | React context `{ slug, secret? }` → `usePresentation()`; lets in-slide components know slug + presenter. |
| `src/features/presentations/control-nav-context.tsx` | React context `{ resolveTitle, jumpToTitle }` → `useControlNav()`; **only `SlideController` provides it** (the viewer doesn't), so an in-slide `{% goto %}` can tell control from viewer. |
| `src/features/presentations/Goto.tsx` | `{% goto %}` presenter jump button: on /control jumps reversibly to a slide by title (via `useControlNav`); renders nothing on the audience viewer. |
| `src/features/presentations/Timer.tsx` | Synced countdown component. |
| `src/features/presentations/Columns.tsx` | `Columns` + `Column` comparison cards. |
| `src/features/presentations/Quiz.tsx` | `Quiz` self-check: 1+ `question`s, step-through + score screen (inline/modal). Receives a `questions` prop built by the `quiz` transform — see the compound-component note below. |
| `src/features/presentations/FileTree.tsx` | Renders a ` ```tree ` fence as a styled file tree (pure render). |
| `src/features/presentations/ZoomableImage.tsx` | Render target for the `image` node: inline image → click-to-zoom lightbox. Traps keys (capture phase) while open so nav can't move the deck. |
| `src/features/presentations/SlideTags.tsx` | Corner tag rail (icons / colors). |
| `src/shared/blog/render.tsx` | `renderMarkdoc(source)` — parse / validate / transform → React. Shared with the blog. |
| `src/shared/blog/custom-components.tsx` | `CustomMarkdocTags` (tag schemas) + `CustomMarkdocComponents` (name→component). **Register new tags here.** |
| `src/shared/blog/markdoc-nodes.ts` | Node overrides: `fence`→CodeBlock (or `FileTree` for ` ```tree `), `heading`→id, `image`→ZoomableImage. Built-ins (tables…) come from Markdoc. |
| `src/keystatic.config.ts` | Decks collection + `markdocComponents` editor schemas. **Register new tags here too.** |
| `src/app/[locale]/globals.css` | Design tokens + `.slide-theme-brand` / `.dark` scopes + `.markdoc` styles. |
| `src/features/presentations/code-decks/` + `templates/` + `src/app/[locale]/talk/…` | The separate **code-deck** system (`/talk/<slug>`): one React component per slide, same realtime layer. |
| `src/features/training/access.ts` | `hasTrainingAccess()` / `trainingAccessToken()` — cookie gate helpers (server). |
| `src/features/training/actions.ts` | `unlockTraining` server action: validate password → set hashed cookie → redirect. |
| `src/features/training/PasswordForm.tsx` + `TrainingGate.tsx` | Shared password form (client) + the deck's inline gate card. |
| `src/app/[locale]/(unauth)/training/` | The **Training** page (`/training`): a card that links to / unlocks the deck. |

## Env vars

- `PRESENTATION_CONTROL_SECRET` — gates the `/control` page **and** the publish API.
- `TRAINING_PASSWORD` — shared password gating the **review** deck
  (`/present/<slug>/review`) and the Training page. Stored as a hashed cookie; set it in
  Vercel for production.
- `NEXT_PUBLIC_PUSHER_KEY`, `NEXT_PUBLIC_PUSHER_CLUSTER` — browser subscribe (public).
- `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `PUSHER_CLUSTER` — server publish.
