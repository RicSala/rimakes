# Synchronized presentation / slides feature

## Context

Ric wants to host **presentations ("a course about a topic") on the website that multiple people on
different computers view at once, all locked to the same slide** as the presenter advances/rewinds —
so an audience can follow along live. The deck content should be authored like the rest of the site's
content (Keystatic + Markdoc).

It was explored as a possibly-temporary feature, so it's built **mostly isolated** (one feature
folder + a small route footprint + one additive Keystatic collection) and is easy to delete later —
but modifying existing files is allowed where it's clean.

### Why this works on the current (static/serverless) stack
The slides are **static content** (Keystatic → Markdoc, server-rendered, exactly like the blog). The
only thing that's *live* is a single number — "which slide are we on." That number is broadcast
through a realtime pub/sub service to every viewer's browser; the browser then shows
`slides[index]`. The two layers only meet at that one render. This is the same Server/Client split the
site already uses (the Sandpack `MarkdocCodeEditor` is a client island inside server-rendered Markdoc).

### Decisions (from discussion)
- **Realtime transport: Pusher Channels.** Viewers subscribe to a **public cache channel** with the
  public key (designed to be embedded, subscribe-only) — **no token/auth endpoint needed**. The
  presenter never publishes from the browser; slide changes go through a secret-gated server route
  that publishes to Pusher. So the deck can't be hijacked.
- **Late joiners:** handled natively by Pusher **cache channels** (`cache-…`) — a new subscriber
  receives the last slide event on subscribe (TTL ≤30 min). No second store/service. A heartbeat
  re-publish keeps the cache warm during long talks; on `pusher:cache_miss` the viewer defaults to 0.
- **Deck authoring: a `decks` collection in the existing Keystatic config.** (A *separate* Keystatic
  instance is impossible — `/api/keystatic` is hardcoded in `@keystatic/core`/`@keystatic/next`, no
  configurable path — so two instances would collide. One additive collection is the clean
  equivalent, editable in the existing `/keystatic`.)
- **Presenter access:** a shared secret env var (`PRESENTATION_CONTROL_SECRET`), since the app has no
  auth system. Control screen at `/present/[slug]/control?key=…`; the broadcast route re-checks it.
- **Slides:** one Markdoc document per deck, **split on `---`** (reveal.js convention), each chunk
  rendered with the **existing** `renderMarkdoc` (`src/shared/blog/render.tsx`) — so callouts, Shiki
  code blocks, and the Sandpack editor all work inside slides for free.

## Architecture

```
Keystatic `decks` collection  →  deck.content (Markdoc)  ──split on `---`──►  slides[]  (server-rendered)
                                                                                   │ passed as props
Presenter clicks Next ─► POST /api/present/[slug] (secret-gated) ─► Pusher.trigger  │
                                                                          │         ▼
Viewers ◄── 'slide-change' {index} ── Pusher cache channel ──────────►  SlideViewer renders slides[index]
```

## Steps

### 1. Dependencies + env (existing files: `package.json`, `.env.local`)
- Add `pusher` (server SDK) and `pusher-js` (client SDK).
- Add env vars: `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `PUSHER_CLUSTER` (server) +
  `NEXT_PUBLIC_PUSHER_KEY`, `NEXT_PUBLIC_PUSHER_CLUSTER` (client) + `PRESENTATION_CONTROL_SECRET`.
- **Manual prerequisite:** create a free Pusher Channels app, copy its credentials into `.env.local`.

### 2. Keystatic `decks` collection (existing file: `src/keystatic.config.ts`)
Add one collection alongside `posts` (additive, removable). Not localized — flat `content/decks/*`:
```ts
decks: collection({
  label: 'Presentations',
  slugField: 'title',
  path: 'content/decks/*',
  format: { contentField: 'content' },
  entryLayout: 'content',
  schema: {
    title: fields.slug({ name: { label: 'Title' } }),
    description: fields.text({ label: 'Description', multiline: true }),
    content: fields.markdoc({
      label: 'Slides (separate with ---)',
      options: { image: { directory: 'content/decks', publicPath: '/cms-assets/decks' } },
    }),
  },
}),
```
If decks use the Markdoc image field, add a sibling asset route `src/app/cms-assets/decks/[...path]/route.ts`
(copy `src/app/cms-assets/blog/[...path]/route.ts`, swap `blog`→`decks`). Otherwise skip.

### 3. Feature folder: `src/features/presentations/`
- `decks.ts` — server: `createReader(process.cwd(), keystaticConfig)`, `getDeck(slug)` /
  `getDeckSlugs()`. (Reuse the reader pattern from `src/shared/blog/loader.ts`.)
- `splitSlides.ts` — pure helper: split the Markdoc body on lines that are exactly `---`, **ignoring**
  ``` fenced regions; returns `string[]`. Render each with `renderMarkdoc` from `@/shared/blog/render`.
- `pusher.server.ts` — `new Pusher({...})` from the server env vars.
- `pusher.client.ts` — `new PusherJS(NEXT_PUBLIC_PUSHER_KEY, { cluster })`.
- `channel.ts` — single source for the channel name: `cache-deck-${slug}` and event `slide-change`.
- `useSyncedSlide.ts` — `'use client'`: subscribe to the cache channel, `bind('slide-change', d => setIndex(d.index))`, `bind('pusher:cache_miss', () => setIndex(0))`, unsubscribe on unmount; returns `index`.
- `SlideStage.tsx` — presentational: renders `slides[index]` fullscreen (shared by viewer + controller).
- `SlideViewer.tsx` — `'use client'`: `const i = useSyncedSlide(slug)` → `<SlideStage slides i />`. Passive (no nav).
- `SlideController.tsx` — `'use client'`: local index + Prev/Next + arrow/space keys; on change does optimistic `setIndex` **and** `POST /api/present/${slug}` with header `x-presentation-secret`; a `setInterval` heartbeat re-publishes the current index (~every few min) to keep the cache warm.

### 4. Broadcast route: `src/app/api/present/[slug]/route.ts`
`POST` only. Validate `x-presentation-secret` against `PRESENTATION_CONTROL_SECRET` (403 if wrong),
then `pusherServer.trigger(channelFor(slug), 'slide-change', { index })`. Publishing lives **only**
here — never in the browser. (`/api/*` is already excluded by the middleware matcher.)

### 5. Routes under `src/app/[locale]/present/` (isolated, no site chrome)
- `layout.tsx` — minimal fullscreen layout: `setRequestLocale(locale)` + `NextIntlClientProvider`,
  **no Navbar/Footer/Chat** (sibling to `(unauth)`, mirrors its `setRequestLocale` usage but drops the
  chrome). Decks aren't localized; the locale segment only satisfies the root layout.
- `[slug]/page.tsx` — server: `getDeck(slug)` → `splitSlides` → `slides.map(renderMarkdoc)` → render
  `<SlideViewer slug={slug} slides={slides} />`. `generateStaticParams` from `getDeckSlugs()` optional.
- `[slug]/control/page.tsx` — server: read `searchParams.key`; if `!== PRESENTATION_CONTROL_SECRET`
  → `notFound()`. Otherwise render `<SlideController slug slides secret={key} />`.

### 6. Author a sample deck
`content/decks/<slug>/index.mdoc` with a few slides separated by `---` (include a callout and a code
block to prove the existing Markdoc components render inside slides).

## Files

**New:** `src/features/presentations/*` (the files in step 3), `src/app/api/present/[slug]/route.ts`,
`src/app/[locale]/present/layout.tsx`, `src/app/[locale]/present/[slug]/page.tsx`,
`src/app/[locale]/present/[slug]/control/page.tsx`, `content/decks/<slug>/index.mdoc`, and optionally
`src/app/cms-assets/decks/[...path]/route.ts`.

**Modified (minimal, additive):** `src/keystatic.config.ts` (one collection), `package.json` (2 deps),
`.env.local` (Pusher + secret).

**Reused (not modified):** `renderMarkdoc` + custom tags/nodes (`src/shared/blog/render.tsx`,
`custom-components.tsx`, `markdoc-nodes.ts`); the `createReader` pattern; `keystaticConfig`.

## Security model
- Viewers hold only the **public** Pusher key (subscribe-only on public channels) — safe to embed.
- **Publishing is server-side only**, behind `PRESENTATION_CONTROL_SECRET`, so no viewer can move the
  deck. Worst case if the public key leaks: someone can watch slide numbers.

## Late-joiner behavior
Cache channel delivers the last slide on subscribe → refreshers/late joiners are correct. Heartbeat
re-publish keeps the ≤30-min cache warm during the talk. Cache miss (nothing published yet) → slide 0.

## Verification
1. Add Pusher creds + `PRESENTATION_CONTROL_SECRET` to `.env.local`; `pnpm install`; `pnpm dev`.
2. Author a deck in `/keystatic` (or drop a `content/decks/<slug>/index.mdoc`); confirm it lists.
3. **Sync test:** open `/present/<slug>` in one browser (viewer) and
   `/present/<slug>/control?key=<secret>` in another (or a second device). Click Next/Prev (and arrow
   keys) on control → the viewer flips within ~100ms. Verify callouts/code blocks render in slides.
4. **Late joiner:** advance to slide 3 on control, then open a fresh `/present/<slug>` → it should
   load on slide 3 (cache channel). Refresh the viewer mid-talk → still slide 3.
5. **Gate:** `/present/<slug>/control` with a wrong/missing `key` → 404; `POST /api/present/<slug>`
   without the secret header → 403.
6. `pnpm type:check` and `pnpm build` succeed; the blog is unaffected.

## Removal (if temporary)
Delete `src/features/presentations/`, `src/app/[locale]/present/`, `src/app/api/present/`,
`content/decks/`, the optional `cms-assets/decks` route, the `decks` block in `keystatic.config.ts`,
the Pusher/secret env vars, and the two deps. Nothing else references them.

## Out of scope (future)
- Speaker notes / next-slide preview on the control screen.
- Presence count ("12 watching") via Pusher presence channels.
- Per-slide deep links, fragment/step reveals, PDF export, localized decks.
- Editing slide *bodies* with custom tags via the Keystatic visual editor (render works; visual
  editing of `{% callout %}` would need registering it in `fields.markdoc` options).
