# Navegación "saltar a un fundamental y volver" en el `/control`

> **Para una instancia futura sin contexto de la conversación:** este documento es
> autosuficiente. Lee también `content/decks/CLAUDE.md` (guía de autoría del deck) y
> `src/features/presentations/ARCHITECTURE.md` (cómo funciona el render + sync).

## Problema

En el deck `content/decks/intro-to-synced-slides/index.mdoc`, el bloque
**"🛠️ Desarrollando paso a paso"** monta una app en vivo. Cada paso lleva un callout
**"A explicar"** que nombra un **fundamental** (¿Qué es un framework?, ¿Qué son las
librerías?, Git vs GitHub…). Esos fundamentales viven **antes**, en el bloque de
teoría del mismo archivo. El presentador quiere **saltar** a la slide del fundamental
cuando sale el tema, explicarlo y **volver exacto** al paso del build.

El `/control` navega por **índice de slide**: `go(n)` mueve y **retransmite por
Pusher** (la sala sigue). Había flechas/espacio, `o` (overview), `n` (notas) y un
skip-list de ocultas — pero **ningún "volver"**: un salto por overview era de ida.

---

## Mapa del repo (archivos que tocan esto)

- **Deck (contenido):** `content/decks/intro-to-synced-slides/index.mdoc`.
- **Controlador presentador:** `src/features/presentations/SlideController.tsx`
  (aquí vive la Pieza 1). Estado por índice; `go()` publica por Pusher.
- **Página /control:** `src/app/[locale]/present/[slug]/control/page.tsx`. Hace
  `splitNodeIntoSlides(deck.content.node).map(extractSlideMeta)` y pasa a
  `SlideController`: `slides`, `slidesMeta` (cada uno con `.title`, `.section`, `.bg`),
  `notes`, `secret`, `theme`. **`slidesMeta[i].title` = primer heading de la slide** →
  esto es lo que la Pieza 2 usa para resolver `title → index`.
- **Viewer de la sala:** `src/features/presentations/SlideViewer.tsx`. Pasivo, sigue a
  Pusher. **OJO:** envuelve con `PresentationProvider` igual que el control (la
  diferencia es que el control pasa `secret` y el viewer no). Por eso la Pieza 2
  **no** puede distinguir control/viewer por `PresentationProvider`: necesita un
  **contexto nuevo** propio del `SlideController`.
- **Meta de slide:** `src/features/presentations/splitSlides.ts` → `extractSlideMeta`
  (deriva `title` del primer heading, más `section`/`bg`/`notes`).
- **Registro de componentes Markdoc (para la Pieza 2):**
  - `src/keystatic.config.ts` (que el reader/admin acepten el tag).
  - `src/shared/blog/custom-components.tsx` (render del componente).
  - `src/shared/blog/markdoc-nodes.ts` (si hace falta interceptar a nivel de nodo).
  - Hay una skill del proyecto **`add-markdoc-component`** que guía este alta.

---

## Pieza 1 — motor de "Volver" (HECHO ✅, commit `7d3f212`)

Todo en `SlideController.tsx`. Sin cambios de contenido, sin autoría por slide.

- **Pila de retorno** `returnStack = useRef<number[]>([])` + estado `canGoBack`
  (un ref no re-renderiza el botón; por eso el estado).
- **`jumpTo(target)`** (salto del overview, usado por los thumbnails) ahora **apila el
  origen** `indexRef.current` antes de `go(target)` — salvo salto a la misma slide.
- **`goBack()`**: desapila y `go(prev)`; recalcula `canGoBack`.
- **Tecla `b` / `B` / `Backspace`** → `goBack()` (con `preventDefault`); `goBack`
  añadido a las deps del `useEffect` del teclado.
- **Botón "⤺ Volver"** en la barra inferior (tinte `primary`), visible **solo cuando
  `canGoBack`**.
- **Las flechas/espacio NO tocan la pila** — solo `jumpTo` apila y `goBack` desapila.
  Como todo pasa por `go()`, salto y vuelta **se retransmiten** (la sala te sigue).
- Saltos **anidados** funcionan (pila).

### Flujo en el workshop
`o` → clic en el fundamental (la sala salta contigo) → explicas (puedes avanzar con
flechas) → **`b`** / **⤺ Volver** → de vuelta a tu paso, exacto.

### Verificación
- `pnpm type:check` ✅ · `pnpm lint` ✅ (0 errores; warnings preexistentes ajenos).
- **PENDIENTE prueba manual en vivo:** `pnpm dev` →
  `/present/intro-to-synced-slides/control?key=$PRESENTATION_CONTROL_SECRET`
  (el secret sale de la env var `PRESENTATION_CONTROL_SECRET`).

### Roce que deja abierto
Para **ir** al fundamental hay que **buscarlo en la rejilla del overview**. Eso lo
resuelve la Pieza 2.

---

## Pieza 2 — botón "Ver: \<concepto\>" (HECHO ✅)

Un **clic** desde el paso del build salta directo al fundamental. Reutiliza la **misma
pila** de la Pieza 1 (⇒ "Volver" sigue igual).

**Implementado tal cual:** componente `{% goto title="…" label="…" /%}`
(self-closing) dentro de las callouts "A explicar". Archivos:
`src/features/presentations/Goto.tsx` (el botón) +
`control-nav-context.tsx` (contexto `{ resolveTitle, jumpToTitle }` que **solo**
provee `SlideController`). El mapa `title → index` se construye en `SlideController`
desde `slidesMeta`; `jumpToTitle` reusa `jumpTo` (retorno de la Pieza 1). Alta doble
en `custom-components.tsx` (schema `goto` + render `Goto`) y `keystatic.config.ts`
(bloque `goto`). En el **viewer** el `Goto` **no renderiza nada** (la sala sigue por
Pusher); si el `title` no resuelve → **chip gris inerte + `console.warn` en dev**.

**Cobertura final: los 9 fundamentales** (recap "Los fundamentos", slide 3671) son
alcanzables. 6 en su paso natural del build + 3 (que no salen en ningún paso) en la
slide **"Implementa el spec"**, donde hay mucha espera:

- En su paso: **Librerías y el stack** (shadcn), **Git y GitHub** (snapshot→GitHub),
  **Deploy (Vercel)** (Vercel+Neon), **Variables de entorno** (pega vars),
  **Bases de datos** (Prisma), **El workflow de desarrollo** (Define el `spec.md`).
- Solo en "Implementa el spec" (los 3 sin otro sitio): **Arquitectura: cliente y
  servidor**, **APIs y servicios externos**, **¿Qué hago cuando tengo un error?**
- **"Implementa el spec" es un hub con los 9**: un callout con los **3 únicos** y,
  tras un espacio, los **otros 6 repetidos** para repasar si sobra tiempo.

### Mapa real paso-del-build → fundamental (de los 9 "A explicar" actuales)

**Solo ~5 tienen slide-fundamental destino; 3-4 son tooling sin slide.** No fuerces un
`goto` donde no hay destino:

| Paso del build | Concepto "A explicar" | Slide-fundamental destino (`title=`) |
|---|---|---|
| Inicializa el proyecto con Next.js | ¿Qué es un framework? | *aprox.* "Librerías y el stack" o "Arquitectura: cliente y servidor" (no hay slide "framework") |
| shadcn/ui y una página `/theme` | ¿Qué son las librerías? | **"Librerías y el stack"** ✓ |
| Clica en el botón Run | `npm run dev` / `launch.json` | — (tooling, sin fundamental) |
| Guarda un snapshot y súbelo a GitHub | Git y GitHub | **"Git y GitHub"** ✓ |
| Publica en Vercel y provisiona Neon | Deploy y Vercel | **"Deploy (Vercel)"** ✓ |
| Pega tú las variables de entorno | Variables de entorno / `.gitignore` | **"Variables de entorno"** ✓ |
| Monta Prisma y prueba la base de datos | Scaffold / Prisma / ORM | **"Bases de datos"** ✓ |
| Añade un servidor: Prisma Studio | Prisma Studio | — (tooling, sin fundamental) |
| Actualiza el `CLAUDE.md` | Leer el CLAUDE.md | — (meta, sin fundamental) |

### Autoría (en el `.mdoc`, dentro del callout "A explicar")
Componente **self-closing**, referenciando el fundamental **por su título de heading**
(el "mapa" es ese string inline, no un fichero aparte):

```mdoc
{% goto title="Librerías y el stack" label="Ver: ¿Qué son las librerías?" /%}
```

### Piezas técnicas
1. **Resolver `title → index`.** `slidesMeta` (ya en `SlideController` y en la
   /control page) trae `.title` por slide. Construir el mapa ahí. Si un `title` no
   resuelve (heading renombrado): **degradar sin romper** (render inerte + `console.warn`
   en dev). *Alternativa robusta:* soportar `id` en el directivo `{% slide %}` y
   referenciar por `id` (sobrevive a renombrados) — más autoría.
2. **Componente Markdoc `Goto`.** Alta en `keystatic.config.ts` +
   `src/shared/blog/custom-components.tsx` (ver skill `add-markdoc-component`).
3. **Contexto presentador → componente.** Crear un **context NUEVO** (p. ej.
   `ControlNavContext` con `{ jumpToTitle }`) que **solo provee `SlideController`**
   (NO `PresentationProvider`: el viewer también lo monta). El `Goto`:
   - Con provider (/control) → **botón clicable** que llama `jumpToTitle(title)`
     (resuelve índice y usa el `jumpTo` con retorno de la Pieza 1).
   - Sin provider (viewer sala) → **render inerte** (chip no interactivo o `null`).
     La sala no navega; le llega el salto por Pusher.
4. **Vuelta.** Ya cubierta por la Pieza 1 (`b` + ⤺ Volver).

### Coste / riesgo / mantenimiento
Más superficie que la Pieza 1 (componente + registro doble + context + resolución +
inerte en viewer). Verificar con typecheck/build + prueba en vivo. Mantenimiento bajo:
los `title="…"` viven junto a cada callout; si se renombra un heading, el enlace
degrada de forma visible.

---

## Estado
- **Pieza 1:** implementada, typecheck/lint verdes, commit `7d3f212` en `main`.
  Pendiente **prueba manual** en `/control`.
- **Pieza 2:** implementada; **typecheck/lint/build verdes**. Pendiente **prueba
  manual** en `/control` (clic en "Ver: …" → salta al fundamental → `b`/⤺ Volver).

### Nota: "framework" NO es uno de los 9 fundamentales
El callout *¿Qué es un framework?* (paso "Inicializa con Next.js") se dejó **sin
`{% goto %}`** a propósito: "framework" no está en la lista de 9 fundamentales, así que
no se linka. Lo que se cablea son los **fundamentales**, no cada callout "A explicar".
