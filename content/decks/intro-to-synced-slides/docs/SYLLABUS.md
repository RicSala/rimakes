# 📚 Temario — *Session 1: Intro to Claude*

> Curso de **8 horas** sobre Claude / Claude Code, en español.
> Deck: `intro-to-synced-slides` · ~282 slides · `publicThrough: 160`
> Estructura extraída de `index.mdoc` (divisores `section=` + primer heading de cada slide).

---

## 🎬 Apertura (encuadre)

- Antes de nada… (esto es una **beta**)
- Encuadre: **Objetivos**
- Encuadre: **Metodología**
- ¿Dudas, comentarios, sugerencias?
- Presentaciones · ¿Quién es quién?

## Módulo 1 · Primer contacto con Claude

*Qué es un LLM agéntico y el mapa mental de Claude.*

- Lo básico · De autocompletado a "agéntico" (un abanico)
- Por dentro: no es "texto", son **bloques** · La **escalera de autonomía**
- ¿Qué es un **harnés**? · Los **tres harneses** de Claude
- Por qué nos centramos en **Claude Code** · Antes de empezar a gastar…
- La app de escritorio = "**terminal vestida**" · Cuatro conceptos clave
- Paseo por la app de escritorio · Shortcuts · **Ejercicio** 🏗️ + conclusiones

## Módulo 2 · Personaliza tu Claude

*CLAUDE.md, skills y el contexto.*

- Por qué personalizar · **CLAUDE.md a distintos niveles** · Proyectos
- Escribiendo tu CLAUDE.md · Por qué crear **skills** y qué pinta tienen
- **El contexto**: qué es y por qué importa · Skills vs. contexto
- "Mi Claude no hace caso a mis skills" · **Ejercicios** (Desktop)

## Módulo 3 · Conectando a Claude

*MCPs, plugins, subagentes y casos reales.*

- ¿Cómo conectamos Claude al mundo? · **MCPs**: el "enchufe" estándar
- MCPs nativos / oficiales de terceros / no oficiales · Marketplaces · **¿Qué es un plugin?**
- **Ejercicio**: conecta tus MCPs
- Casos: **Google Ads**, anuncios en **Meta**, generar imágenes, **Zapier** (agregador)
- **Subagentes** · Chrome extension (navegador) · Rutinas y tareas programadas
- **Web scraping** (LinkedIn) · **Computer use** · Skills de terceros · Notion · Ejemplo: este workshop

## Módulo 4 · Trabajo remoto y automático

- **Dispatch**: "despachando" trabajo (+ **ejercicio** y cómo funciona)
- **Tareas programadas**

## Módulo 5 · Tus primeras herramientas

- **Artifacts**: una mini-herramienta descargable · Crear tus primeros artefactos
- **Cowork Artifacts** · **Ejercicio**: dashboard conectado

## Módulo 6 · La memoria de Claude

- Los 3 sistemas: 🟧 **Instrucciones/CLAUDE.md** · 🟦 **Búsqueda entre chats** · 🟪 **Sistema de memoria**
- El **mapa de la memoria** · Tropiezos típicos · "Esto cambia rápido" · Bugs actuales
- Integrando proyectos · **Conectar vía API** (1 y 2) · Skills de terceros como puente

## Módulo 7 · Nos pasamos a la terminal

*El módulo más denso — instalación + réplica de todo en Claude Code.*

- **Instalaciones y cuentas**: Cursor · Terminal · Claude Code · Node.js/npm · Git · GitHub
- **La terminal**: qué es y por qué · **mini-diccionario** (rutas, comandos, parámetros, shortcuts) · ejercicios de navegación
- Interfaz de Claude en terminal · pegar imágenes · comandos útiles
- **Cowork ↔ terminal**: todo tiene equivalente (los 4 primitivos, memoria/contexto, remoto, modelo/ajustes)
- Config usuario vs. proyecto · Uno a uno: **CLAUDE.md** (+ árbol, ejercicio anidado)
- **Skills** (`skills.sh`) · **Subagentes** (front matter, ejercicios) · **MCPs** (shadcn) · **Plugins**
- Routines · Remote Control (≈Dispatch) · **Modo Plan** · **Permisos** · **Contexto** · **`/rewind`**

## Módulo 8 · Fundamentos del desarrollo de apps

- ¿Por qué crear una app? · Estructura de una app web · **Frontend/backend**
- **Next.js** (inicializar, básicos) · ¿Qué es una **librería**? · **Componentes de React** · **shadcn** y presets
- Formularios · **AI SDK de Vercel** · Emails (**Resend**) · Archivos (**Vercel Blob**) · **BD y almacenamiento** en Vercel
- **npm vs pnpm vs bun** · El CLAUDE.md del proyecto · **Ejercicio**: inicializa tu CLAUDE.md

## Módulo 9 · Creando una app juntos

*Teoría → build en vivo → cierre.*

- **Fundamentos recap**: arquitectura cliente/servidor · librerías y stack · **APIs y servicios externos** · **bases de datos** · **Git & GitHub** · **Deploy (Vercel)** · **variables de entorno** · el **workflow de desarrollo** (4 fases) · qué hacer ante un error
- 🛠️ **Desarrollando paso a paso** (build guiado): setup → Next.js → shadcn/ui + `/theme` → Run → snapshot a GitHub → deploy en **Vercel + Neon** → env vars → **Prisma** + BD → Prisma Studio → **`spec.md`** → CLAUDE.md → implementar el spec → publicada → iterar → **añadir un MCP al CRM**
- 💬 **Otros temas**: qué apps son "fáciles" · leer y pensar · qué perdemos vs. la terminal · consejos · frameworks de **diseño** y **SDD (Spec-Driven Development)**
- 🎉 *Y hasta aquí 8h de Claude!*
- 🗄️ *Slides archivadas* (fuera de flujo): Autenticación

---

## Notas

- Es un **solo deck** (no hay varios cursos): un `index.mdoc` con los 9 módulos como divisores `section=`.
- La **frontera pública** actual (`publicThrough: 160`) llega hasta **Módulo 8 · "Ejercicio: Inicializa tu CLAUDE.md"** — el final del Módulo 8 y todo el Módulo 9 aún no están en el review deck.
