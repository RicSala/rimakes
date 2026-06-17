# create-brand — Process & Playbook

This is the manual for turning a brand into a structured, reusable **brand kit** that AI can
load to produce consistently on-brand content. Follow it top to bottom.

---

## 1. What this produces

Running this process produces one **brand kit**: a self-contained folder named `brand-<name>/`
(e.g. `brand-rimakes/`) of plain Markdown + assets. Any future AI session — or a person — reads
it to write blog posts, decks, emails, landing pages, and social copy that sound and look like
the brand.

The kit is **decoupled from the skill system**: it is just information. Whether it's *also*
exposed as a skill is the user's choice (Step 0). The generator below stays put and is reused:

```
.claude/skills/create-brand/
  SKILL.md
  instructions.md      ← you are here
  templates/           ← copied out and filled in, once per brand
```

The **output** kit can live anywhere (under `.claude/skills/`, at the repo root, under
`content/`…) and be used three ways: as a skill, referenced from a `CLAUDE.md`, or opened
directly. Same content either way:

```
brand-<name>/
  index.md             START HERE — entry point; points to the files below
  strategy.md          propósito, posicionamiento, audiencia, pilares de mensaje
  voice.md             personalidad, atributos de voz, tono, estilo, terminología
  visual.md            logo, paleta (HEX/RGB/CMYK), tipografía, imágenes
  examples.md          2-3 piezas canónicas + anti-ejemplos
  assets/
    README.md          índice de assets → explicación + URL pública (Google Drive)
                       (+ copias locales opcionales de los archivos)
  SKILL.md             OPTIONAL — only if the user wants a skill; holds NO brand content,
                       it just points to index.md (see Step 2)
```

The brand information never lives *inside* `SKILL.md`. The kit is the source of truth; a skill
(or a `CLAUDE.md` line) is only an optional pointer to it.

---

## 2. The golden rule of the templates

Every file in `templates/` is **pre-filled with a worked example** for a fictional brand
called **"Vela"**, written inside HTML comment blocks (`<!-- ... -->`). That example is there
to show you the *exact shape* each section should take.

When you fill a kit, for each section you:

1. **Read** the commented example.
2. **Write** the real brand's content as live Markdown, in the same shape.
3. **Delete** the comment block.

So the templates are **never left empty**, and the example guidance is **always deleted**.
Those two ideas are not in conflict: you *replace* example → real content. A finished kit
contains real content, zero comment blocks, and zero mentions of "Vela".

> If a section genuinely does not apply to a brand, do not delete the heading — write
> `N/A — <short reason>` so it reads as a deliberate decision, not a forgotten gap.

---

## 3. Inputs to gather first (do this before copying anything)

Spending five minutes here makes every template easier to fill:

- **The live website / product** — the single best source of real voice and visuals.
- **Any existing brand material** — old guidelines, pitch decks, About page, founder posts.
- **Logo files** — ideally vector (`.svg`). Note every variant that exists.
- **A public Google Drive folder of assets** — some content tools need assets as URLs, not
  files. Ask the user to put logos, icon/mark, favicon, social image, and fonts there and set
  it to *Anyone with the link → Viewer*. You'll index it in `assets/README.md`. (If the Google
  Drive MCP is connected, you can list the folder to confirm the minimum set is present.)
- **Brandfetch MCP** (if connected) — `get_brand` / `build_logo_urls` can auto-extract a
  public brand's logo, colors, and fonts. Great for a first draft of `visual.md`.
- **2-3 pieces of writing the brand is proud of** — these seed `examples.md`.

If inputs are thin, interview the owner: "If your brand were a person, who are they?",
"Who are you writing for?", "What three things do you say over and over?", "What words do you
refuse to use?"

---

## 4. Step-by-step

**Step 0 — Name the brand & ASK how it'll be used.** Pick a short slug, e.g. `rimakes`. Then
**ask the user** how they want the kit wired up — this decides where the files go and whether
you create a `SKILL.md`. The kit content is identical in all three:

- **As a Claude Code skill** → kit lives in `.claude/skills/brand-<name>/`; you also create
  `SKILL.md`.
- **Referenced from a `CLAUDE.md`** → kit lives anywhere (e.g. `brand-<name>/` at the repo
  root or under `content/`); you add a pointer line to a `CLAUDE.md`. No `SKILL.md`.
- **Standalone** → kit lives anywhere; no wrapper at all. Files are referenced when needed.

Don't assume — if the user hasn't said, ask before copying anything.

**Step 1 — Copy the kit files.** Copy everything in `templates/` **except `SKILL.md.template`**
into the destination from Step 0: `index.md`, `strategy.md`, `voice.md`, `visual.md`,
`examples.md`, and `assets/`. Never copy `instructions.md` — it's the generator's manual. Then
fill `index.md` (only the `NAME` placeholder needs changing).

**Step 2 — Wire it up (only if the user chose a wrapper).**
- **Skill:** copy `templates/SKILL.md.template` into the kit **as `SKILL.md`** (drop the
  `.template` — the wrapper is named that way so the generator package isn't rejected for
  having two `SKILL.md` files). Set its `name` to `brand-<name>` and write a precise
  `description`. Its body must stay a thin pointer to `./index.md` — never paste brand content.
- **CLAUDE.md:** add a pointer under a "Brand" heading, e.g. the Claude Code import
  `@brand-<name>/index.md`, or a relative link the AI can open. `index.md` is the pointer target.
- **Standalone:** nothing to wire; just reference `index.md` when you need the kit.

**Step 3 — Fill `strategy.md`.** The foundation. Everything else is the *expression* of what
you decide here, so do this first: purpose, vision, values, positioning, audience, pillars.

**Step 4 — Fill `voice.md`.** How the brand speaks: personality → voice attributes →
tone spectrum → style rules → terminology. Keep it consistent with `strategy.md`.

**Step 5 — Fill `visual.md`.** How the brand looks: logo, color palette, typography, imagery.
Use real HEX/RGB values — never "blue-ish". Brandfetch can pre-fill this.

**Step 6 — Assets + `examples.md`.** Get the **public Google Drive folder** from the user and
build the index in `assets/README.md` — an explanation **and** a public URL per asset. Verify
the *minimum required set* listed there; if it's incomplete, push back now (Step 7). Then
capture 2-3 gold-standard pieces and a couple of anti-examples in `examples.md` — examples are
the highest-leverage part of the kit because models imitate samples better than rules.

**Step 7 — Brand-readiness review.** Before declaring the kit done, run §5 and tell the user
plainly where it falls short. Insist on missing essentials (transparent-bg logo, a real icon).

**Step 8 — Clean up & validate.** Run the checklist in §6.

---

## 5. Brand-readiness review — push back before you generate

Your job isn't just to fill files; it's to make sure the kit is *actually enough* to produce
branded-looking content. Run this review and tell the user plainly where it falls short. **Do
not silently proceed with gaps** — name what's missing and ask for it.

**Visual readiness**
- Is there a logo with a **transparent background**? Without it the logo breaks on coloured
  slides, hero sections, and photos. If missing, request it — non-negotiable.
- Are there variants for **light and dark backgrounds** (full colour + mono white)?
- Is there a square **icon / mark**? Favicons, avatars, app icons and social images need one.
  - **No icon →** insist. Explain it's required for those surfaces; offer to help spec or
    generate one. Don't treat it as optional.
  - **Weak icon** (illegible at 32px, just a shrunk wordmark, low-res), or one you wouldn't
    ship → say so and recommend a proper mark.
- Are logos **vector (SVG)**, or at least high-res PNG? Flag raster-only logos.
- Are colours exact **HEX** values with enough range (text, background, accent)?
- Are fonts named and reachable (linked or provided in the Drive folder)?
- Is every asset in `assets/README.md` reachable at a **public URL**?

**Verbal readiness**
- Does each `voice.md` attribute have its "sounds like / does NOT sound like" pair?
- Are preferred/avoided terms real and specific, not generic?
- Does `examples.md` have ≥2 real on-brand pieces? (Models imitate samples best.)

**The test:** could a *fresh* AI session, with only this kit, produce a landing-page hero and
a social post the brand owner would approve without edits? If not, that's the gap to close.

---

## 6. Definition of done (validation checklist)

A kit is finished only when **all** of these are true:

- [ ] No `<!--` comment blocks remain in any file.
- [ ] No mention of the example brand "Vela" remains anywhere.
- [ ] No bracketed placeholders like `<Brand>`, `<name>`, `NAME`, or `[…]` remain.
- [ ] `index.md` is filled (brand name set) and lists the files actually present.
- [ ] **If** a `SKILL.md` was created: it has a real `name:`/`description:` and its body is
      only a pointer to `index.md` (no brand content pasted in). If no skill was wanted, there
      is no `SKILL.md`.
- [ ] **If** wired into a `CLAUDE.md`: the pointer line resolves to the kit's `index.md`.
- [ ] `visual.md` uses exact color values (HEX at minimum) and named font families.
- [ ] `assets/README.md` indexes every asset with an explanation **and** a public URL.
- [ ] The public Google Drive folder is set to "Anyone with the link" and the links resolve.
- [ ] The minimum asset set exists (transparent-bg logo, light/dark variants, icon/mark,
      favicon, social image) — or each gap is explicitly justified.
- [ ] No dead asset references between `visual.md` and the index.
- [ ] Every section has real content or an explicit `N/A — reason`.
- [ ] `examples.md` has at least 2 on-brand pieces and at least 1 anti-example.
- [ ] You can read `voice.md` aloud and it matches the tone of the real `examples.md`.

---

## 7. Rationale & sources (why these sections)

This structure is not invented — it merges the AI-native and the classic-branding consensus:

- **Anthropic `brand-voice` skill** — verbal identity framework: personality, voice
  attributes (we are / we are not), audience, messaging pillars, tone spectrum, style rules,
  terminology. → drives `voice.md` and the verbal half of `strategy.md`.
  `github.com/anthropics/knowledge-work-plugins` → `marketing/skills/brand-voice`
- **Anthropic `brand-guidelines` skill** — visual styling: brand colors (HEX) + typography
  applied to artifacts. → drives `visual.md`.
  `github.com/anthropics/skills` → `brand-guidelines`
- **Classic brand book (Studio Noel's "6 elements")** — proposition, logo, typefaces, colour
  palette, imagery, verbal identity. → confirms the split across `strategy/voice/visual`.

**Scaling caveat (Column Five, "Beyond design.md").** A Markdown-in-repo brand kit like this
works *well* inside a coding/agent tool (repo + build + components do part of the enforcing).
It is the right fit for this project: writing content inside the repo with Claude. It does
**not** automatically govern brand output in chat tools or embedded AI (Docs, Slides, email).
For those surfaces you'd compile this same source into per-surface packs — out of scope here,
but keep this single kit as the one source of truth if you ever go there.
