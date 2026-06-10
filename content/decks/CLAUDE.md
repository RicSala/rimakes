# Presentations (decks)

This folder holds **synced slide decks**. Each deck is a directory
`content/decks/<slug>/` containing an `index.mdoc`. Colocate slide images in the
same directory (they're served from `/cms-assets/decks/<slug>/...`).

## The whole `.mdoc` is one presentation

A single `index.mdoc` file **is** the entire deck — there is no per-slide file.
It has two parts:

1. **Frontmatter** — the first `--- … ---` block at the very top holds the
   deck's `title` and `description`. This is metadata, **not** a slide.
2. **Body** — everything after the frontmatter is the slides.

```mdoc
---
title: Intro to synced slides
description: A short demo deck.
---
# First slide

Some content.

---

## Second slide
```

### `---` separates slides

In the body, a `---` (thematic break) on its own line **starts a new slide**.
Everything between two `---` is one slide. A `---` inside a fenced code block is
safe — it stays part of the code and never splits.

### Where it shows up

- **Viewer (audience):** `/present/<slug>` — passively follows the presenter.
- **Presenter / control:** `/present/<slug>/control?key=<PRESENTATION_CONTROL_SECRET>`
  — drives the deck. Arrow keys / on-screen buttons / `o` (overview grid) navigate;
  every move is broadcast over Pusher so the whole room follows. Refreshing a
  viewer mid-talk replays the current slide.

## Per-slide settings — `{% slide %}`

Put a **self-closing** `{% slide … /%}` at the **top of a slide** to set that
slide's chrome. It is optional and is not rendered inline.

```mdoc
{% slide bg="brand" tags="Advanced, theory" /%}

## A themed, tagged slide
```

- **`bg`** — background scheme. Switches the slide's *entire* color scheme; the
  prose and any components inside (Callout, Prompt, code) re-theme automatically.
  - `none` (default — white) · `brand` (indigo) · `dark`
- **`tags`** — comma-separated corner labels. Known labels get an icon + color;
  unknown labels get a neutral chip.
  - Built-in styles: `advanced` 🎓 · `theory` 📖 · `skills` 🔧 · `practice` ⚡ · `warning` ⚠️
  - Add or change styles in `src/features/presentations/SlideTags.tsx`.
- **`width`** — content column width. `normal` (default, readable prose line
  length) · `wide` · `full`. Widen for **comparisons / wide tables** so they
  aren't cramped; leave normal for text slides.

## Available components

**Default to plain prose.** Write slides as normal Markdown (headings, text,
lists, links, code fences) and reach for a custom component only when it
genuinely fits — a `callout` to flag something important, a `prompt` for a
copyable block. Don't wrap ordinary content in components for decoration.

| Component | Syntax | Attributes |
|---|---|---|
| **Slide settings** | `{% slide bg="brand" tags="A, B" /%}` | `bg`: `none` \| `brand` \| `dark`; `tags`: comma-separated |
| **Callout** | `{% callout title="…" emoji="👋" variant="info" %}…body…{% /callout %}` | `title`, `emoji`, `variant`: `default` \| `info` \| `warning` \| `error` \| `success` |
| **Prompt** | `{% prompt title="…" %}…body…{% /prompt %}` | `title` — collapsible + copy-to-clipboard block |
| **Speaker notes** | `{% notes %}…body…{% /notes %}` | presenter-only — see below; no attributes |
| **Timer** | `{% timer minutes="5" label="…" /%}` | synced countdown — see below; `minutes`, `seconds`, `label`, `id` (self-closing) |
| **Columns** | `{% columns %}{% column title="…" %}…{% /column %}…{% /columns %}` | comparison cards — see below; `column` takes `title`, `subtitle`, `badge`, `highlight` |
| **Quiz** | `{% quiz %}{% question text="…" %}{% option correct=true %}…{% /option %}…{% explanation %}…{% /explanation %}{% /question %}…{% /quiz %}` | self-check, 1+ questions + final score — see below; `quiz` takes `title`, `mode` (`inline` \| `modal`); `question` takes `text`; `option` takes `correct` |
| **Match** | `{% match %}{% pair left="…" right="…" /%}…{% /match %}` | connect-the-columns self-check — see below; `match` takes `title`, `instructions`; `pair` takes `left`, `right` (self-closing) |
| **File tree** | a fenced ` ```tree ` block (indented text) | styled folder/file tree — see below; `/` = folder, `# …` = annotation |
| **Code editor** | `{% code-editor title="…" /%}` | `title` — interactive Sandpack editor (self-closing) |
| **Code block** | fenced ` ```ts … ``` ` | language after the opening fence — Shiki-highlighted |
| **Headings** | `# Title`, `## Subtitle` | auto-generated `id`s |
| **Markdown** | bold, italics, lists, links, blockquotes | standard Markdoc/Markdown |
| **Image** | `![alt](/cms-assets/decks/<slug>/foo.png)` | renders inline; **click to zoom** into a full-screen lightbox (Esc / click closes) |

> `callout`, `prompt`, and `notes` are **block** tags (they wrap body content,
> closed with `{% /tag %}`). `slide` and `code-editor` are **self-closing** (`/%}`).
>
> Components styled with neutral/semantic tokens (`bg-muted`, `border-border`, …)
> automatically adapt to a slide's `bg` scheme. Components with hardcoded colors
> (e.g. `{% callout variant="info" %}`, which is intentionally blue) keep their
> color regardless of the scheme.

## Columns (comparisons)

Side-by-side cards — good for comparing models, plans, options:

```mdoc
{% slide width="wide" /%}

# ¿Qué modelo uso?

{% columns %}
{% column title="Opus 4.8" subtitle="El más capaz" badge="Para lo difícil" highlight=true %}
- Razona mejor en tareas **complejas**.
- El más caro.
{% /column %}
{% column title="Sonnet 4.6" subtitle="El equilibrado" %}
- Casi tan bueno, **más rápido y barato**.
{% /column %}
{% /columns %}
```

- `{% columns %}` wraps two or more `{% column %}` cards; they sit side by side
  (equal width/height) and stack on narrow screens.
- `{% column %}` attributes: `title`, `subtitle`, `badge` (small pill),
  `highlight` (rings the card to mark the pick). Card body is normal Markdown.
- Cards use design tokens, so they re-theme with the slide's `bg`.
- **Pair 3+ columns with `{% slide width="wide" /%}`** (above) so they breathe.
- Components: `features/presentations/Columns.tsx`.

## Quiz (audience self-check)

One or more multiple-choice questions the audience answers **on their own
screen** — local, per-device, nothing is broadcast. Wrap each question in
`{% question %}`; the quiz steps through them and shows a **score screen** at the
end. Mark the right answer(s) with `correct=true`; an optional `{% explanation %}`
is revealed once that question is answered.

```mdoc
{% quiz title="Repaso del módulo" %}
{% question text="¿Qué modelo usarías para una tarea de razonamiento difícil?" %}
{% option correct=true %}**Opus 4.8** — el más capaz{% /option %}
{% option %}**Haiku 4.5** — más rápido y barato{% /option %}
{% option %}Da igual{% /option %}
{% explanation %}
**Opus** razona mejor en tareas complejas; **Haiku** prioriza velocidad y coste.
{% /explanation %}
{% /question %}
{% question text="¿Qué es un harness?" %}
{% option %}El modelo en sí{% /option %}
{% option correct=true %}El bucle que envuelve al modelo{% /option %}
{% /question %}
{% /quiz %}
```

- **`{% quiz %}`** attributes: `title` (optional heading); `mode` — `inline`
  (default, the card shows on the slide) or `modal` (only a trigger button shows;
  it opens the quiz in an overlay and reflects the score once finished — good when
  the slide already has other content).
- **`{% question %}`** — one question; `text` is the prompt. Wraps its options +
  optional explanation. Use as many as you like.
- **`{% option %}`** — one answer; `correct=true` marks a right one. Body is
  Markdown (bold, `code`, links). Write each on its own line.
- **`{% explanation %}`** — optional, per question; shown after answering. Markdown.
- **Single-question shorthand:** skip `{% question %}` and put `question="…"` on
  the quiz with the options directly inside — no score screen, just the one card.
- Flow: pick → right answer green ✓, wrong pick red ✗, explanation, then
  **Siguiente** → … → a **result** screen (score ring + per-question recap +
  **↺ Repetir**). Green/red are intentional and don't follow the slide's `bg`.
- Unlike other tags, the questions/options aren't read as React children: the
  `quiz` **transform** folds them into a `questions` prop (Markdoc client
  components are `React.lazy`-wrapped across the RSC boundary, so a parent can't
  match them by identity). Components: `features/presentations/Quiz.tsx`.

## Match (connect-the-columns self-check)

Two columns the audience **connects**: each `{% pair %}`'s `left` label belongs
with its `right` label. The right column is **scrambled**; the viewer taps a left
item then its match (or vice versa) to draw a connecting line, then **Comprobar**
scores every line green (right) or red (wrong). Like the quiz, it's local and
per-device — nothing is broadcast. Good as a warm-up / recall check (e.g. who's
who, term ↔ definition, tool ↔ what it does).

```mdoc
{% slide width="wide" /%}

# ¿Qué hace cada herramienta?

{% match title="Une cada herramienta con lo que hace" instructions="Toca una y luego su pareja; pulsa «Comprobar» al terminar." %}
{% pair left="Claude Code" right="Agente en la terminal" /%}
{% pair left="Pusher" right="Sync en tiempo real" /%}
{% pair left="Keystatic" right="Editor de contenido" /%}
{% /match %}
```

- **`{% match %}`** attributes: `title` (the task prompt, optional) and
  `instructions` (optional how-to hint; a sensible default shows if omitted).
- **`{% pair %}`** — one row; **self-closing**, with `left` and `right` text. The
  matching is `left ↔ right` of the *same* pair. Add as many as you like.
- Connect by tapping (no drag — robust on touch / projector / Zoom). Tap a node
  again to deselect; tapping a new partner re-assigns. **↺ Reiniciar** clears and
  re-scrambles. Green/red are intentional and don't follow the slide's `bg`.
- **Pair with `{% slide width="wide" /%}`** so the two columns + lines breathe.
- Like the quiz, the `pair`s aren't read as React children — the `match`
  **transform** folds them into a `pairs` prop. Components:
  `features/presentations/Match.tsx`.

## File tree

Show a directory layout (e.g. a `.claude` folder) with a fenced **`tree`** block —
just indent; the connector lines and folder/file styling are drawn for you. Use a
code fence (not a `{% tag %}`) so your indentation is preserved verbatim.

````mdoc
```tree
.claude/
  skills/
    add-slide/
      SKILL.md        # qué hace + cuándo usarla
      reference.md    # se carga solo si hace falta
  agents/
    code-reviewer.md  # un subagente
  settings.json
```
````

- **Indentation = nesting** (2 or 4 spaces, consistent). A trailing **`/`** marks a
  folder (also inferred when it has children); folders are emphasized.
- **`  # …`** after a name renders as a muted annotation.
- Renders inside a bordered, monospace card that re-themes with the slide's `bg`.
- Wiring: the `tree` language is intercepted in `markdoc-nodes.ts` and rendered by
  `features/presentations/FileTree.tsx` (no Keystatic change — it's a code fence).

## Speaker notes (presenter-only)

Wrap per-slide notes in `{% notes %}…{% /notes %}` anywhere inside a slide (one
block per slide; the first wins). They render **only on the presenter screen**
(`/present/<slug>/control`) and **never reach the audience viewer** — the viewer
page doesn't even read them, so they aren't in its HTML. The notes body is normal
Markdown (lists, bold, code, even a `callout`).

On `/control`, the current slide's notes show in a panel bottom-left; press **`n`**
to hide/show. **Drag the panel by its header** to reposition it — it stays put on
later slides (component state, no persistence across reloads). Mechanism: `extractSlideMeta` peels the `{% notes %}` block out of
the slide (like the `{% slide %}` directive) and returns it separately; only the
control page renders it. Registered in `keystatic.config.ts` (so the reader/admin
accept it) and `src/shared/blog/custom-components.tsx` (with a null-render safety
net for any stray/misplaced block).

## Timer (synced countdown)

`{% timer minutes="5" seconds="0" label="Tiempo del ejercicio" /%}` renders a big
countdown. On the **presenter** screen (`/control`) it shows **▶ Play / ↺ Reset**
and ±15 s / ±1 min controls; on the **viewer** it's display-only. Pressing Play
publishes through the same secret-gated API as slide moves, which stamps an
absolute end time and broadcasts it on a **separate** timer cache channel — so
**every connected screen counts down together** and the slide-position cache for
late joiners is untouched. At zero it **chimes** (a Web-Audio triple-beep) and the
clock **flashes** red.

- Attributes: `minutes`, `seconds` (duration; default 5 min), `label` (optional
  caption), `id` (only needed if a deck has **multiple** timers — give each a
  distinct `id` so they don't drive each other; defaults to `default`).
- **Audio caveat:** the chime is guaranteed on the presenter's machine (Play is a
  user gesture). On viewers, browser autoplay policy may mute it unless that
  viewer has interacted with the page — hence the visual flash always fires. Over
  a Zoom screen-share, the presenter's sound is what the room hears anyway.
- Wiring lives in `features/presentations/`: `Timer.tsx` (UI + sync),
  `channel.ts` (`TIMER_EVENT` / `timerChannel`), `presentation-context.tsx` (slug
  + secret), and the `/api/present/[slug]` route (stamps `endsAt`, broadcasts).

## Authoring

- **Keystatic admin** (`/keystatic` → Presentations) is the easiest way — the
  `slide`, `callout`, `prompt`, and `code-editor` components appear as
  insertable blocks, and images upload through the UI.
- Or edit `index.mdoc` directly.

Adding a brand-new custom component is a separate task (it must be registered in
both the renderer and the Keystatic editor) — see the project's
`add-markdoc-component` skill.

## Technical implementation (for maintainers)

How the rendering + realtime system actually works — the render pipeline, Pusher
sync, theming, **how to add a new component**, a full **file map**, and env vars
— lives in its own doc next to the code, to keep this file focused on authoring:

Read `src/features/presentations/ARCHITECTURE.md` (path relative to the repo
root; open it directly — don't `@`-mention it, that would load the whole file).
