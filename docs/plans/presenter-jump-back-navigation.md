# Navegación "saltar a un fundamental y volver" en el `/control`

## Problema

Durante el bloque **"🛠️ Desarrollando paso a paso"** (montar la app en vivo), cada
paso lleva un callout **"A explicar"** que nombra un **fundamental** (¿Qué es un
framework?, ¿Qué son las librerías?, Git vs GitHub…). Esos fundamentales viven
**antes**, en el bloque de teoría. El presentador quiere **saltar** a la slide del
fundamental cuando sale el tema, explicarlo, y **volver exacto** al paso del build.

El `/control` (`SlideController.tsx`) navega por **índice de slide**: `go(n)` mueve y
**retransmite por Pusher** (la sala sigue). Había flechas/espacio, `o` (overview),
`n` (notas) y un skip-list de slides ocultas — pero **ningún concepto de "volver"**:
un salto por overview era de ida y no recordaba el origen.

---

## Pieza 1 — motor de "Volver" (HECHO ✅)

Todo en `src/features/presentations/SlideController.tsx`. Sin cambios de contenido,
sin autoría por slide, nada que mantener.

- **Pila de retorno** `returnStack = useRef<number[]>([])` + estado `canGoBack` (para
  mostrar/ocultar el botón; un ref no re-renderiza).
- **`jumpTo(target)`** (el salto del overview) ahora **apila el origen**
  (`indexRef.current`) antes de `go(target)` — salvo que saltes a la misma slide.
- **`goBack()`**: desapila y `go(prev)`; actualiza `canGoBack` según lo que quede.
- **Tecla `b` / `Backspace`** → `goBack()` (con `preventDefault`); `goBack` añadido a
  las deps del `useEffect` del teclado.
- **Botón "⤺ Volver"** en la barra inferior, tintado en `primary`, visible **solo
  cuando `canGoBack`** (clicable además de la tecla).
- **Las flechas/espacio NO tocan la pila** — solo los saltos apilan y "Volver"
  desapila. Como todo pasa por `go()`, salto y vuelta **se retransmiten** (la sala te
  sigue al fundamental y de vuelta).

### Flujo resultante
1. Estás en un paso del build; sale un fundamental.
2. `o` → clic en la slide del fundamental (la sala salta contigo).
3. Explicas (puedes avanzar con flechas por varios fundamentales).
4. **`b`** o **⤺ Volver** → de vuelta a tu paso, exacto.

Saltos **anidados** funcionan (si desde el fundamental saltas a otro sitio, "Volver"
retrocede paso a paso por la pila).

### Verificación
- `pnpm type:check` ✅ · `pnpm lint` ✅ (0 errores).
- Falta prueba manual en vivo: `pnpm dev` →
  `/present/intro-to-synced-slides/control?key=<PRESENTATION_CONTROL_SECRET>`.

### Único roce que deja abierto
Para **ir** al fundamental hay que **buscarlo en la rejilla del overview**. Eso es lo
que resuelve la Pieza 2.

---

## Pieza 2 — botón "Ver: \<concepto\>" (PENDIENTE, opcional)

Objetivo: un **clic** desde el paso del build salta directo al fundamental (en vez de
buscar en el overview). Reutiliza la **misma pila** de la Pieza 1, así que "Volver"
sigue funcionando igual.

### Autoría (cómo se escribe en el `.mdoc`)
Un componente **self-closing** dentro del callout "A explicar", referenciando el
fundamental **por su título de heading** (el "mapa" es ese string inline, no un
fichero aparte):

```mdoc
{% goto title="Librerías y el stack" label="Ver: ¿Qué son las librerías?" /%}
```

### Piezas técnicas
1. **Resolver título → índice.** `splitSlides.ts` (`extractSlideMeta`) ya extrae el
   `title` (primer heading) de cada slide. Construir un mapa `title → index` una vez y
   pasarlo al controlador. Si el título no resuelve (heading renombrado), **degradar
   sin romper** (render inerte + `console.warn` en dev).
   - *Alternativa más robusta pero con más autoría:* soportar `id` en el directivo
     `{% slide %}` y referenciar por `id` (sobrevive a cambios de heading).
2. **Componente Markdoc `Goto`.** Registrarlo en:
   - `keystatic.config.ts` (para que el reader/admin lo acepten).
   - `src/shared/blog/custom-components.tsx` (render).
   - Igual que `notes`/`slide`, conviene **pelarlo en `extractSlideMeta`** o dejar que
     renderice según contexto (ver punto 3).
3. **Contexto presentador → componente.** El `Goto` necesita alcanzar
   `jumpTo(indexDelTitulo)` del `SlideController`. Crear un React context (p. ej.
   `ControlNavContext`) que **solo el `/control` provee** con `{ jumpToTitle }`:
   - En **/control**: renderiza un **botón clicable** que llama `jumpToTitle(title)`
     (que resuelve el índice y usa el `jumpTo` con retorno ya existente).
   - En el **viewer** de la sala (sin provider): render **inerte** (un chip no
     interactivo o nada) — la sala no navega; le llega el salto por Pusher.
4. **UX de vuelta.** Ya cubierta por la Pieza 1 (tecla `b` + botón ⤺ Volver). Opcional:
   resaltar el botón "Volver" tras un salto por `Goto`.

### Coste / riesgo
Más superficie que la Pieza 1: componente Markdoc + registro doble (Keystatic +
renderer) + context + resolución de títulos + render inerte en viewer. No es enorme,
pero toca varios archivos y conviene typecheck/build + prueba en vivo.

### Mantenimiento
Bajo: el "mapa" son los `title="…"` inline junto a cada callout "A explicar". Si se
renombra un heading de fundamental, el enlace deja de resolver (degradado visible).

---

## Estado
- **Pieza 1:** implementada y con typecheck/lint verdes. Pendiente prueba manual.
- **Pieza 2:** diseñada, **sin empezar** (a decisión de Ric).
