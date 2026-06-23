// Single source of truth for «Comandos básicos» — the workshop cheat sheet.
// Right now the DEFINITIVE block is the terminal; the Claude Code section is
// seeded with a few essentials and meant to grow. Keep entries short: a quick
// reference to recognize what you see and start using the basics.

// ── How to read this sheet — shown in the header ──────────────────────────────
export const USAGE: string[] = [
  'Consúltala cuando dudes',
  'Úsalos tú o pídeselos a Claude',
  'Pruébalos sin miedo',
];

export type PathSymbol = { sym: string; meaning: string };
export type Command = { cmd: string; what: string; from?: string };
export type Shortcut = { key: string; what: string };

// ════════════════════════════════════════════════════════════════════════════
//  TERMINAL — el bloque definitivo
// ════════════════════════════════════════════════════════════════════════════

export const TERMINAL_PUNCHLINE =
  'La terminal es hablarle al ordenador escribiendo. Con estos símbolos y comandos básicos te mueves y entiendes qué pasa — y lo que no, lo hace Claude.';

// Symbols you read inside a path — the part people trip on most.
export const PATH_SYMBOLS: PathSymbol[] = [
  { sym: '.', meaning: 'la carpeta **actual** (donde estás ahora mismo)' },
  {
    sym: '..',
    meaning: 'la carpeta **padre**, un nivel hacia arriba — por eso `cd ..` es «subir»',
  },
  {
    sym: '~',
    meaning:
      'tu **carpeta de usuario** (home), p. ej. `/Users/tu-nombre`. **No** es la raíz.',
  },
  {
    sym: '/',
    meaning:
      'la **raíz** del sistema; y también **separa** carpetas en una ruta: `carpeta/subcarpeta`',
  },
  {
    sym: '.algo',
    meaning: 'archivo o carpeta **oculta** (empieza por punto): `.claude`, `.git`, `.env`',
  },
  { sym: '*', meaning: '**comodín**, «cualquier cosa»: `*.png` = todos los archivos `.png`' },
];

// Moving around and looking — the daily verbs.
export const TERMINAL_MOVE: Command[] = [
  {
    cmd: 'cd <ruta>',
    what: 'cambiar de carpeta — `cd ..` sube, `cd ~` va a tu home, `cd nombre` entra',
    from: 'change directory',
  },
  {
    cmd: 'pwd',
    what: '«¿dónde estoy?» — imprime la ruta de la carpeta actual',
    from: 'print working directory',
  },
  {
    cmd: 'ls',
    what: 'lista lo que hay en la carpeta (`ls -a` muestra también los ocultos)',
    from: 'list',
  },
  {
    cmd: 'clear',
    what: 'limpia la pantalla (no borra nada, solo despeja)',
    from: 'to clear',
  },
  {
    cmd: 'cursor .',
    what: 'abre la carpeta actual en Cursor (`cursor <ruta>` abre un archivo)',
  },
];

// Touching files and folders — the ones that actually change things.
export const TERMINAL_FILES: Command[] = [
  { cmd: 'mkdir <nombre>', what: 'crea una carpeta nueva', from: 'make directory' },
  {
    cmd: 'cat <archivo>',
    what: 'vuelca el contenido de un archivo en la pantalla',
    from: 'concatenate',
  },
  { cmd: 'cp · mv', what: 'copiar · mover o renombrar', from: 'copy · move' },
  { cmd: 'rm', what: 'borrar — ⚠️ no hay papelera, no se recupera', from: 'remove' },
];

// Keyboard tricks that save the most time for a beginner.
export const TERMINAL_SHORTCUTS: Shortcut[] = [
  { key: 'Tab', what: 'autocompleta nombres de archivo/carpeta (escribe medio y pulsa Tab)' },
  { key: '↑ / ↓', what: 'recorre los comandos que ya escribiste (no reescribas)' },
  { key: 'Ctrl + C', what: 'cancela lo que esté corriendo o limpia la línea a medias' },
];

// ════════════════════════════════════════════════════════════════════════════
//  CLAUDE CODE — primeros pasos (semilla, crecerá)
// ════════════════════════════════════════════════════════════════════════════

export const CLAUDE_PUNCHLINE =
  'Dentro de la terminal, `claude` abre un chat: le pides las cosas en lenguaje normal y él escribe y ejecuta los comandos. Estos atajos te hacen la vida más fácil.';

// Starting and stopping the agent.
export const CLAUDE_RUN: Command[] = [
  { cmd: 'claude', what: 'arranca el agente en la carpeta actual' },
  { cmd: 'claude --continue', what: 'sigue la última conversación de esta carpeta' },
  { cmd: 'claude --resume', what: 'retoma una conversación anterior (eliges cuál de una lista)' },
  {
    cmd: 'claude --dangerously-skip-permissions',
    what: 'no te pregunta permisos para nada — ⚠️ rápido pero arriesgado, úsalo con cabeza',
  },
  { cmd: 'Ctrl + C  (×2)', what: 'sal del agente — o escribe `/exit`' },
];

// The slash commands worth knowing first.
export const CLAUDE_SLASH: Command[] = [
  { cmd: '/help', what: 'lista todo lo que puedes hacer' },
  { cmd: '/clear', what: 'empieza de cero: vacía el contexto de la conversación' },
  { cmd: '/init', what: 'genera un primer CLAUDE.md leyendo el proyecto' },
  { cmd: '/model', what: 'cambia de modelo (p. ej. Opus ↔ Sonnet)' },
  { cmd: '/agents', what: 'crea y gestiona subagentes' },
  { cmd: '/mcp', what: 'conecta y revisa tus MCPs (herramientas externas)' },
  { cmd: '/rename', what: 'cambia el nombre de la sesión actual' },
  { cmd: '/rewind', what: 'vuelve la conversación y/o el código a un punto anterior' },
  { cmd: '/skills', what: 'lista tus skills (capacidades a demanda)' },
  { cmd: '/btw', what: '(by the way) una pregunta rápida al margen, sin ensuciar la conversación' },
  { cmd: '/compact', what: 'resume la conversación para liberar contexto' },
];

// Single-key prefixes / mode toggles inside the prompt.
export const CLAUDE_KEYS: Shortcut[] = [
  { key: '@', what: 'menciona un archivo o carpeta para dárselo de contexto' },
  { key: '/', what: 'abre los comandos (skills, ajustes…)' },
  { key: '!', what: 'ejecuta un comando de terminal tú mismo, sin salir' },
  { key: 'Shift + Tab', what: 'cambia de modo: normal → auto-aceptar → plan' },
  { key: 'Esc', what: 'interrumpe a Claude mientras trabaja' },
];

// ════════════════════════════════════════════════════════════════════════════
//  GIT & GITHUB — los checkpoints de tu proyecto
// ════════════════════════════════════════════════════════════════════════════

export const GIT_PUNCHLINE =
  'Git va guardando «fotos» de tu proyecto (checkpoints) para que nunca pierdas nada y puedas volver atrás. Estos son los del día a día: úsalos tú o pídeselos a Claude («haz un commit», «vuelve a antes»).';

// Saving your work locally — the commit loop.
export const GIT_SAVE: Command[] = [
  { cmd: 'git status', what: 'qué has cambiado y qué falta por guardar' },
  { cmd: 'git add <archivo>', what: 'marca cambios para el próximo commit (`git add .` = todos)' },
  { cmd: 'git commit -m "mensaje"', what: 'guarda un checkpoint con una descripción' },
  { cmd: 'git log', what: 'el historial de checkpoints (commits)' },
  { cmd: 'git diff', what: 'qué ha cambiado exactamente, línea a línea' },
];

// Branches + syncing with GitHub (the cloud copy).
export const GIT_SYNC: Command[] = [
  { cmd: 'git clone <url>', what: 'copia un repo de GitHub a tu máquina' },
  { cmd: 'git pull', what: 'baja a tu copia los cambios que haya en GitHub' },
  { cmd: 'git push', what: 'sube tus commits a GitHub (backup + compartir)' },
  { cmd: 'git branch', what: 'lista tus ramas (líneas paralelas de trabajo)' },
  { cmd: 'git switch <rama>', what: 'cámbiate a otra rama (`git switch -c nombre` la crea)' },
];

// Recognition-only / occasional.
export const GIT_ALSO: Command[] = [
  { cmd: 'git init', what: 'empieza a versionar una carpeta con Git' },
  { cmd: 'git revert', what: 'deshace un commit creando otro que lo anula' },
  { cmd: 'gh auth login', what: 'GitHub CLI: te autentica con tu cuenta de GitHub' },
];
