# rimakes

## Project description

Personal site for **rimakes.com** (Ric Sala): portfolio + blog, a password-gated
**training/course** area, and realtime **"synced slide" decks** used to drive
live workshops (the presenter's slide moves broadcast to every viewer). Bilingual
(EN/ES). Content is authored through Keystatic and stored as Markdoc.

## Stack

- **Next.js 15** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** + Radix UI primitives
- **Keystatic** CMS over **Markdoc** content (`content/`)
- **next-intl** for i18n (EN/ES)
- **Pusher** for realtime deck sync
- **Vercel AI SDK** (`ai`, `@ai-sdk/openai`) for chat
- **Shiki** (code highlighting) · **Sandpack** (in-browser editor) · **Zod**
- Package manager **pnpm**; deployed on **Vercel**

## Project structure

```
src/
  app/                  # Next.js App Router
    [locale]/           # localized routes (EN/ES)
    api/                # route handlers
    cms-assets/         # served Keystatic uploads
  features/
    presentations/      # synced slide decks (Pusher realtime)
    training/           # password-gated course area
  shared/               # blog, chat, components, config, i18n, lib, seo, types, …
  keystatic.config.ts   # CMS schema
  middleware.ts         # i18n routing (next-intl)
content/
  blog/                 # blog posts (Markdoc)
  decks/                # slide decks (Markdoc) — authoring guide in content/decks/CLAUDE.md
```

## Main commands

```bash
pnpm dev          # dev server (Turbopack)
pnpm build        # production build
pnpm start        # serve production build
pnpm lint         # ESLint
pnpm type:check   # tsc --noEmit
pnpm build:check  # lint + type-check + build
```
