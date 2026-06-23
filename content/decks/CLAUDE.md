# Presentations (decks)

This folder holds **synced slide decks**. Each deck is a directory
`content/decks/<slug>/` containing an `index.mdoc`. Colocate slide images in the
same directory (they're served from `/cms-assets/decks/<slug>/...`).

## The whole `.mdoc` is one presentation

A single `index.mdoc` file **is** the entire deck — there is no per-slide file.
It has two parts:

1. **Frontmatter** — the first `--- … ---` block at the very top holds the
   deck's `title`, `description`, and the optional `publicThrough` (see *Public
   slides* below). This is metadata, **not** a slide.
2. **Body** — everything after the frontmatter is the slides.

```mdoc
---
title: Intro to synced slides
description: A short demo deck.
publicThrough: 12   # optional — slides 1–12 appear in the self-paced review deck
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

A `---` inside a `{% table %}` is **also safe** — there it's the row separator, not
a slide break. The splitter works on the **parsed Markdoc AST** and only cuts on
**top-level `hr` nodes** (`splitSlides.ts`), so a `---` nested inside a tag (table,
fence, etc.) never reaches the top level and never splits. That's why the
"Cowork ↔ terminal" slide can hold several `{% table %}`s — each with many `---`
rows — and still be one slide.

### Where it shows up

- **Viewer (audience):** `/present/<slug>` — passively follows the presenter (open, no
  password). For **running sessions**.
- **Review (self-paced):** `/present/<slug>/review` — a **separate**, **password-gated**
  surface showing only the covered (`public`) slides, with ←/→ navigation and **no live
  sync** (see *Public slides* and *Access* below). This is what attendees use to **review
  after a session**; prepping the live deck on `/control` can't disturb it.
- **Presenter / control:** `/present/<slug>/control?key=<PRESENTATION_CONTROL_SECRET>`
  — drives the deck. Arrow keys / on-screen buttons / `o` (overview grid) navigate;
  every move is broadcast over Pusher so the whole room follows. Refreshing a
  viewer mid-talk replays the current slide. **Not** behind the training password
  (it has its own secret).

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
- **`public`** — `true` adds this slide to the **self-paced review deck**
  (`/present/<slug>/review`), the audience-navigable copy of the covered material. See
  *Public slides & the review deck* below. To add a whole leading run at once, prefer the
  deck-level `publicThrough` over flagging every slide.
- **`section`** — a module/section label, e.g. `section="Módulo 1: Primer contacto"`.
  Marks this slide as the **start of a module**: it becomes a header in the review
  deck's **índice** (table of contents), and the slides that follow are listed under
  it. Put it on the brand divider slide that opens the module. See *Public slides & the
  review deck* below.

## Available components

**Default to plain prose.** Write slides as normal Markdown (headings, text,
lists, links, code fences) and reach for a custom component only when it
genuinely fits — a `callout` to flag something important, a `prompt` for a
copyable block. Don't wrap ordinary content in components for decoration.

| Component | Syntax | Attributes |
|---|---|---|
| **Slide settings** | `{% slide bg="brand" tags="A, B" /%}` | `bg`: `none` \| `brand` \| `dark`; `tags`: comma-separated; `width`: `normal` \| `wide` \| `full`; `public`: `true` (adds slide to the review deck); `section`: module label (groups the review índice) |
| **Callout** | `{% callout title="…" emoji="👋" variant="info" %}…body…{% /callout %}` | `title`, `emoji`, `variant`: `default` \| `info` \| `warning` \| `error` \| `success` |
| **Prompt** | `{% prompt title="…" %}…body…{% /prompt %}` | `title` — collapsible + copy-to-clipboard block |
| **Highlight** | `{% highlight %}…texto…{% /highlight %}` | inline marker-pen highlight, **default yellow**; `color`: `yellow` \| `green` \| `blue` \| `pink` \| `orange` |
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

## Highlight (resaltado tipo rotulador)

Resalta una parte del texto como con un rotulador. Es **formato inline** (un
`mark` de Keystatic, como negrita/cursiva): en el editor seleccionas el texto y
pulsas el botón 🖍 de la barra — queda **amarillo por defecto**.

```mdoc
Lo importante es {% highlight %}esta idea concreta{% /highlight %}, no el resto.
```

- **Default amarillo**, sin atributos. Para otro color, añade `color` en el
  `.mdoc`: `{% highlight color="green" %}…{% /highlight %}`.
- **Colores:** `yellow` (default) · `green` · `blue` · `pink` · `orange`.
- Es un **rotulador**: los colores son intencionados, así que **no** cambian con
  el `bg` de la slide (el texto resaltado va siempre en oscuro para que se lea
  sobre fondo claro u oscuro). Puede contener negrita/enlaces/`code`.
- Componente: `src/shared/components/Highlight.tsx`.

## Public slides & the review deck

The audience viewer (`/present/<slug>`) just **follows the presenter** — attendees never
move on their own, so prepping the next session on `/control` can never desync a live
room. To let attendees review **already-covered** slides at their own pace, the same
content is **also** served self-paced at **`/present/<slug>/review`**, which renders
**only the slides marked public** (no content is copied — it reads the same deck and
filters). Mark slides public two ways; a slide is public if **either** applies:

- **A leading run — `publicThrough` (frontmatter):** the number of covered slides, e.g.
  `publicThrough: 12` puts slides **1–12** in the review deck. The usual knob — **bump it
  as the course progresses** (one line, no per-slide edits).
- **One-off slides — `{% slide public=true /%}`:** add an individual slide anywhere
  (handy for a public slide outside the leading run).

The review deck has **← Anterior / Siguiente →** buttons + **←/→** keys and **no Pusher
connection at all**, so it's completely decoupled from a live session — moving the live
deck never moves a reviewer. It's built in `present/[slug]/review/page.tsx` (filters to
public slides) + `ReviewViewer.tsx` (the self-paced surface). The live viewer
(`SlideViewer.tsx`) stays passive and unchanged.

### Índice (table of contents)

The review deck also has an **☰ Índice** button (next to the nav buttons) that opens a
slide-over **table of contents**: every public slide listed by its first heading, grouped
into **modules** by the `{% slide section="…" /%}` markers (see `section` above). Click an
entry to jump; the current slide is highlighted; Esc or the backdrop closes it. Because
it's built from the **same public-filtered list**, it can never point at a slide the
audience shouldn't see — and slides before the first `section` show as a leading, untitled
group. With no `section` markers anywhere it degrades to a flat list of titles. Slides
without a heading fall back to their number. Built in `ReviewIndex.tsx`; the per-slide
`title` (first heading) and `section` are extracted in `splitSlides.ts` (`extractSlideMeta`).

## Access (password gate)

The **review deck** (`/present/<slug>/review`) is gated by a **shared password**
(`TRAINING_PASSWORD` env var): the first visit shows a password card, and a correct entry
stores a hashed cookie (~30 days) that reveals it. It's a **soft** gate (the content
isn't a secret) enforced in the route's **server component** — not middleware. The
**live** viewer (`/present/<slug>`) and the presenter `/control` screen are **not** gated
(`/control` keeps its own `PRESENTATION_CONTROL_SECRET`). Attendees reach the review deck
from the site's **Training** page (`/training`) → the session card → the password. Set
`TRAINING_PASSWORD` in `.env.local` **and** in Vercel for production. Wiring lives in
`src/features/training/` (`access.ts`, `actions.ts`, `PasswordForm.tsx`,
`TrainingGate.tsx`).

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

## Commands shown in slides

When a slide gives attendees a terminal command to **open a file or folder**, use
**Cursor** (`cursor <path>`) — **not** `open` (macOS) or `notepad` / `start`
(Windows):

- `cursor .` — open the current project folder
- `cursor ~/.claude/CLAUDE.md` — open a specific file (Cursor creates it on save
  if it doesn't exist yet)

Why: the workshop installs Cursor, and `cursor <path>` is the **same command on
macOS and Windows**, so the "open it yourself" step doesn't need a per-OS split.
Inside Claude Code, still prefer the relevant slash command (`/memory`, `/mcp`,
`/agents`, `/plugin`…) or simply asking Claude; reserve raw shell commands (with
`cursor` for opening) for the manual path.

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
