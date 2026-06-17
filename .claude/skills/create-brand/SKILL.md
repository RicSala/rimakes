---
name: create-brand
description: Use when the user wants to capture, package, or document a brand's identity into a reusable, structured kit (brand voice & tone, logo, colors, typography, messaging, examples) so AI produces consistently on-brand content. Triggers on "create a brand kit", "package our branding", "document our brand voice", "set up brand guidelines for AI", or "/create-brand".
---

# create-brand — Brand Kit Builder

This skill scaffolds a **per-brand kit** (`brand-<name>/`) — plain Markdown + assets — that any
later AI session (or person) uses to write on-brand blog posts, decks, emails, landing pages,
and social copy. The kit is **decoupled from the skill system**: exposing it as a skill is
optional (the user may prefer a `CLAUDE.md` reference, or nothing).

**Do not improvise the structure.** `instructions.md` in this folder is the full playbook —
read it before you do anything. In short:

1. **Read** `instructions.md` end to end.
2. **Gather inputs** first (website, any existing guidelines, logo files; the Brandfetch
   MCP can auto-pull colors/logo for a public brand).
3. **Ask the user how the kit will be used** — a Claude Code skill, referenced from a
   `CLAUDE.md`, or standalone. Copy the kit files (`index.md`, `strategy.md`, `voice.md`,
   `visual.md`, `examples.md`, `assets/`) to the chosen location. Only if they want a skill,
   copy `templates/SKILL.md.template` into the kit **as `SKILL.md`** — keep it a thin pointer
   to `index.md`, never brand content. (It's named `.template` so this package has exactly one
   `SKILL.md`.)
4. **Fill** every file with the real brand's content. Each template contains a
   fully-written EXAMPLE inside HTML comments — replace it with real content and delete
   the comment as you go. Never ship an empty section.
5. **Collect assets** into a public Google Drive folder and index them in `assets/README.md`
   (explanation + public URL each — some tools need URLs). Insist on the minimum set,
   especially a transparent-background logo and a square icon/mark.
6. **Run the brand-readiness review** (`instructions.md` §5): push back where the kit isn't
   enough to produce branded content. Then validate — no comment blocks, no "Vela", no
   placeholders, and every asset reachable at a public URL.

The structure mirrors Anthropic's official `brand-voice` and `brand-guidelines` skills plus
the classic six-element brand book. Rationale and sources are in `instructions.md`.

> Note: this `create-brand` folder is the **generator**. It stays in place and is reused.
> The thing it produces (`brand-<name>/`) is a **separate, self-contained brand kit** — a skill
> only if the user wants one; otherwise just portable files.
