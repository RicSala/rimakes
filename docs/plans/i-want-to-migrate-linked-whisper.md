# Parallel "code deck" presentation system (React components per slide)

## Context

We already have a synchronized-presentation feature where decks are authored in **Keystatic + Markdoc**
and live at `/present/[slug]`. Markdoc is a *document* medium; a slide is a *layout* medium, so bespoke
per-slide design (two-column, full-bleed, big type, custom visuals) is awkward there. The user — the sole
author and a developer — wants **complete design freedom + reusable slide templates**, which content-as-code
(a React component per slide) gives.

Rather than replace Keystatic, we add a **second, parallel system** at **`/talk/[slug]`** where each slide is
a React component composed from shared templates. Both systems run side-by-side; you choose per deck. Keystatic
stays for the blog and for any deck you'd rather author as content.

**The key enabler:** the entire realtime layer is already source-agnostic — `SlideViewer`, `SlideController`,
`useSyncedSlide`, `channel.ts`, `pusher.*`, and `POST /api/present/[slug]` are keyed only on `slug` (string) +
`slides: ReactNode[]` (+ `secret`). So the new system **reuses all of it unchanged**; only the *source* of the
slides differs (a code registry instead of the Keystatic reader).

## Decisions (from discussion)
- Route: **`/talk/[slug]`** (viewer) + `/talk/[slug]/control?key=…` (presenter). `/present/*` is untouched.
- Animations: **CSS-only for v1** — Tailwind + the already-installed `tw-animate-css`. No new dependency.
- Sample: **port the existing `intro-to-synced-slides`** deck as a code deck → `/present` vs `/talk` show the
  same content for a direct A/B comparison.
- Templates: **core set** — `SlideFrame` + Title, Section, Bullets, TwoColumn, Code, Prose, Prompt.

## Architecture

```
Keystatic reader ─► markdoc nodes ─split─► slides[]  ─┐
                                                      ├─► SlideViewer / SlideController ─► SlideStage ─► slides[index]
code-deck registry ─► deck.tsx ─► slides[] (React) ──┘        (shared, unchanged)         (one styling edit)
```
- **Reused as-is:** `SlideViewer.tsx`, `SlideController.tsx`, `useSyncedSlide.ts`, `channel.ts`,
  `pusher.client.ts`, `pusher.server.ts`, `src/app/api/present/[slug]/route.ts`.
- **One shared edit:** `SlideStage.tsx` (and the `SlideController` overview thumbnail) hardcode the Markdoc
  `prose`/`max-w-3xl` look. Parameterize via an optional `theme` prop whose **defaults reproduce today's exact
  markup**, so Keystatic decks are byte-for-byte unchanged.
- **New:** slide templates, a code-deck registry, and the `/talk` routes.

## Steps

### 1. Parameterize styling (3 existing files, additive — defaults preserve Keystatic look)
In `src/features/presentations/SlideStage.tsx` add:
```ts
export type SlideTheme = { stage?: string; content?: string; hideCounter?: boolean };
// resolve with ?? so an explicit '' is honored (full-bleed) and only undefined → Keystatic default
const DEFAULT_STAGE = 'relative flex min-h-screen w-full items-center justify-center px-6 py-20 sm:px-12';
const DEFAULT_CONTENT = 'markdoc prose prose-lg text-primary prose-a:text-primary prose-headings:text-primary prose-h1:text-4xl prose-h1:font-bold prose-h2:text-3xl prose-h2:font-bold w-full max-w-3xl';
```
Thread an optional `theme?: SlideTheme` through `SlideViewer.tsx` and `SlideController.tsx` → `SlideStage`.
In `SlideController` replace the hardcoded thumbnail class (`'markdoc prose px-6 py-6 text-primary'`) with
`theme?.content ?? 'markdoc prose px-6 py-6 text-primary'`, and honor `hideCounter`. Keystatic pages keep
calling these with **no** `theme` → identical output.

Export a shared `CODE_THEME` (e.g. in `templates/index.ts`):
```ts
export const CODE_THEME: SlideTheme = { stage: 'relative min-h-screen w-full', content: '', hideCounter: true };
```

### 2. Templates — `src/features/presentations/templates/`
`SlideFrame` is the shared full-screen chrome (background, padding, optional eyebrow/title/footer, align/justify);
every template composes it. All are **server components** (pure layout, no hooks) except where they embed an
existing client island.
```
templates/SlideFrame.tsx     # layout wrapper (server)
templates/TitleSlide.tsx     # { title, subtitle?, eyebrow?, background? }
templates/SectionSlide.tsx   # divider/chapter: { label, index?, background? }
templates/BulletsSlide.tsx   # { title?, eyebrow?, items: ReactNode[], background? }
templates/TwoColumnSlide.tsx # { title?, left, right, ratio?: '1-1'|'2-1'|'1-2', background? }
templates/CodeSlide.tsx      # ASYNC server comp; reuses MarkdocCodeBlock (Shiki): { title?, code, language?, caption? }
templates/ProseSlide.tsx     # markdown escape-hatch; reuses renderMarkdoc; adds its OWN prose wrapper: { markdown, title? }
templates/PromptSlide.tsx    # wraps the Prompt client island: { promptTitle?, children }
templates/index.ts           # barrel export + CODE_THEME
```
Reuse existing primitives: `renderMarkdoc` (`src/shared/blog/render.tsx`), `MarkdocCodeBlock`
(`src/shared/blog/components/MarkdocCodeBlock.tsx`, async), `Prompt` (`src/shared/components/Prompt.tsx`),
`Callout` (`src/shared/components/Callout.tsx`). `ProseSlide` must add its own `prose` wrapper because the
code-deck stage sets `content: ''`. Animations via `tw-animate-css`/Tailwind classes only.

### 3. Code-deck format + registry — `src/features/presentations/code-decks/`
```ts
// code-decks/types.ts
export type CodeDeck = { title: string; slides: ReactNode[] };

// code-decks/registry.ts — static map of literal-path dynamic imports = one chunk per deck
const decks: Record<string, () => Promise<{ default: CodeDeck }>> = {
  'intro-to-synced-slides': () => import('./intro-to-synced-slides/deck'),
};
export function getCodeDeckSlugs(): string[] { return Object.keys(decks); }
export async function getCodeDeck(slug: string): Promise<CodeDeck | null> {
  const load = decks[slug]; return load ? (await load()).default : null;
}
```
Each deck is a **server module** (never `'use client'`): `code-decks/<slug>/deck.tsx` default-exports a
`CodeDeck` whose `slides` is an array of template elements. Use literal-path imports (not a
template-literal path) to preserve per-deck code-splitting.

### 4. Routes — `src/app/[locale]/talk/` (must live under `[locale]` for html/body + intl)
- `talk/layout.tsx` — copy of `present/layout.tsx` (minimal full-bleed shell, `setRequestLocale`).
- `talk/[slug]/page.tsx` (viewer): `getCodeDeck(slug)` → `<SlideViewer slug={`code-${slug}`} slides={deck.slides} theme={CODE_THEME} />`; `generateStaticParams` from `getCodeDeckSlugs()` × `routing.locales`.
- `talk/[slug]/control/page.tsx` (presenter): gate on `PRESENTATION_CONTROL_SECRET` (same as present) → `<SlideController slug={`code-${slug}`} slides={deck.slides} secret={secret} theme={CODE_THEME} />`.

**Channel namespacing:** passing `slug={`code-${slug}`}` routes the Pusher channel to
`cache-deck-code-<slug>` and the POST to `/api/present/code-<slug>` — the **existing** generic broadcast route
handles it, no new API. Keystatic decks use bare slugs; the two can never collide.

### 5. Sample deck — port `intro-to-synced-slides`
`code-decks/intro-to-synced-slides/deck.tsx` reproduces the 5 slides of
`content/decks/intro-to-synced-slides/index.mdoc` with templates: TitleSlide → BulletsSlide → a Callout-composed
slide (reuse `Callout`, `emoji="👋" variant="info"`) → CodeSlide (the `nextSlide` ts snippet) → Title/Section
closer. Makes `/talk/intro-to-synced-slides` directly comparable to `/present/intro-to-synced-slides`.

## Server/client boundary (the part that must be right)
This is the **same pattern already shipping**: `present/[slug]/page.tsx` (server) builds a `slides` array whose
elements already include the `Prompt` **client island**, and passes it into the `'use client'` `SlideViewer`.
RSC fully supports passing server-rendered elements (with nested client-island references) as props to a client
component. So:
- Keep **deck modules and templates as server components**; confine `'use client'` to leaf islands (`Prompt`)
  and the already-client viewer/controller.
- **Async server components in the array (`CodeSlide`) are fine** — the server renderer resolves them while
  producing the RSC payload; do not `await` them yourself, just place `<CodeSlide/>` elements.
- Pass only serializable props (or server-rendered `children`) into islands; no functions across the boundary.
- Give each slide a stable `key` in the deck array (hygiene).

## Why no `next.config.ts` change
The Keystatic `outputFileTracingIncludes` exists because `getDeck()` does a **runtime filesystem read** of
`.mdoc` files. Code decks are **statically imported ES modules** — bundled at build time as code, nothing to
trace. So the control-page 404 we hit with Keystatic cannot occur here, and no tracing config is needed.

## Files
**New:** `src/features/presentations/templates/*` (8 files), `src/features/presentations/code-decks/types.ts`,
`code-decks/registry.ts`, `code-decks/intro-to-synced-slides/deck.tsx`, `src/app/[locale]/talk/layout.tsx`,
`talk/[slug]/page.tsx`, `talk/[slug]/control/page.tsx`.
**Modified (additive, defaults preserve behavior):** `SlideStage.tsx`, `SlideViewer.tsx`, `SlideController.tsx`.
**Untouched:** Keystatic config/decks, `present/*` routes, `decks.ts`, `splitSlides.ts`, the broadcast API,
`channel.ts`, `pusher.*`, `useSyncedSlide.ts`, `next.config.ts`.

## Verification
1. `pnpm type:check` — template prop types, registry types, `theme` threading, async `CodeSlide` in `ReactNode[]`.
2. `pnpm lint`.
3. `pnpm build` — confirm `/[locale]/talk/[slug]` + `/control` prerender (`code-intro-to-synced-slides`, both
   locales; Shiki runs at build), and `/present/*` routes are unchanged.
4. `pnpm dev`, then **regression check**: `/present/intro-to-synced-slides` looks **identical** to before
   (prose, centered, max-w-3xl) — proves the `SlideStage` default preservation.
5. `/talk/intro-to-synced-slides` renders full-bleed; open its `/control?key=$PRESENTATION_CONTROL_SECRET` in a
   second window → next/prev/arrows/overview sync the viewer.
6. **No collision:** advancing the `/talk` deck does **not** move the `/present` deck (separate
   `cache-deck-code-*` vs `cache-deck-*` channels), and vice versa.
7. Refresh the `/talk` viewer mid-talk → cache channel replays the current slide (sync layer unchanged).

## Out of scope (future)
- Slide-level lazy loading (`React.lazy` per slide) for very large/heavy decks.
- An animation library (framer-motion/motion) for transitions — deferred; CSS for now.
- More templates (Quote, Image/FullBleed, BigNumber/Stat) and slide-template variants.
- A `/talk` index page listing available code decks.
- Unifying both systems behind one `/present` resolver (kept separate intentionally for the A/B).
