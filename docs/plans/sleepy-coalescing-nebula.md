# Plan: Training menu + password-gated deck + self-navigable public slides

## Context

The first workshop session went well and attendees asked for the slides. Today:

- The live deck is the **Markdoc** deck `Session 1` at `/present/intro-to-synced-slides`
  (the `/claude` short link redirects here). The viewer (`SlideViewer`) is **passive** —
  it only follows the presenter over Pusher, so attendees who open the URL can't move at all.
- The deck URL is **public** (no gate); only the `/control` presenter screen is secret-gated.
- We covered material only up to the slide **"Pero… ¿Qué es un plugin?"**
  (`content/decks/intro-to-synced-slides/index.mdoc:887`).

We want three things:

1. **Protect the workshop material with a password** (`ClaudeRocks`). Gate the deck **URL**,
   done in the **server component** (cookie check) — explicitly *not* in middleware.
2. **A "Training" menu item** in the site nav → a page with a card for the training →
   clicking it asks for the password.
3. **Let attendees move among the covered slides on their own.** Add a per-slide `public`
   flag; attendees can step ←/→ among public slides. During a live session the presenter's
   moves always win (everyone mirrors the projected slide) — keep it simple, no "browse lock".

Leak of the *content* is explicitly a non-concern ("I don't care if other people see these
slides; I'm sharing the password"), so the gate is a light shared-password cookie, and all
slides may stay in the client HTML.

---

## 1. Password gate (server-component cookie, no middleware)

New env var (already chosen by the user):

- `TRAINING_PASSWORD="ClaudeRocks"` → add to `.env.local` (gitignored) and to **Vercel** env
  for production. (Reuses the existing env-var pattern alongside `PRESENTATION_CONTROL_SECRET`.)

New files under `src/features/training/`:

- `access.ts` (server-only helpers):
  - `TRAINING_COOKIE = 'training_access'`.
  - `accessToken()` → `sha256(process.env.TRAINING_PASSWORD)` via `node:crypto` `createHash`
    (so the literal password never lands in a cookie and the value isn't trivially forgeable).
  - `hasTrainingAccess()` → reads `cookies()` from `next/headers`, returns
    `cookie?.value === accessToken()`.
- `actions.ts` (`'use server'`):
  - `unlockTraining(prevState, formData)` — compares `formData.get('password')` to
    `TRAINING_PASSWORD`. On match: `cookies().set(TRAINING_COOKIE, accessToken(), { httpOnly:true,
    secure:true, sameSite:'lax', path:'/', maxAge: 60*60*24*30 })` then `redirect(redirectTo)`.
    On mismatch: return `{ error: 'Contraseña incorrecta' }`. `redirectTo` comes from a hidden field.

New client component `src/features/training/PasswordForm.tsx`:

- `useActionState(unlockTraining, …)`, a single password `Input`, submit `Button`, inline error.
- Hidden `redirectTo` field. Reused in two places (the inline gate and the `/training` dialog).

Gate the **viewer** route only — `src/app/[locale]/present/[slug]/page.tsx`:

- After `setRequestLocale`, `if (!(await hasTrainingAccess())) return <TrainingGate redirectTo={'/present/' + slug} />;`
  before building slides. `TrainingGate` = a centered card wrapping `PasswordForm`.
- Reading `cookies()` makes this route dynamic; that's fine (deck content is tiny). Verify the
  build still succeeds with `generateStaticParams` present (params stay static, render is dynamic).
- **Do NOT** touch `src/app/[locale]/present/[slug]/control/page.tsx` (presenter stays gated by
  `PRESENTATION_CONTROL_SECRET`) or `src/middleware.ts`.

## 2. "Training" nav item + `/training` page

- `src/shared/components/Navbar.tsx` — add `{ label: 'training', href: '/training', regex: '^/training' }`
  to `MENU_ITEMS` (uses plain `next/link` like the other items).
- Add the label to the navbar dictionaries:
  `src/shared/components/dictionaries/{es,en}/navbar.json` → `"training": "Training"`.
- New route `src/app/[locale]/(unauth)/training/page.tsx` (server component, follows the
  `(unauth)` layout conventions):
  - A heading + one `Card` (`src/shared/components/ui/card.tsx`) for **"Sesión 1 · Introducción a Claude"**.
  - If `hasTrainingAccess()` → the card is a direct `Link` to `/present/intro-to-synced-slides`.
  - Else → the card opens a password `Dialog` containing `PasswordForm` (redirectTo = the deck).
- New UI primitive `src/shared/components/ui/dialog.tsx` — thin wrapper over the already-installed
  `@radix-ui/react-dialog` (mirror the existing `ui/sheet.tsx`); there is no Dialog yet.
- Optionally add `'/training': '/training'` to `pathnames` in
  `src/shared/internationalization/i18n/config.ts` for consistency (route works without it).

## 3. Per-slide `public` flag + self-navigation among public slides

Wire a new `public` attribute through the existing `{% slide %}` directive pipeline:

- `src/features/presentations/SlideStage.tsx` — add `public?: boolean` to the `SlideMeta` type.
- `src/features/presentations/splitSlides.ts` — in `extractSlideMeta`, read `attrs.public`
  (Boolean) into `meta.public` (same loop that already handles `bg`/`tags`/`width`).
- `src/shared/blog/custom-components.tsx` — add `public: { type: Boolean }` to the `slide` tag's
  `attributes` (required or Markdoc/Keystatic validation rejects the attribute).
- `src/keystatic.config.ts` — add `public: fields.checkbox(...)` to the `slide` block schema
  (required because `getDeck` validates through Keystatic, even for hand-authored `.mdoc`).

Enhance the **viewer** to navigate among public slides — `src/features/presentations/SlideViewer.tsx`
(used by both `/present` and `/talk`; `/talk` passes no `slidesMeta`, so it stays passive — no regression):

- Keep `useSyncedSlide(slug)` but hold a local `index`:
  `const synced = useSyncedSlide(slug); const [index, setIndex] = useState(synced);
   useEffect(() => setIndex(synced), [synced]);`
  → the presenter's moves always snap everyone to the projected slide (live mirror preserved).
- Compute `publicIndexes = slides.map((_,i)=>i).filter(i => slidesMeta?.[i]?.public)`.
- Only when `publicIndexes.length >= 2`, render prev/next controls (passed via `SlideStage`'s
  existing `overlay` prop, which both stage branches already render) and bind ←/→ keys:
  - **next** = smallest public index `> index`; **prev** = largest public index `< index`;
    disable at the ends. (Between presenter moves the attendee can roam public slides; the next
    presenter event re-asserts the live slide.)
- Keep `hideCounter` for the live audience look; the prev/next control itself shows position.

Mark the covered slides public in `content/decks/intro-to-synced-slides/index.mdoc`:

- For every slide from the first ("# Antes de nada…") **through** "# Pero… ¿Qué es un plugin?"
  (`:887`), ensure a leading `{% slide ... public=true /%}`:
  - slides that already have a `{% slide … /%}` → add `public=true`;
  - slides without one → insert `{% slide public=true /%}` at the top.
- Leave every slide **after** the plugin slide non-public (not yet covered).
- Going forward each week: marking a newly-covered slide is just adding `public=true` to its
  `{% slide %}` directive.

---

## Files touched (summary)

| Area | Files |
|---|---|
| Password gate | `src/features/training/{access.ts,actions.ts,PasswordForm.tsx}` (new); `.env.local` |
| Deck gate | `src/app/[locale]/present/[slug]/page.tsx` (+ a small `TrainingGate` card, inline or colocated) |
| Nav + page | `src/shared/components/Navbar.tsx`; `dictionaries/{es,en}/navbar.json`; `src/app/[locale]/(unauth)/training/page.tsx` (new); `src/shared/components/ui/dialog.tsx` (new); maybe `i18n/config.ts` |
| Public slides | `SlideStage.tsx`, `splitSlides.ts`, `custom-components.tsx`, `keystatic.config.ts`, `SlideViewer.tsx`; `content/decks/intro-to-synced-slides/index.mdoc` |

## Verification

1. `pnpm type:check` and `pnpm lint` clean; `pnpm build` succeeds (confirm the gated viewer
   route builds despite reading cookies).
2. `pnpm dev`, then:
   - **Gate:** open `/present/intro-to-synced-slides` (and `/claude`) in a fresh/incognito tab →
     password card appears. Wrong password → inline error. `ClaudeRocks` → deck renders; reload →
     still unlocked (cookie). `/present/.../control?key=<secret>` still works without the cookie.
   - **Nav:** click the "Training" nav item → card → password → deck. Press ←/→ and the buttons →
     move only among the covered (public) slides; the slides after "¿Qué es un plugin?" are
     unreachable via self-nav.
   - **Live mirror:** open `/control?key=<secret>` in one window and the viewer in another; moving
     the presenter snaps the viewer to the projected slide even after the viewer self-navigated.
3. Open `/keystatic` → Presentations → confirm the deck still loads and the new `public` checkbox
   shows on the Slide settings block.
