<!-- ════════════════════════════════════════════════════════════════════════
  TEMPLATE · assets/README.md — the ASSET INDEX
  Many content tools (image generators, deck builders, social schedulers,
  og-image services) need assets as PUBLIC URLs, not local files. So the source
  of truth for assets is a PUBLIC GOOGLE DRIVE FOLDER, and this file is the index
  that maps each asset to a plain explanation and a public link.

  ▸ HOW TO USE THIS FILE
    • Every HTML-comment block (like this) is an EXAMPLE for a fictional brand
      called "Vela". It is guidance, NOT real content.
    • Replace the Drive link, the index table, and the checklist with the real
      brand's assets, then DELETE the comment blocks.
    • You MAY also drop local copies of the files next to this README for offline
      use — but the Drive URLs in the index are authoritative for URL-based tools.
    • DONE = real public folder link, every asset indexed with a URL, the minimum
      set satisfied (or each gap explicitly justified), no comment blocks, no "Vela".
  ════════════════════════════════════════════════════════════════════════ -->

# Asset index — NAME

Source of truth for brand assets. Each asset has a plain explanation **and** a public URL,
because some tools can only take a URL.

## Public Google Drive folder

<!-- ✏️ REPLACE — paste the real public folder link.
EXAMPLE (Vela):

https://drive.google.com/drive/folders/1AbCdEfVELAfolder  (Anyone with the link · Viewer)
-->

### How to share & get usable links (one-time)

- **Make the folder public:** Drive → right-click the folder → *Share* → *Anyone with the link*
  → role *Viewer*. Do the same for the files if needed.
- **Per-file share link:** open the file → *Share* → *Copy link*. Looks like
  `https://drive.google.com/file/d/FILE_ID/view`.
- **Direct/raw link** (what most tools actually want): take the `FILE_ID` from the share link
  and use `https://drive.google.com/uc?export=download&id=FILE_ID`.
- If a tool can't load the asset, the folder/file is probably **not** fully public — re-check
  the sharing setting.

## Index

<!-- ✏️ REPLACE — one row per asset. Keep "What it's for" concrete so the AI picks the right file.
EXAMPLE (Vela):

| Asset                         | What it's for                          | Public URL |
|-------------------------------|----------------------------------------|------------|
| Logo — full colour (transparent) | Default logo on light backgrounds   | https://drive.google.com/uc?export=download&id=FILE_ID_1 |
| Logo — mono white (transparent)  | Logo on dark / photo backgrounds    | https://drive.google.com/uc?export=download&id=FILE_ID_2 |
| Logo — mono black                | One-colour print, stamps            | https://drive.google.com/uc?export=download&id=FILE_ID_3 |
| Icon / mark (square, transparent)| Favicon, avatar, app icon, social   | https://drive.google.com/uc?export=download&id=FILE_ID_4 |
| Favicon 512×512                  | Browser tab / PWA icon              | https://drive.google.com/uc?export=download&id=FILE_ID_5 |
| OG image 1200×630                | Default social share image          | https://drive.google.com/uc?export=download&id=FILE_ID_6 |
| Brand font(s)                    | Headings/body (or note the web link)| https://drive.google.com/uc?export=download&id=FILE_ID_7 |
-->

## Minimum required set (the AI must verify this)

The kit can't produce branded-looking content without these. Tick what exists; for anything
missing, see "If something's missing" below — do **not** silently proceed.

- [ ] **Logo — full colour, transparent background** (SVG preferred + PNG)
- [ ] **Logo — mono white, transparent background** (for dark / photo backgrounds)
- [ ] **Logo — mono black** (one-colour / print)
- [ ] **Icon / mark only** — square, legible at 32px (favicon, avatar, app icon, social)
- [ ] **Favicon** 512×512 PNG
- [ ] **Default social / OG image** 1200×630
- [ ] **Brand fonts** — linked (web) or provided here with a licence note

## If something's missing (insist — don't skip)

- **No transparent-background logo** → request it. Opaque logos break on coloured deck slides,
  hero sections, and photos. This is non-negotiable for branded content.
- **No icon / mark, or a weak one** → INSIST on a proper square mark. Favicons, avatars, app
  icons and social images all need one; a shrunk wordmark is not a mark. If the user doesn't
  have one (or you don't like the one provided), say so plainly and offer to help spec or
  generate it. Treat it as required, not optional.
- **Raster-only logo (no SVG)** → request vector; it scales without blurring.
- **Not enough colour variants** → you need at least a light-bg and a dark-bg lockup.
