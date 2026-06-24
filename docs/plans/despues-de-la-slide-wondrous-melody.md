# Nueva slide "El árbol de CLAUDE.md"

## Context

En el deck `intro-to-synced-slides` la slide **"1 · CLAUDE.md — tu contexto"**
(líneas 2526–2535 de `content/decks/intro-to-synced-slides/index.mdoc`) explica
**con texto** los tres niveles de `CLAUDE.md`: **usuario** (`~/.claude/CLAUDE.md`),
**proyecto** (raíz del proyecto) y **anidado** (el de la carpeta donde Claude
trabaja, que se suma y donde "el más cercano manda").

Falta el **apoyo visual**: el usuario tiene un diagrama dibujado a mano (estilo
Excalidraw) con el árbol de carpetas `~/` → `.claude/`, `proyectoA/.claude/`,
`finanzas/CLAUDE.md`, `otra-carpeta/…`, anotado en verde con qué aplica cada nivel
(usuario / proyecto / anidado / "y podría haber más niveles"). Queremos insertar
**una slide nueva justo después** de la slide de texto para que el dibujo refuerce
la explicación.

Decisiones ya acordadas con el usuario:
- **Imagen:** el usuario ya ha entregado el **PNG limpio** exportado de Excalidraw
  (sin el texto "Double-click or press Enter to edit text" ni la caja de selección
  azul). Está en el image-cache de la sesión:
  `/Users/ricardosala/.claude/image-cache/c54be989-5589-451e-807a-746994945cc6/2.png`
  (1728×1640). **No** usamos la captura sucia (`1.png`).
- **Título de la slide:** **"El árbol de CLAUDE.md"**.

## Changes

Todo en un único archivo de contenido + un asset.
Archivo: `content/decks/intro-to-synced-slides/index.mdoc`
Asset nuevo: `content/decks/intro-to-synced-slides/claude-md-arbol.png`

### 1. Colocar la imagen limpia

Copiar el PNG limpio ya entregado a la carpeta del deck:

```
cp /Users/ricardosala/.claude/image-cache/c54be989-5589-451e-807a-746994945cc6/2.png \
   content/decks/intro-to-synced-slides/claude-md-arbol.png
```

Se sirve automáticamente en `/cms-assets/decks/intro-to-synced-slides/claude-md-arbol.png`
(mismo patrón que el resto de imágenes del deck, p. ej. `mapa-memoria.png`,
`proyecto-raiz.png`). El nombre en kebab-case sigue la convención existente.

### 2. Insertar la nueva slide

La slide actual termina en la **línea 2535**; la **línea 2536** es el separador
`---` que la cierra. Insertar la nueva slide **entre el fin del contenido (2535) y
ese `---`**, de modo que quede como una slide independiente entre "1 · CLAUDE.md —
tu contexto" y "Ejercicio: CLAUDE.md anidado".

Bloque a insertar (añadiendo su propio `---` por delante; el `---` que ya existe en
2536 hará de cierre):

```mdoc
---

{% slide width="wide" /%}

# El árbol de CLAUDE.md

![Árbol de carpetas con CLAUDE.md en tres niveles: usuario (~/.claude), proyecto (proyectoA/.claude) y anidado dentro de finanzas/, con notas de a qué sesiones aplica cada uno](/cms-assets/decks/intro-to-synced-slides/claude-md-arbol.png)
```

Notas:
- `width="wide"` para acompañar a las slides vecinas (ambas usan `width="wide"`) y
  dar buen tamaño al diagrama (~cuadrado, 1728×1640). La imagen es **click-to-zoom**
  por defecto, así que el detalle de las anotaciones se puede ampliar.
- Slide **solo imagen** (título + diagrama), sin texto extra: la explicación ya está
  en la slide anterior.

### 3. Subir `publicThrough` 103 → 104

En el frontmatter (línea 4) está `publicThrough: 103`. La slide de texto que
precede al diagrama está dentro del material cubierto (público), así que el nuevo
diagrama también debe ser público. Insertar una slide **desplaza en +1** el índice
de todas las posteriores, por lo que hay que **subir `publicThrough` a `104`** para
(a) incluir la slide nueva y (b) mantener exactamente el mismo último slide cubierto
que antes. Cambio de una línea:

```
publicThrough: 104
```

## Verification

1. `pnpm dev` y abrir el **control** del deck:
   `/present/intro-to-synced-slides/control?key=<PRESENTATION_CONTROL_SECRET>`
   - Navegar (o usar la vista overview `o`) hasta "1 · CLAUDE.md — tu contexto" y
     confirmar que **la siguiente** slide es "El árbol de CLAUDE.md" con el diagrama
     renderizado (sin 404 de imagen), y que **a continuación** sigue "Ejercicio:
     CLAUDE.md anidado".
   - Hacer click en la imagen → debe abrir el **lightbox** a pantalla completa.
2. Abrir el **review deck** `/present/intro-to-synced-slides/review` (pide la
   contraseña `TRAINING_PASSWORD`) y comprobar que el diagrama aparece justo tras la
   slide de CLAUDE.md y que el deck de repaso **termina donde terminaba antes**
   (el `publicThrough: 104` no recortó ni añadió de más al final).
3. `pnpm build:check` (lint + type-check + build) por higiene, aunque es solo
   contenido `.mdoc` + un asset.
