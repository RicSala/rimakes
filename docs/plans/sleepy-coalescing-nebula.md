# Plan: Separate self-paced review deck (live deck stays synced & untouched)

## Context

**v1 (shipped to `main`) is broken.** It made the *live* viewer
(`/present/intro-to-synced-slides`) double as a review surface: it still followed the
presenter over Pusher **and** let the audience self-navigate. The defect: when the
presenter opens `/control` to **prepare the next session**, every move broadcasts on the
deck's Pusher channel (`cache-deck-<slug>`), so anyone reviewing past slides gets yanked
to the presenter's current slide. Live-sync and self-paced review can't share one deck.

**Fix (the user's proposal):** keep the live deck exactly as it was (synced, for running
sessions), and serve the already-covered material as a **separate, self-paced route that
never subscribes to Pusher** and only renders slides marked `public`. No content copy —
it reads the same deck via `getDeck` and filters. The password gate + Training page move
to that review route.

## Revert (back to pre-v1 behaviour)

- `src/features/presentations/SlideViewer.tsx` → the original **passive** viewer
  (`useSyncedSlide` only; no local index, no ←/→, no overlay).
- `src/app/[locale]/present/[slug]/page.tsx` → original (drop the training gate and the
  `publicThrough` resolution; just build slides + meta → `<SlideViewer>`). The live deck
  is **open again** (see *Decision* below) and untouched by the presenter-prep problem.

## Keep (already built — reused by the review route)

- **Slide model `public` / `publicThrough`:** `SlideStage.tsx` (`SlideMeta.public`),
  `splitSlides.ts` (extract `public`), `custom-components.tsx` + `keystatic.config.ts`
  (the `public` attr/checkbox + `publicThrough` deck field), and the deck frontmatter
  `publicThrough: 47`.
- **Password gate infra:** `src/features/training/{access.ts,actions.ts,PasswordForm.tsx,
  TrainingGate.tsx}` and `src/shared/components/ui/dialog.tsx`.
- **Training entry point:** the Navbar "Training" item, `/training` page, navbar
  dictionaries, and the `/training` i18n pathname.

## Add — the self-paced review route

- `src/features/presentations/ReviewViewer.tsx` (new, `'use client'`): local `index`
  state, ←/→ + PageUp/Down keys, and **← Anterior / n·N / Siguiente →** buttons over the
  slides it's handed. **No `useSyncedSlide`, no Pusher slide subscription.** Wrap in
  `PresentationProvider slug={` + "`review-${slug}`" + `}` so any in-slide `Timer` uses a
  **separate** channel and can't be driven by the live presenter. Renders via
  `SlideStage` (reused) with `hideCounter` + the overlay.
- `src/app/[locale]/present/[slug]/review/page.tsx` (new, server): password-gated via
  `hasTrainingAccess()` → `<TrainingGate redirectTo={'/present/'+slug+'/review'} />` on
  miss. Then `getDeck` → `splitNodeIntoSlides`+`extractSlideMeta` → **filter to public
  slides** (`meta.public === true || i < (deck.publicThrough ?? 0)`) → render only those
  → `<ReviewViewer>`. `notFound()` if nothing is public yet. Reuses the full-screen
  `present/layout.tsx`.
- Repoint the Training card: `src/app/[locale]/(unauth)/training/page.tsx` →
  `deckPath = '/present/intro-to-synced-slides/review'` (the card links/unlocks to the
  review route, not the live deck).

## Decision: the live deck stays open

Recommend reverting the live deck to **open** (no password), matching "keep the deck as
it was" + "I don't care if others see these slides." `/claude` keeps pointing at the live
deck for running sessions. The protected, navigable material is the gated review route.
*(If you'd rather gate the live deck too, it's a one-line add — leave the `hasTrainingAccess`
check on `present/[slug]/page.tsx`.)*

## Docs

Update `content/decks/CLAUDE.md` + `src/features/presentations/ARCHITECTURE.md`: the live
viewer is **passive/synced** again; the covered material is the **self-paced, gated
`/present/<slug>/review`** route (no Pusher). Adjust the "Public slides" / "Access"
sections accordingly.

## Files

| Area | Files |
|---|---|
| Revert | `SlideViewer.tsx`; `present/[slug]/page.tsx` |
| New | `ReviewViewer.tsx`; `present/[slug]/review/page.tsx` |
| Repoint | `(unauth)/training/page.tsx` (deck path) |
| Keep as-is | slide-model + training-gate + nav files from v1 |
| Docs | `content/decks/CLAUDE.md`; `presentations/ARCHITECTURE.md` |

## Verification

1. `pnpm type:check`, `pnpm lint`, `pnpm build` clean.
2. Dev server, two windows:
   - **Live deck unchanged:** open `/present/intro-to-synced-slides` (open, no gate) and
     `/present/.../control?key=<secret>`; moving the presenter still moves the viewer.
   - **Review route:** open `/present/intro-to-synced-slides/review` → password gate →
     `ClaudeRocks` → self-paced deck of **only** slides 1–47; ←/→ work; the slides after
     "¿Qué es un plugin?" are absent entirely.
   - **The fix:** with the review route open in one window, move the presenter's
     `/control` in another → the **review route does NOT move** (decoupled from Pusher).
   - Training page card → review route.
