# <Project Name>

<One-paragraph description: what the product is, who it's for, and the core goal it
optimizes for. Keep it short — it exists to orient ambiguous decisions, not to sell.>

<!-- Optional language/locale rule, e.g.:
Spanish-only UI. Domain terms stay in Spanish; code stays in English. -->

## Tech Stack

- **Next.js**
- **Prisma + Neon Postgres** — client generated to `src/generated/prisma`.
- **shadcn/ui** — primitives in `src/components/ui`. Prefer existing shadcn components and blocks
  over building your own; use the shadcn MCP server to find them.
- **TypeScript**, strict.

## Architecture

### Feature-Based Structure

Code is organized by feature, not by type. Placement rules:

- `src/features/<feature>/` — all feature logic (see pattern below).
- `src/components/ui/` — shadcn primitives only. Shared app components → `src/components/`.
- `src/lib/` — cross-feature utils (db client, helpers). No feature-specific code.
- `src/app/` — routing only; pages compose from features, hold no business logic.

Import direction: `app → features → lib/components`. Features must not import each other —
promote shared code to `lib/` or `components/` instead.

### Feature Module Pattern

New features match the shape of the nearest existing feature — copy it, don't reinvent
(use Explore subagent).

```
src/features/<feature>/
  components/         # feature UI
  actions/            # server actions (validate input, return { ok, data } | { ok, error })
  hooks/              # client hooks
  <subfeature>/       # same shape, nested — only when it owns a route AND its own data
  queries.ts          # server-only reads (prisma → plain DTOs); called by RSCs/actions
  schemas.ts          # Zod schemas (validation boundary)
  types.ts            # feature types
  const.ts            # feature constants
```

Required: `actions/`, `schemas.ts`, `types.ts`. The rest as needed. `queries.ts` holds a
feature's read functions: convert prisma rows (incl. `Decimal`) to plain serializable DTOs
before they cross to client components. A feature may read another feature's DB tables here
via prisma, but never import another feature's code.
If you add a new folder to this feature-folder convention, document it here.

## Commands

- `npm run dev` — dev server
- `npm run build` — `prisma generate && next build`
- `npm run lint` — eslint
- `npm run db:check` — verify DB connection

**Definition of done:** `npx tsc --noEmit`, `npm run lint`, and `npm run build` all pass
before reporting a task complete. If the change substantially affects the UI, also open it
in the browser and confirm it renders and behaves correctly.

## Other

- Don't reinvent the wheel: reach for shadcn and well-fitting libraries before rolling your own.
- Fix the root cause, not the band-aid.
- First-principles thinking: understand the goal, and suggest better approaches when they fit.
- Prefer server actions over API routes for mutations.
- Protect your context: use Explore subagents to scout large surfaces instead of reading everything yourself.
- Keep `docs/SPEC.md` up to date: whenever you add, change, or finish a feature, update its
  definition, its phase, and its status. Preventing drift is your job, not the user's.
- When you establish a new convention or change the structure, update this file.

## The user is a beginner

- Adapt your communication. They are a beginner (but not a kid).
- Suggest commits often (conventional commits).
- Prefer working on `main` — simpler for a beginner. Branch only when it really helps (a hint, not a hard rule).
- Avoid manual `git stash`. If Git auto-stashes during a pull/rebase, that's fine (a hint, not a hard guardrail).

## Coding style

Main principle: **favour habitability of the codebase over cleverness or optimization** —
reduce the cognitive load needed to review a section of code.

- **Locality of behaviour**: code that changes together stays together (or close).
- **Code should be legible by itself**: clear and readable like a novel — among other things, clear naming.
- **Keep the main path at the lowest indentation**: use early returns.
- **Functions stay at one level of abstraction.**
- **More than 3 parameters → use an object.**
- **Avoid excessive indirection**: don't abstract without a reason (3+ uses of the same code).
- **Open/closed**: structure code so you can extend it instead of modifying it.
- **When you abstract, make it deep**: hide complexity behind a small surface area.
- **The use case defines the API**: purism (e.g. pure REST) leaks logic; the API should provide what the use case needs.

Be pragmatic applying these. Be useful, not smart. Favour simplicity and reduce indirection.

## Cowboy Rule

Leave things better than they were when you started.

- After using docs, suggest improvements that would avoid confusion.
- Make future AI agents smarter and more aware of the context.
- After a coding session, ALWAYS check the feature documentation and fix any drift.

## References

<!-- Add here files that are important for context as the project grows
     (e.g. `docs/SPEC.md` — product spec, an ADR folder, API docs, design docs). -->
