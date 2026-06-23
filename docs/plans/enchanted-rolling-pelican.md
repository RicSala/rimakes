# Prueba de design-sync: exportar `Button` + `Card` a claude.ai/design

## Context

Queremos validar si el skill **design-sync** sirve para este repo. design-sync sincroniza
**en una sola dirección** (repo local → un proyecto en claude.ai/design): lee componentes
reutilizables, los empaqueta y los sube para que el *agente de diseño* de claude.ai/design
construya UI con **nuestros componentes reales** en vez de genéricos. No es un sync en vivo:
es **re-ejecutable a mano** (vuelves a lanzarlo cuando cambian los componentes; re-sube solo lo
que cambió).

rimakes **no es un design system empaquetado**, sino una app Next.js. Pero tiene un núcleo
shadcn/Radix autónomo en `src/shared/components/ui/` (17 primitivos). Antes de invertir en los
17 + cablear toda la marca, hacemos una **prueba mínima con 2 componentes** (`Button` + `Card`)
para comprobar lo único realmente incierto: **que rendericen con nuestro estilo Tailwind v4
fuera de Next**. Si sale bien, escalamos a los 17.

**Garantía clave:** el código en producción **no se toca**. Todo lo nuevo vive en carpetas
aparte (`.design-sync/`, `ds-bundle/`, `.ds-sync/`) y no entra en el runtime ni en el deploy de
Vercel. El convertidor *lee* los componentes; no los modifica.

## Hechos del repo (ya explorados)

- **Tailwind v4, CSS-first** (no hay `tailwind.config.js`). Todo vive en
  `src/app/[locale]/globals.css`: `@import 'tailwindcss'`, `@custom-variant dark (&:is(.dark *))`,
  `@theme inline {…}` (mapea `--color-*`, `--radius-*`, `--font-*`) y los tokens shadcn en OKLCH
  bajo `:root` y `.dark`. PostCSS: `postcss.config.mjs` → `@tailwindcss/postcss`.
- **Fuentes**: Geist/Geist_Mono vía `next/font` en `src/app/[locale]/layout.tsx`, inyectadas como
  `--font-geist-sans` / `--font-geist-mono` en runtime. Fuera de Next esas vars no existen → para
  la prueba usamos *fallback* a fuentes de sistema.
- **`button.tsx`**: exporta `Button`, `buttonVariants` (cva; variants default/destructive/outline/
  secondary/ghost/link, sizes default/sm/lg/icon…). Importa `react`, `@radix-ui/react-slot`,
  `class-variance-authority`, `@/shared/lib/utils` (`cn`). No es `'use client'`.
- **`card.tsx`**: exporta `Card`, `CardHeader`, `CardFooter`, `CardTitle`, `CardAction`,
  `CardDescription`, `CardContent`. Importa `react` + `cn`. No es `'use client'`.
- **`cn`** en `src/shared/lib/utils.ts` → `clsx` + `tailwind-merge`.
- **Alias** `@/* → ./src/*` en `tsconfig.json` (esbuild lo resuelve vía `cfg.tsconfig`).
- **Entorno**: pnpm 10.26.2 (no pin en `packageManager`), Node v24 (no `.nvmrc`), **sin build de
  librería** (solo `next build`). Deps presentes: react 19.1.0, @radix-ui/react-slot ^1.2.3,
  cva ^0.7.1, clsx ^2.1.1, tailwind-merge ^3.3.1, tailwindcss ^4.1.14.

## Implicaciones para el skill (camino "package", fuera del happy-path)

1. **Sin `dist/` → modo synth-entry desde `src/`.** El convertidor sintetiza el bundle desde los
   fuentes que le pinte `componentSrcMap`. Los `.d.ts` salen algo más débiles que con un build real;
   suficiente para la prueba.
2. **Tailwind hay que precompilarlo.** Las previews cargan `styles.css` como CSS plano en el
   navegador; `@import 'tailwindcss'` no se resuelve ahí. Por eso generamos un **CSS estático**
   (preflight + utilidades usadas + tokens `:root`/`.dark`) con la CLI de Tailwind v4 y apuntamos
   `cfg.cssEntry` a él. **Este es el punto que puede necesitar 1–2 iteraciones.**

## Plan de implementación (todo en carpetas nuevas, producción intacta)

### 0. Login
Asegurar sesión en claude.ai/design (`/design-login`, o `/login` si hay suscripción). Sin esto,
las llamadas `DesignSync` fallan con error de autorización.

### 1. Stage de scripts del convertidor (aislado)
```bash
mkdir -p .ds-sync && cp -r "<skill-base>"/package-build.mjs "<skill-base>"/package-validate.mjs \
  "<skill-base>"/package-capture.mjs "<skill-base>"/resync.mjs "<skill-base>"/lib "<skill-base>"/storybook .ds-sync/
echo '{"name":"ds-sync-deps","private":true}' > .ds-sync/package.json
(cd .ds-sync && npm i esbuild ts-morph @types/react)
```
Luego `grep ASSUMPTION .ds-sync/package-*.mjs .ds-sync/lib/*.mjs` para confirmar los nombres
exactos de los overrides `cfg.*` antes de escribir la config.

### 2. CSS de Tailwind precompilado (la pieza delicada)
Crear `.design-sync/tw-input.css` reutilizando el sistema de tokens de `globals.css`, recortado:
```css
@import "tailwindcss";
@source "../../src/shared/components/ui/button.tsx";
@source "../../src/shared/components/ui/card.tsx";
@custom-variant dark (&:is(.dark *));
/* copiar @theme inline {…}, :root {…} y .dark {…} de globals.css */
:root { --font-geist-sans: ui-sans-serif, system-ui, sans-serif;
        --font-geist-mono: ui-monospace, monospace; } /* fallback de fuentes */
```
Compilar a CSS estático con la CLI v4:
```bash
npx @tailwindcss/cli -i .design-sync/tw-input.css -o .design-sync/styles.css
```
(Se omiten `tw-animate-css` y `@tailwindcss/typography` de globals.css: no hacen falta para
button/card y evitan deps extra.)

### 3. `.design-sync/config.json` (acotado a 2 componentes)
```json
{
  "pkg": "rimakes-ui",
  "globalName": "RimakesUI",
  "shape": "package",
  "tsconfig": "./tsconfig.json",
  "componentSrcMap": {
    "Button": "src/shared/components/ui/button.tsx",
    "Card": "src/shared/components/ui/card.tsx"
  },
  "cssEntry": ".design-sync/styles.css",
  "readmeHeader": ".design-sync/conventions.md"
}
```
Nota: `buttonVariants` se excluirá si el escaneo lo cuela como componente
(`"buttonVariants": null`). Claves exactas confirmadas tras el `grep ASSUMPTION` del paso 1.

### 4. `.design-sync/conventions.md` (cabecera para el agente)
Corta: el idioma es **Tailwind utility-classes** (enumerar familias reales: `bg-primary`,
`text-primary-foreground`, `rounded-md`, `border`, `bg-card`…), uso de `cn`, **sin provider**,
modo oscuro vía clase `.dark`, y dónde viven los tokens. Validar que cada clase/token citado
existe en el CSS compilado antes de cerrarla.

### 5. Build + validate del convertidor
```bash
node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --out ./ds-bundle
node .ds-sync/package-validate.mjs ./ds-bundle
```
(Synth-entry: sin `--entry`; se confirma con el `grep ASSUMPTION`.) Iterar sobre los tags
`[TAG]` que emita validate hasta exit 0. El más probable aquí: `[CSS_*]`/`[TOKENS_MISSING]`
(ajustar `tw-input.css`/`cssEntry`) y `[FONT_MISSING]` (resuelto por el fallback de fuentes →
documentar en NOTES.md).

### 6. Render check (decisión en runtime)
`package-validate.mjs` verifica el render con playwright + chromium. Comprobar caché
(`~/.cache/ms-playwright/`). Si no hay → **preguntar** (AskUserQuestion): instalar (~200 MB),
o `--no-render-check` y revisarlo a ojo en `.review.html`.

### 7. Previews de Button + Card
Escribir `.design-sync/previews/Button.tsx` (barrer variants × sizes; estados disabled/asChild)
y `.design-sync/previews/Card.tsx` (composición real: Card + Header/Title/Description/Content/
Footer con contenido realista). Capturar y **graduar** (`good`) con
`node .ds-sync/package-capture.mjs --out ./ds-bundle`.

### 8. Crear proyecto + subir (incremental)
- `DesignSync(list_projects)` → elegir nombre sin colisión (p. ej. `rimakes-ui`), confirmarlo,
  `DesignSync(create_project)`.
- Registrar `projectId` en `.design-sync/config.json`.
- Abrir el plan de subida (`finalize_plan`, **una aprobación**) y subir base + los 2 componentes.

### 9. `.gitignore`
Añadir `.ds-sync/`, `ds-bundle/`, `.design-sync/.cache/`, `.design-sync/node_modules`. Lo durable
(`config.json`, `NOTES.md`, `conventions.md`, `previews/`, `styles.css`/`tw-input.css`) se commitea
aparte si la prueba convence. (Cambio aislado; no afecta a la app.)

## Archivos nuevos (ninguno en `src/`)

- `.design-sync/`: `config.json`, `conventions.md`, `tw-input.css`, `styles.css`, `previews/Button.tsx`,
  `previews/Card.tsx`, `NOTES.md`.
- `ds-bundle/`: artefacto generado que se sube (gitignored).
- `.ds-sync/`: scripts del convertidor + sus deps (gitignored).
- `.gitignore`: entradas nuevas.

## Verificación (cómo sabremos que funcionó)

1. `package-validate.mjs ./ds-bundle` sale **exit 0**.
2. `npx serve ds-bundle` → abrir `Button.html` y `Card.html`: se ven **con nuestro estilo**
   (colores OKLCH correctos, radios, tipografía sane), no cajas sin estilo.
3. En la consola de una preview, `Object.keys(window.RimakesUI)` lista `Button` y `Card`.
4. Tras subir: abrir `https://claude.ai/design/p/<projectId>` y ver las dos fichas renderizadas
   en el panel de DS. (Re-subir es barato; los arreglos post-subida son flujo normal.)

## Riesgos / honestidad

- **El estilado es el riesgo real.** Si el CSS compilado no incluye una utilidad usada, esa
  preview sale a medio estilar → iterar `tw-input.css` (`@source`/tokens). Por eso empezamos con 2.
- **Modo synth-entry** (sin dist): los `.d.ts` son más flojos; si los tipos salen pobres, la mejora
  sería añadir un build de librería real (fuera del alcance de la prueba).
- **Payoff**: estos primitivos son shadcn estándar; el valor está en **nuestros tokens/marca**, que
  es justo lo que valida esta prueba.
- **Coste**: login + (quizá) ~200 MB de chromium + tokens del build/grading. Acotado por ser 2
  componentes.

## Si la prueba convence → escalar

Ampliar `componentSrcMap` a los 17 de `ui/`, añadir sus `@source` al `tw-input.css`, re-build +
validate + previews, y re-sync (incremental: solo sube lo nuevo). Footer/Navbar quedan fuera
(acoplados a i18n/servidor).
