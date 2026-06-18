// Single source of truth for "Entender el CLAUDE.md" — how the file works and the
// guidelines that apply to EVERY CLAUDE.md (what goes in, what stays out). A later
// section will add templates per project type; this file is meant to grow under it.

// ── The three ideas the page has to land — shown in the header ────────────────
export const TAKEAWAYS: string[] = [
  'Es un prompt que se carga solo, no un documento para humanos',
  'Cada línea cuesta atención: corto pesa más',
  'Es un archivo vivo: se afina cuando Claude falla',
];

// ── The mental model — the one-line punchline everything hangs from ───────────
export const PUNCHLINE =
  'Es un prompt que se inyecta al principio de la sesión. Es un "trade": pagamos en tokens por adelantado algo que creemos que necesitará, para ahorrar tiempo y errores.';

// ── How it works — the mechanics, each a small card ───────────────────────────
export type HowItem = { title: string; body: string };

export const HOW: HowItem[] = [
  {
    title: 'Se carga solo al arrancar',
    body: 'Claude lo lee al empezar cada sesión, sin que se lo pidas. Es contexto que está siempre presente, de fondo.',
  },
  {
    title: 'Es un prompt, no un documento para humanos',
    body: 'Compite por la atención del modelo en cada turno. No es documentación para humanos; son instrucciones para el agente.',
  },
  {
    title: 'Cuesta tokens en cada turno',
    body: 'Todo lo que metes se paga siempre, ocupe lo que ocupe. Por eso un archivo corto y afilado pesa más que uno largo.',
  },
  {
    title: 'Cuanto más metes, menos pesa cada cosa',
    body: 'Un CLAUDE.md inflado diluye las instrucciones que de verdad importan. Hay que ganarse el sitio línea a línea.',
  },
  {
    title: 'Vive en capas',
    body: 'Hay un CLAUDE.md tuyo (todos tus proyectos), uno del proyecto (todo el equipo) y otros anidados por carpeta. Se combinan.',
  },
  {
    title: 'Se afina como un prompt',
    body: 'Se itera, se enfatiza (IMPORTANT / YOU MUST) y se corrige cuando ves a Claude equivocarse. Es un archivo vivo.',
  },
];

// ── The hierarchy of locations (a teaching device: "where it lives = who it's for") ──
export type Place = { name: string; path: string; scope: string };

export const PLACES: Place[] = [
  {
    name: 'CLAUDE.md de usuario',
    path: '~/.claude/CLAUDE.md',
    scope: 'Todos tus proyectos · solo tú',
  },
  {
    name: 'CLAUDE.md de proyecto',
    path: 'raíz del repo (versionado)',
    scope: 'Este proyecto · todo el equipo',
  },
  {
    name: 'CLAUDE.md anidado',
    path: 'subcarpeta/CLAUDE.md',
    scope: 'Se carga al tocar esa zona del proyecto',
  },
];

// Precedence chain — most specific & most recent wins.
export const PRECEDENCE: string[] = [
  'Lo que escribes ahora',
  'CLAUDE.md anidado',
  'CLAUDE.md de proyecto',
  'CLAUDE.md de usuario',
];

// ── The handy shortcuts worth knowing ─────────────────────────────────────────
export type Shortcut = { key: string; what: string };

export const SHORTCUTS: Shortcut[] = [
  { key: '/init', what: 'Genera un primer CLAUDE.md leyendo el proyecto.' },
  {
    key: '@ruta',
    what: 'Importa ese archivo inline: su contenido se carga siempre, en cada turno.',
  },
];

// ── The balance behind the whole section — shown as a callout ─────────────────
export const CALLOUT =
  'La gran mayoría de estas cosas Claude puede deducirlas leyendo el proyecto. Por eso meter algo aquí es siempre un balance: lo que cuesta (contexto, en cada turno) frente a lo que ahorra (que Claude no tenga que redescubrirlo cada vez). Si lo encuentra solo y rápido, no compensa; si es caro de descubrir o fácil de confundir, sí.';

// ── Guidelines: what goes IN ──────────────────────────────────────────────────
export type Guideline = { title: string; detail: string };

export const DO: Guideline[] = [
  {
    title: 'Comandos frecuentes',
    detail: 'Cómo se arranca, se prueba, se revisa o se publica — para no redescubrirlo cada vez.',
  },
  {
    title: 'El mapa del territorio',
    detail: 'Archivos y carpetas clave: dónde vive cada cosa y qué hace.',
  },
  {
    title: 'Cómo se hacen las cosas aquí',
    detail: 'Convenciones, estilo y la forma de trabajar propia de este proyecto.',
  },
  {
    title: 'Cómo se valida',
    detail: 'Qué hay que ejecutar o comprobar antes de dar algo por terminado.',
  },
  {
    title: 'Gotchas y avisos',
    detail: 'Lo no-obvio: el paso que siempre se olvida, la trampa que solo se conoce por haber tropezado.',
  },
  {
    title: 'Punteros, no volcados',
    detail: 'Para lo grande, nombra el archivo por su ruta (sin @) y deja que Claude lo lea solo cuando haga falta. Ojo: con @ruta el contenido se mete inline y se carga siempre, así que no ahorra contexto.',
  },
];

// ── Guidelines: what stays OUT ────────────────────────────────────────────────
export const DONT: Guideline[] = [
  {
    title: 'Secretos y credenciales',
    detail: 'Se inyecta siempre y suele acabar versionado. Nunca claves, tokens ni contraseñas.',
  },
  {
    title: 'Lo que cambia cada semana',
    detail: 'Estado volátil que envejece rápido: un CLAUDE.md desactualizado miente, y eso es peor que no tenerlo.',
  },
  {
    title: 'Prosa larga y relleno',
    detail: 'Historia del proyecto, marketing, párrafos aspiracionales: todo lo que no cambia el comportamiento del agente.',
  },
  {
    title: 'Lo que Claude ya puede inferir',
    detail: 'Si el dato está en el propio proyecto y se descubre leyendo, no hace falta repetirlo aquí.',
  },
  {
    title: 'Documentación para humanos',
    detail: 'El típico documento que explica el proyecto a una persona va aparte: otra audiencia, otro objetivo. No lo mezcles con las instrucciones para Claude.',
  },
];

// ── How to write it — cross-cutting principles (apply to every CLAUDE.md) ─────
export type Principle = { title: string; body: string };

export const PRINCIPLES: Principle[] = [
  {
    title: 'Organízalo en secciones',
    body: 'Agrupa las instrucciones bajo encabezados (comandos, estilo, gotchas…). Con estructura se escanea y se mantiene mejor — para ti y para el modelo.',
  },
  {
    title: 'Imperativo, no descriptivo',
    body: '«Usa X», «Antes de terminar, ejecuta Y» — no «solemos preferir X». Las reglas accionables se obedecen; la prosa se ignora.',
  },
  {
    title: 'Énfasis donde de verdad importa',
    body: 'Para lo no-negociable, márcalo (IMPORTANT, NEVER, YOU MUST): Anthropic confirma que sube la obediencia. Pero es de doble filo —y escaso—: si todo grita, no grita nada, y un imperativo fuerte se cumple a rajatabla (un agente puede hacer DE TODO por obedecerlo, incluso pasarse de frenada). Resérvalo para las dos o tres reglas que de verdad quieras blindar.',
  },
  {
    title: 'Corto gana',
    body: 'Cada línea compite por atención. Si dudas si una frase aporta, fuera.',
  },
  {
    title: 'Itera desde el fallo',
    body: 'Cuando Claude se equivoca, esa es la señal para añadir una línea que lo prevenga — no para reescribirlo entero.',
  },
  {
    title: 'Separa lo estable de lo volátil',
    body: 'Lo estable y compartido va al CLAUDE.md del proyecto; lo que cambia a diario o es personal, a otro sitio.',
  },
];
