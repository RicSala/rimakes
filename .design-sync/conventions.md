# rimakes-ui — conventions

A self-contained slice of rimakes.com's UI layer: shadcn/Radix primitives styled
with **Tailwind CSS v4** semantic tokens (OKLCH). This trial ships **Button** and
**Card** (with its compound parts). Every export is on `window.RimakesUI`.

## Setup — no provider

Components render correctly with **no wrapper, context, or theme provider**.
Import and use directly:

```tsx
const { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } = window.RimakesUI;
```

**Dark mode is class-based:** add `class="dark"` to any ancestor (e.g.
`<html class="dark">`) and every semantic token flips to its dark value — no prop,
no provider.

## Styling idiom — Tailwind utilities over semantic tokens

Style with Tailwind utility classes; colors are **semantic tokens**, never raw
palette values. Extra classes go through `className` (merged with the component's
own classes via `tailwind-merge` — yours wins on conflict).

| Role | Utilities (token-backed) |
|---|---|
| Surface | `bg-background` · `bg-card` · `bg-primary` · `bg-secondary` · `bg-destructive` |
| Text | `text-primary` · `text-primary-foreground` · `text-secondary-foreground` · `text-card-foreground` · `text-muted-foreground` |
| Border | `border` (`border-b`, `border-t`) — color is the `--border` token |
| Shape | `rounded-md` `rounded-xl` · `shadow-xs` `shadow-sm` · `font-medium` `font-semibold` |

Every semantic token is also a CSS variable, all defined in the shipped stylesheet:
`--background --foreground --card --card-foreground --popover --popover-foreground
--primary --primary-foreground --secondary --secondary-foreground --muted
--muted-foreground --accent --accent-foreground --destructive --border --input
--ring --brand`. For a surface with no matching utility in this build, use the
variable directly: `style={{ background: "var(--muted)" }}`.

> **Scope note:** `styles.css` is a *static* Tailwind build compiled from only
> Button + Card and their previews — not a full Tailwind run. All token variables
> above are present, but arbitrary utility classes may be absent. Prefer the
> component APIs and the utilities/tokens listed here; fall back to `var(--token)`
> when no utility exists.

## Where the truth lives

- `styles.css` → `@import`s `_ds_bundle.css` (tokens + compiled component styles). Link this one file.
- `components/shared/<Name>/<Name>.d.ts` — prop contract; `<Name>.prompt.md` — usage.

## Build with it

```tsx
const { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } = window.RimakesUI;

<Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Crear cuenta</CardTitle>
    <CardDescription>Empieza tu prueba gratuita.</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground">Sin tarjeta de crédito.</p>
  </CardContent>
  <CardFooter className="gap-3">
    <Button>Crear cuenta</Button>
    <Button variant="outline">Cancelar</Button>
  </CardFooter>
</Card>;
```

`Button` takes `variant` (`default | destructive | outline | secondary | ghost |
link`), `size` (`default | sm | lg | icon | icon-sm | icon-lg`), and `asChild`
(render as the child element via Radix Slot — e.g. wrap an `<a>`).
