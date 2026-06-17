<!-- ════════════════════════════════════════════════════════════════════════
  TEMPLATE · visual.md — visual identity (how the brand LOOKS)
  Mirrors Anthropic's `brand-guidelines` skill + the classic brand book.
  Use EXACT values: real HEX/RGB, named font families, real asset paths.

  ▸ HOW TO USE THIS FILE
    • Every HTML-comment block (like this) is an EXAMPLE for a fictional brand
      called "Vela". It is guidance, NOT real content.
    • For each section: read the example, write the real brand's content in the
      same shape as live Markdown, then DELETE the comment block.
    • The Brandfetch MCP (get_brand / build_logo_urls) can pre-fill colors, fonts,
      and logo URLs for a public brand — use it for a first draft.
    • DONE = no comment blocks, no "Vela", real values, and every referenced file
      actually exists in assets/.
  ════════════════════════════════════════════════════════════════════════ -->

# Visual identity — NAME

> How the brand looks across decks, landing pages, social images, and docs.

## 1. Logo

<!-- ✏️ REPLACE — list every variant, its asset key, and the rules. Each variant must also be
indexed in `assets/README.md` with a PUBLIC URL (some tools take URLs, not files).
EXAMPLE (Vela):

**Variants** (full list + public URLs in `assets/README.md`):
| Variant                     | Asset key         | Background  | Use on |
|-----------------------------|-------------------|-------------|--------|
| Full colour                 | `logo-color.svg`  | transparent | Light backgrounds (default) |
| Mono white                  | `logo-white.svg`  | transparent | Dark / photo backgrounds |
| Mono black                  | `logo-black.svg`  | transparent | One-colour print |
| Icon / mark only (square)   | `mark.svg`        | transparent | Favicon, avatar, app icon, social |

**Required:** at least one **transparent-background** logo, plus a **light-bg** and a
**dark-bg** lockup — without them the logo breaks on coloured slides and photos.
**Clear space:** padding equal to the height of the "V" on all sides.
**Minimum size:** 24px tall (digital) / 20mm (print). The mark must stay legible at 32px.
**Misuse — never:** recolour it, rotate it, add shadows/outlines, stretch it, or place the
full-colour version on a busy photo without a dark scrim.

> No square icon/mark? Request one before relying on this kit for favicons, avatars, app
> icons, or social images — a shrunk wordmark is not a mark.
-->

## 2. Colour palette

<!-- ✏️ REPLACE — exact values. Group by role. Add CMYK/Pantone if the brand prints.
EXAMPLE (Vela):

**Core**
| Token       | Role                       | HEX      | RGB            |
|-------------|----------------------------|----------|----------------|
| Ink         | Primary text, dark bg      | `#14161A`| 20, 22, 26     |
| Paper       | Light background           | `#FBFAF7`| 251, 250, 247  |
| Slate       | Secondary text             | `#5B6472`| 91, 100, 114   |
| Mist        | Subtle bg, borders         | `#E9ECF2`| 233, 236, 242  |

**Accent**
| Token        | Role                      | HEX      | RGB           |
|--------------|---------------------------|----------|---------------|
| Vela Blue    | Primary accent, CTAs, links | `#2F6BFF`| 47, 107, 255 |
| Signal Amber | Highlights/warnings (sparing) | `#F5A524`| 245, 165, 36 |

**Accessibility:** Ink on Paper and Vela Blue on Paper both pass WCAG AA for body text.
Never put Signal Amber text on Paper (fails contrast) — use it for fills only.
-->

## 3. Typography

<!-- ✏️ REPLACE — name families + fallbacks + where each is used. Give a basic scale.
EXAMPLE (Vela):

| Role     | Family       | Fallback        | Use |
|----------|--------------|-----------------|-----|
| Headings | Geist        | Arial, sans-serif | H1-H3, hero copy |
| Body     | Inter        | system-ui, sans-serif | paragraphs, UI |
| Mono     | Geist Mono   | ui-monospace    | code, data |

**Scale:** H1 40/48 bold · H2 28/36 semibold · H3 20/28 semibold · Body 16/26 regular ·
Small 14/22. Headings sentence case (see voice.md §4).
-->

## 4. Imagery & iconography

<!-- ✏️ REPLACE — the visual "tone of voice".
EXAMPLE (Vela):

**Photography / illustration:** real product UI, generous whitespace, calm and uncluttered.
Prefer screenshots and simple diagrams over decorative stock.
- ✅ Do: clean product shots, lots of negative space, muted backgrounds.
- ❌ Don't: stock "business people high-fiving", neon gradients, busy collages.

**Icons:** 1.5px stroke, rounded corners, single accent colour. Consistent line weight.
-->

## 5. Design tokens & spacing (optional)

<!-- ✏️ REPLACE or mark N/A. If the brand has a codebase, point to where tokens already live
so copy and code stay in sync.
EXAMPLE (Vela):

Canonical tokens live in the app's Tailwind theme (`src/app/globals.css`). This file mirrors
them for content/design work; if they ever diverge, the code is the source of truth.
Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px.
-->
