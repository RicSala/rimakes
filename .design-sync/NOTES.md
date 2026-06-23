# design-sync notes — rimakes-ui

Scoped trial: export `Button` + `Card` from `src/shared/components/ui/` to the
claude.ai/design project **rimakes-ui** (`704f90a5-8bc1-49a3-b102-8e4f01b6f494`).
rimakes is a Next.js app, not a packaged DS — so this runs the `package` shape
off the source `.tsx`, well outside the happy path. Everything below is what made
that work; read it before re-syncing or scaling to the full `ui/` set.

## Build invariants (how to re-run)

```sh
# 1. Recompile the static Tailwind CSS  — MUST run before package-build, because
#    @source scans button.tsx + card.tsx + previews/ for the utility set.
npx -y @tailwindcss/cli@4.1.14 -i .design-sync/tw-input.css -o .design-sync/styles.css
# 2. Build (scoped --entry, NOT synth-entry) + validate
node .ds-sync/package-build.mjs --config .design-sync/config.json \
  --node-modules ./node_modules --entry .design-sync/ds-entry.tsx --out ./ds-bundle
node .ds-sync/package-validate.mjs ./ds-bundle --no-render-check
```

## Why each deviation exists

- **No `dist/` / no library build.** The `package` adapter's synth-entry would
  `export * from` *every* `.tsx` under `src/` (source-kit.mjs) — for a Next app
  that drags in `next/font`, `'server-only'`, client components → esbuild fails.
  Fix: `.design-sync/ds-entry.tsx` re-exports ONLY the in-scope components, passed
  via `--entry`. **To scale:** add the other `ui/` primitives' re-exports there and
  extend `componentSrcMap`.
- **PKG_DIR.** With `--entry`, the converter walks up to the repo `package.json`
  (`name: portfolio`, `version: 0.1.0`) → PKG_DIR = repo root, srcRoot = `src/`.
  `globalName: RimakesUI` is pinned in config so the namespace is stable regardless
  of the package name.
- **Tailwind v4 is CSS-first** (no `tailwind.config.js`; app uses the PostCSS
  plugin against `globals.css`). Previews load plain CSS in the browser, so we AOT
  the utilities into `.design-sync/styles.css` (`cfg.cssEntry`). `tw-input.css` uses
  `@import "tailwindcss" source(none)` + explicit `@source` to bound scanning, ports
  `@theme inline` + `:root`/`.dark` verbatim from `globals.css`, and **drops**
  tw-animate-css, `@tailwindcss/typography`, and the route-scoped palettes
  (`.slide-theme-brand`, `.mapa-root`) — none touch Button/Card. The standalone
  `@tailwindcss/cli` is NOT a repo dep; we `npx` it pinned to the installed engine.
- **`.d.ts` extraction is `.d.ts`-only.** With no shipped declarations,
  `propsBodyFor` emits an empty `{ [key:string]: unknown }`. Fixed with hand-written
  `cfg.dtsPropsFor` for Button + Card (real variant/size/asChild contract). **To
  scale without hand-writing 17:** emit declarations (`tsc --emitDeclarationOnly`
  for `ui/`) and let the extractor read them.
- **Geist fonts → system fallback.** `next/font` injects `--font-geist-sans/-mono`
  at runtime; undefined outside Next. `tw-input.css` maps them to system stacks so
  nothing 404s. Accepted for the test (no real-font fidelity).
- **Group = `shared`** — derived from the src path `shared/components/ui` (generic
  `components`/`ui` filtered out). Cosmetic; rename via a `cfg.docsMap` stub with
  `category:` if wanted.

## Chromium skipped (this run)

User opted to eyeball instead of installing Playwright/chromium (~200 MB):
- `package-validate.mjs` ran with `--no-render-check` (the only validate warning).
- **Automated capture/grading did NOT run** (`package-capture.mjs` and the driver's
  capture stage need chromium). The gate was human visual review of `.review.html`.
- The conventions-rebuild used **plain `package-build.mjs`**, not the driver
  (`resync.mjs`) — the driver would fail at its capture stage without a browser. For
  a first incremental sync this is correct: the upload uses fixed write globs, not
  the driver's `.sync-diff.json`/receipt.
- No `.cache/review/*.grade.json` exist; verification is anchored durably by the
  uploaded `_ds_sync.json`.

## Known render warns

- None recorded (render check was skipped). If a future sync runs WITH chromium,
  expect a clean first pass; anything flagged is new.

## Re-sync risks (watch-list)

- **The static CSS is the big one.** `styles.css` is a Tailwind build scoped to
  Button+Card+previews — NOT a full run. claude.ai/design renders designs against
  this static CSS with **no Tailwind compiler**, so the design agent's own arbitrary
  utility classes (`bg-muted`, `p-8`, grid templates…) are absent and render
  unstyled. All semantic **token vars** are present, so `var(--token)` works as the
  escape hatch. **Open decision for scale-to-17:** broaden the compile (wider
  `@source`/a utility safelist) or accept the component-API-only palette.
- **`dtsPropsFor` is hand-maintained.** If `button.tsx` adds/renames a `variant` or
  `size`, update `cfg.dtsPropsFor.Button` — it does not auto-track the source.
- **`ds-entry.tsx` ↔ `componentSrcMap`** must stay in lockstep when adding components.
- **Tailwind CLI pin** (`4.1.14`) tracks the installed `tailwindcss`. Bump both
  together.
- **Production untouched:** nothing in `src/` was modified; all of this lives in
  `.design-sync/` + (gitignored) `.ds-sync/`/`ds-bundle/`.
