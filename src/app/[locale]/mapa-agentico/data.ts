// Single source of truth for the "Mapa de trabajo agéntico" — every concept seen
// in the workshop, modelled once and rendered three different ways (see the three
// Map*.tsx variants). The vocabulary mirrors the deck on purpose ("las 4 piezas",
// "los tres harneses", "la escalera de autonomía") so students recognise it.

export type Family = 'lens' | 'surface' | 'core' | 'capability';

export type Piece = {
  id: string;
  name: string; // canonical name, exactly as taught
  emoji: string;
  family: Family;
  tagline: string; // one-line "qué es"
  need?: string; // "Quiero…" — the goal it serves (drives the "por necesidad" map)
  combines?: string[]; // ids of pieces it is built from / pairs with (drives constellation + layers)
  altHint?: string; // subtle "could also be done with…" note for the needs index
  rung?: number; // step on the autonomy ladder (0–5), where relevant
};

export const FAMILIES: Record<
  Family,
  { label: string; sub: string; color: string; soft: string }
> = {
  lens: {
    label: 'Cómo pensarlo',
    sub: 'Las gafas con las que mirar todo lo demás',
    color: 'var(--c-lens)',
    soft: 'var(--c-lens-soft)',
  },
  surface: {
    label: 'Dónde trabajas',
    sub: 'Los tres harneses de Claude',
    color: 'var(--c-surface)',
    soft: 'var(--c-surface-soft)',
  },
  core: {
    label: 'Las 4 piezas clave',
    sub: 'Son estas 4 cosas casi todo el rato',
    color: 'var(--c-core)',
    soft: 'var(--c-core-soft)',
  },
  capability: {
    label: 'Otras piezas',
    sub: 'El resto del kit, casi todo montado sobre las 4',
    color: 'var(--c-capability)',
    soft: 'var(--c-capability-soft)',
  },
};

export const FAMILY_ORDER: Family[] = ['lens', 'surface', 'core', 'capability'];

// ── Las gafas (cómo pensar el trabajo agéntico) ──────────────────────────────
const LENSES: Piece[] = [
  {
    id: 'abanico',
    name: 'De autocompletado a agéntico',
    emoji: '📈',
    family: 'lens',
    tagline: 'No es un interruptor: es un abanico que va de "sugiere" a "lo hace solo".',
  },
  {
    id: 'escalera',
    name: 'La escalera de autonomía',
    emoji: '🪜',
    family: 'lens',
    tagline: '6 peldaños, de autocompletar (0) a trabajar sin supervisión (5). El salto está en 3→4: de generar a actuar.',
  },
  {
    id: 'harnes',
    name: 'El harnés',
    emoji: '⚙️',
    family: 'lens',
    tagline: 'El bucle que envuelve al modelo: le pasa herramientas, gestiona el contexto y ejecuta. Claude Code ES un harnés; el modelo es el motor.',
  },
  {
    id: 'bloques',
    name: 'No es "texto", son bloques',
    emoji: '🧱',
    family: 'lens',
    tagline: 'Por dentro Claude trabaja con bloques (texto, llamadas a herramientas, resultados), no con un chorro de palabras.',
  },
  {
    id: 'contexto',
    name: 'El contexto',
    emoji: '🪟',
    family: 'lens',
    tagline: 'Lo que Claude "tiene delante" en cada momento. Es limitado: por eso importa qué metes y qué dejas fuera.',
  },
];

// ── Los tres harneses (dónde trabajas) ───────────────────────────────────────
const SURFACES: Piece[] = [
  {
    id: 'chat',
    name: 'Chat',
    emoji: '💬',
    family: 'surface',
    tagline: 'Conversa, no actúa. Sin "manos" en tu ordenador. Bueno para pensar (incluso por voz).',
    need: 'Solo pensar o conversar, sin tocar mis archivos',
    rung: 2,
  },
  {
    id: 'cowork',
    name: 'Claude Cowork',
    emoji: '🖥️',
    family: 'surface',
    tagline: 'Claude Code "disfrazado" de asistente, en la app de escritorio. Hace cosas sin pelearte con la terminal.',
    need: 'Que HAGA cosas sin tener que tocar la terminal',
    rung: 4,
  },
  {
    id: 'code',
    name: 'Claude Code',
    emoji: '💻',
    family: 'surface',
    tagline: 'Vive en la terminal. Piensa y HACE: accede a tu ordenador. Es donde antes llegan las cosas. Nuestro foco.',
    need: 'Todo el poder, en bruto, en la terminal',
    rung: 4,
  },
];

// ── Las 4 piezas (core) ──────────────────────────────────────────────────────
const CORE: Piece[] = [
  {
    id: 'claudemd',
    name: 'CLAUDE.md',
    emoji: '🧠',
    family: 'core',
    tagline: 'La memoria del proyecto: contexto, convenciones y reglas que Claude lee al arrancar.',
    need: 'Que recuerde mis reglas y mi contexto sin repetírselo cada vez',
    altHint: 'si es algo más puntual, también vale una skill',
  },
  {
    id: 'skills',
    name: 'Skills',
    emoji: '🔧',
    family: 'core',
    tagline: 'Instrucciones empaquetadas para una tarea concreta ("así se hace esto aquí"). Se cargan cuando hacen falta; las lanzas con /nombre.',
    need: 'Que haga una tarea concreta siempre igual de bien',
    combines: ['contexto'],
  },
  {
    id: 'mcps',
    name: 'MCPs',
    emoji: '🔌',
    family: 'core',
    tagline: 'El "enchufe" estándar a apps y datos externos (Notion, GitHub, tu BBDD…). Amplía lo que Claude puede leer y hacer.',
    need: 'Que toque mis apps y mis datos (Notion, Gmail, GitHub…)',
  },
  {
    id: 'subagentes',
    name: 'Subagentes',
    emoji: '👥',
    family: 'core',
    tagline: 'Agentes secundarios con su propio contexto, para tareas acotadas. Trabajan en paralelo y devuelven solo la conclusión.',
    need: 'Delegar un trabajón sin ensuciar mi conversación',
  },
];

// ── Otras piezas (capability) ────────────────────────────────────────────────
// Sólo piezas "de verdad" del kit. Lo que en realidad son usos o resultados
// (scraping, imágenes, API, crear-app) vive en ASIDE, más abajo.
const CAPABILITIES: Piece[] = [
  {
    id: 'plugins',
    name: 'Plugins',
    emoji: '🧩',
    family: 'capability',
    tagline: 'Paquetes que traen varias piezas juntas (skills + subagentes + MCPs), listos para instalar de un marketplace.',
    need: 'Instalar de golpe lo que ya montó otra persona',
    combines: ['skills', 'subagentes', 'mcps'],
  },
  {
    id: 'memoria',
    name: 'Memoria de Claude',
    emoji: '🗂️',
    family: 'capability',
    tagline: 'El sistema que recuerda entre conversaciones (búsqueda entre chats, memory files). Ojo: no es lo mismo que CLAUDE.md.',
    need: 'Que se acuerde de cosas de una conversación a otra',
    combines: ['claudemd'],
  },
  {
    id: 'chrome',
    name: 'Extensión de Chrome',
    emoji: '🌐',
    family: 'capability',
    tagline: 'Claude trabaja dentro de tu navegador Chrome: lee la pestaña que tienes abierta, hace clics y rellena formularios por ti.',
    need: 'Que actúe dentro de mi navegador',
  },
  {
    id: 'computeruse',
    name: 'Computer use',
    emoji: '🖥️',
    family: 'capability',
    tagline: 'Claude controla toda la pantalla, no solo el navegador: puede usar cualquier app de tu ordenador como lo harías tú.',
    need: 'Que use cualquier app de mi pantalla',
  },
  {
    id: 'artifacts',
    name: 'Artifacts',
    emoji: '🛠️',
    family: 'capability',
    tagline: 'Mini herramientas / mini apps descargables que Claude crea para una tarea concreta (también en Cowork).',
    need: 'Una mini herramienta para una tarea puntual',
    combines: ['cowork'],
  },
  {
    id: 'tareas',
    name: 'Tareas programadas',
    emoji: '⏰',
    family: 'capability',
    tagline: 'Trabajo recurrente que se dispara solo (cada día/semana). El peldaño 5: autónomo, sin que tú estés delante.',
    need: 'Que trabaje solo, cada día o cada semana',
    combines: ['skills', 'code'],
    rung: 5,
  },
  {
    id: 'dispatch',
    name: 'Dispatch',
    emoji: '🚚',
    family: 'capability',
    tagline: 'Despachas un encargo y se enruta solo al proyecto adecuado, trabajando en remoto mientras tú sigues a lo tuyo.',
    need: 'Mandar un encargo a un proyecto y olvidarme',
    combines: ['subagentes', 'code'],
    rung: 5,
  },
];

export const PIECES: Piece[] = [...LENSES, ...SURFACES, ...CORE, ...CAPABILITIES];

// Cosas que también vimos pero que NO son piezas del kit: son cosas que HACES con
// las piezas, cómo accedes, de dónde las sacas, o el destino del curso. Útiles
// para reconocerlas y no confundirlas con una pieza.
export type Aside = {
  id: string;
  name: string;
  kind: 'Lo que haces' | 'Cómo accedes' | 'De dónde las sacas' | 'El destino';
  note: string;
  with: string[]; // pieces you'd use to get there
};

export const ASIDE: Aside[] = [
  {
    id: 'scraping',
    name: 'Sacar datos de webs (scraping)',
    kind: 'Lo que haces',
    note: 'Un resultado que consigues con la extensión de Chrome o un MCP. No es una pieza, es una tarea.',
    with: ['chrome', 'mcps'],
  },
  {
    id: 'imagenes',
    name: 'Generar imágenes',
    kind: 'Lo que haces',
    note: 'Otro resultado más, normalmente vía un MCP o una skill.',
    with: ['mcps', 'skills'],
  },
  {
    id: 'api',
    name: 'Conectar por API',
    kind: 'Cómo accedes',
    note: 'Una forma de enchufar Claude a tu propio software, no una pieza del kit.',
    with: ['mcps'],
  },
  {
    id: 'marketplaces',
    name: 'Marketplaces',
    kind: 'De dónde las sacas',
    note: 'El sitio donde encuentras piezas hechas por otros (plugins, skills, MCPs).',
    with: ['plugins'],
  },
  {
    id: 'app',
    name: 'Crear tu propia app',
    kind: 'El destino',
    note: 'A donde vamos: lo que construyes combinando las piezas, guiándote Claude Code.',
    with: ['code', 'claudemd', 'skills', 'subagentes'],
  },
];

export const byId = (id: string): Piece | undefined =>
  PIECES.find((p) => p.id === id);

export const piecesOf = (family: Family): Piece[] =>
  PIECES.filter((p) => p.family === family);

// The three ideas the map has to land — shown in the header, no decoration.
export const TAKEAWAYS = [
  { text: 'Protege el contexto, es limitado' },
  { text: 'Lo mismo se puede hacer de formas distintas' },
  { text: 'Crea TU espacio de trabajo' },
];
