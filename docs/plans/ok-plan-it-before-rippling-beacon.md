# Plan: Download public slides as a continuous PDF

## Context

The public, audience-facing surface for a deck is the password-gated, self-paced
**review** view (`/present/[slug]/review` → `ReviewViewer` → `SlideStage`), which
shows the deck's *public* slides (the leading run set by `publicThrough` plus any
`{% slide public=true /%}`). Users want to download those slides as a PDF.

A naïve "one slide per printed page" via `window.print()` clips/splits slides that
are taller than the page and wastes whitespace on short ones, because `SlideStage`
renders one full-viewport (`min-h-screen`) slide at a time. The fix is a **continuous
flowing layout**: all public slides stacked vertically as content-sized cards, with
subtle separators, that the browser's print engine paginates continuously (nothing
clipped — tall slides flow onto the next page).

Requirements from the user:
- Continuous (not slide-by-slide) PDF; subtle separators between slides; sections
  should inherit the slide's styling (brand/dark backgrounds) — nice-to-have, we'll do it.
- Frontend-only, **no new dependencies** (use the browser's native "Save as PDF").
- The handout route must **not** be obvious — unlinked, gated, `noindex`.
- From the review view, a single **"Download PDF"** button opens the handout in a
  new tab and **auto-starts** the print/download. The user never sees a route.

## Approach

Reuse the exact deck-fetch + split/filter pipeline the review page already uses, but
render the public slides through a new continuous component instead of `SlideStage`.
A small button on the review view opens the handout route with `?print=1`, which
auto-fires `window.print()` after assets load.

### 1. Extract shared slide-appearance logic — `src/features/presentations/slideStyles.ts` (new)

`SlideStage.tsx` currently keeps the per-slide style constants private
(`CONTENT_STRUCTURE`, `CONTENT_WIDTH`, `FRAME_WIDTH`, `CONTENT_COLOR_LIGHT`) and only
exports `SCHEME_CLASS`. To let the handout match slide styling **without drift**,
move these into a new module and add a helper:

```ts
export const SCHEME_CLASS: Record<string, string> = { brand: 'slide-theme-brand', dark: 'dark' };
export const CONTENT_STRUCTURE = 'markdoc prose prose-lg w-full prose-h1:text-4xl ...';
export const CONTENT_WIDTH = { normal: 'max-w-3xl', wide: 'max-w-5xl', full: 'max-w-6xl' };
export const FRAME_WIDTH  = { normal: 'max-w-4xl', wide: 'max-w-6xl', full: 'max-w-7xl' };
export const CONTENT_COLOR_LIGHT = 'text-primary prose-a:text-primary prose-headings:text-primary';

// Mirrors SlideStage's Keystatic branch: scheme scope + width + prose color.
export function resolveSlideAppearance(meta?: SlideMeta) {
  const schemeClass = meta?.bg ? SCHEME_CLASS[meta.bg] ?? '' : '';
  const widthKey = meta?.width && CONTENT_WIDTH[meta.width] ? meta.width : 'normal';
  const contentClass = `${CONTENT_STRUCTURE} ${CONTENT_WIDTH[widthKey]} ${schemeClass ? 'prose-invert' : CONTENT_COLOR_LIGHT}`;
  return { schemeClass, widthKey, contentClass, frameWidth: FRAME_WIDTH[widthKey] };
}
```

Refactor `SlideStage.tsx` to import these from `slideStyles.ts` and use
`resolveSlideAppearance` in its Keystatic branch (no behavior change). **Keep
`export { SCHEME_CLASS }` available from `SlideStage.tsx`** (re-export) — the overview
thumbnails import it from there (per the existing comment), so that import must not break.

### 2. Continuous render component — `src/features/presentations/ContinuousDeck.tsx` (new, client)

Props: `{ slug: string; slides: ReactNode[]; slidesMeta?: SlideMeta[]; autoPrint?: boolean }`.

- Wrap in `PresentationProvider slug={`review-${slug}`}` (same as `ReviewViewer`) so any
  in-slide client component (e.g. `Timer`) stays decoupled and nothing crashes.
- Render a centered column (e.g. `mx-auto max-w-5xl px-6 py-10 print:py-0`) mapping over
  every slide. For each slide, build the card with `resolveSlideAppearance(meta)`:
  - Outer card: `${schemeClass} bg-background text-foreground rounded-xl border border-border p-10 break-inside-avoid` — `bg-background` inside the scheme scope renders the **brand/dark** background as a card (inherits slide style). Crucially **content-sized**, NOT `min-h-screen`.
  - If `meta.tags?.length`, render `<SlideTags labels={meta.tags} />` (it positions itself; relative parent fine).
  - Inner: `<div className={contentClass}>{slides[i]}</div>`.
- **Separators:** vertical gap between cards (`space-y-8`) plus a faint rule via the gap;
  cards already carry their own background, so the spacing reads as a subtle separator.
- A **"Descargar PDF"** button fixed top-right (`print:hidden`, reuse `Button variant="outline" size="sm"`) that calls `window.print()` — lets a visitor re-trigger the dialog manually.
- **Auto-print** when `autoPrint`:
  ```tsx
  useEffect(() => {
    if (!autoPrint) return;
    let done = false;
    const fire = () => { if (!done) { done = true; window.print(); } };
    const imgs = Array.from(document.images).filter((i) => !i.complete)
      .map((i) => new Promise<void>((r) => { i.onload = i.onerror = () => r(); }));
    Promise.all([document.fonts.ready, ...imgs]).then(fire);
    const t = setTimeout(fire, 2500); // safety net if an asset never resolves
    window.onafterprint = () => window.close(); // tidy up the script-opened tab
    return () => clearTimeout(t);
  }, [autoPrint]);
  ```

### 3. Hidden gated route — `src/app/[locale]/present/[slug]/review/handout/page.tsx` (new)

Mirror `review/page.tsx` almost exactly (it already filters to public slides):
- `export const metadata: Metadata = { robots: { index: false, follow: false } }` so the route is never indexed (new convention — no existing `noindex` in the repo).
- Same gate: `if (!(await hasTrainingAccess())) return <TrainingGate redirectTo={`/present/${slug}/review/handout`} />;`
- Same `getDeck` + `splitNodeIntoSlides` + `extractSlideMeta` + `publicThrough`/`public` filter
  (`src/features/presentations/decks.ts`, `splitSlides.ts`) → `slides` (via `renderMarkdoc({ node }, { openLinksInNewTab: true })`) and `slidesMeta`.
- Read `searchParams` (Next 15 Promise prop) and pass `autoPrint={resolvedSearchParams.print === '1'}` to `<ContinuousDeck … />`.
- This keeps the route fully decoupled from the live Pusher deck, exactly like review.

### 4. "Download PDF" button on the review view — `src/features/presentations/ReviewViewer.tsx`

Add a button to the existing bottom overlay (next to ← Anterior / Siguiente →), styled to
match. On click, open the hidden handout in a new tab and auto-print there — the review
view itself is untouched:

```tsx
onClick={() => window.open(`${window.location.pathname}/handout?print=1`, '_blank')}
```

Using `window.location.pathname` (e.g. `/en/present/foo/review`) avoids threading the
`locale` through the client component. Click-triggered `window.open` is not popup-blocked.

### 5. Print stylesheet — `src/app/[locale]/globals.css`

Append a print block (the repo has zero print CSS today):

```css
@media print {
  @page { margin: 12mm; }
  /* Render themed (brand/dark) card backgrounds in the PDF instead of stripping them. */
  .handout-root, .handout-root * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .handout-card { break-inside: avoid; } /* keep short slides whole; tall ones flow naturally */
}
```

Add `handout-root` to `ContinuousDeck`'s wrapper and `handout-card` to each card. Use
Tailwind's built-in `print:hidden` for the button (no config change — v4 ships the variant).

## Files

- `src/features/presentations/slideStyles.ts` — **new**: shared constants + `resolveSlideAppearance`.
- `src/features/presentations/SlideStage.tsx` — refactor to import from `slideStyles.ts`; re-export `SCHEME_CLASS`.
- `src/features/presentations/ContinuousDeck.tsx` — **new** client component (vertical stack, themed cards, auto-print).
- `src/app/[locale]/present/[slug]/review/handout/page.tsx` — **new** gated, `noindex` route reusing the review pipeline.
- `src/features/presentations/ReviewViewer.tsx` — add "Download PDF" button to the overlay.
- `src/app/[locale]/globals.css` — add `@media print` / `@page` block.

## Reused (do not re-implement)

- `getDeck` — `src/features/presentations/decks.ts`
- `splitNodeIntoSlides`, `extractSlideMeta` — `src/features/presentations/splitSlides.ts`
- `renderMarkdoc({ node }, { openLinksInNewTab: true })` — `src/shared/blog/render.tsx`
- `hasTrainingAccess`, `TrainingGate` — `src/features/training/{access.ts,TrainingGate.tsx}`
- `SlideTags` — `src/features/presentations/SlideTags.tsx`
- `PresentationProvider` — `src/features/presentations/presentation-context.tsx`
- `Button` — `src/shared/components/ui/button.tsx`

## Notes / trade-offs

- Page breaks fall where the flow lands, not neatly per slide; `break-inside: avoid` keeps
  normal-length slides whole (most of them), tall slides split gracefully (no clipping).
- Default page is **A4 portrait** (natural for a flowing handout). Easy to switch to landscape
  later via `@page { size: landscape }` if desired.
- Interactive components (Quiz/Match) render in their default static state in the handout;
  `Timer` stays inert (no live channel). Acceptable for a printable handout.

## Verification

1. `pnpm dev`, unlock training, open `/<locale>/present/intro-to-synced-slides/review`.
2. Click **Download PDF** → a new tab opens at `…/review/handout?print=1` and the browser
   print dialog appears automatically; choose "Save as PDF".
3. Confirm in the preview/PDF: all public slides present in order; no clipping on long slides;
   `bg="brand"`/`dark` slides keep their backgrounds (color-adjust exact); subtle separators
   between slides; the button is absent from the print output.
4. Visit `…/review/handout` (no `?print=1`) directly to preview the continuous layout without
   auto-printing; confirm it's still password-gated and that view source / robots shows `noindex`.
5. `pnpm build:check` (lint + type-check + build) passes.
