// Single source of truth for "Dónde poner el contexto" — the six places you can
// put context / instructions in Claude Code, modelled once and rendered three
// different ways (page.v1 = matriz, page.v2 = ejes, page.v3 = fichas). The goal
// is to SEE the similarities and differences across the same set of vectors.

// ── Grouping (also a teaching device: color = "what kind of place it is") ──────
export type GroupId = 'momento' | 'fondo' | 'paquete';

export const GROUPS: Record<
  GroupId,
  { label: string; sub: string; color: string; soft: string }
> = {
  momento: {
    label: 'En tu conversación',
    sub: 'Entra al momento, en el hilo principal',
    color: 'var(--c-core)', // terracotta
    soft: 'var(--c-core-soft)',
  },
  fondo: {
    label: 'Siempre de fondo',
    sub: 'Reglas que se cargan solas al arrancar',
    color: 'var(--c-surface)', // pine
    soft: 'var(--c-surface-soft)',
  },
  paquete: {
    label: 'Empaquetado y reutilizable',
    sub: 'Capacidades que guardas, reutilizas y compartes',
    color: 'var(--c-capability)', // ochre
    soft: 'var(--c-capability-soft)',
  },
};

// ── The vectors (dimensions of comparison) ───────────────────────────────────
export type Band = 'forma' | 'fuerza';
export type VectorKind = 'scale' | 'tag';

export type Vector = {
  id: string;
  label: string;
  band: Band;
  question: string; // the question this vector answers
  kind: VectorKind;
  poles?: [string, string]; // for scale: left (0) → right (1)
};

export const BANDS: Record<Band, { label: string; sub: string }> = {
  forma: { label: 'Forma', sub: 'Cómo es y cómo entra' },
  fuerza: { label: 'Fuerza y coste', sub: 'Cuánto pesa, cuánto vincula' },
};

export const VECTORS: Vector[] = [
  { id: 'carga', label: 'Presencia', band: 'forma', kind: 'scale', poles: ['Siempre', 'Bajo demanda'], question: '¿Está siempre, o solo cuando hace falta?' },
  { id: 'progressive', label: 'Progressive disclosure', band: 'forma', kind: 'scale', poles: ['No aplica', 'De serie'], question: '¿Enseña lo justo y carga el detalle solo si hace falta?' },
  { id: 'aislamiento', label: 'Aislamiento', band: 'forma', kind: 'scale', poles: ['Ventana compartida', 'Ventana propia'], question: '¿Corre en tu conversación o aparte?' },
  { id: 'activacion', label: 'Activación', band: 'forma', kind: 'tag', question: '¿Quién decide que se use?' },
  { id: 'alcance', label: 'Alcance y vida', band: 'forma', kind: 'tag', question: '¿Cuánto dura y para quién?' },
  { id: 'payload', label: 'Carga útil', band: 'forma', kind: 'scale', poles: ['Palabras', 'Paquete'], question: '¿Solo texto, o un paquete con código?' },
  { id: 'fuerza', label: 'Fuerza', band: 'fuerza', kind: 'scale', poles: ['Condicional', 'Vinculante'], question: '¿De verdad se cumple?' },
  { id: 'coste', label: 'Coste de contexto', band: 'fuerza', kind: 'scale', poles: ['Impuesto fijo', 'Descargado'], question: '¿Cuánto ocupa en cada turno?' },
  { id: 'friccion', label: 'Montaje', band: 'fuerza', kind: 'scale', poles: ['Cero', 'Medio'], question: '¿Cuánto cuesta crearlo?' },
  { id: 'capacidad', label: 'Capacidad', band: 'fuerza', kind: 'tag', question: '¿Solo habla, o concede poderes?' },
  { id: 'compartir', label: 'Compartir', band: 'fuerza', kind: 'scale', poles: ['Difícil', 'Fácil'], question: '¿Fácil de empaquetar y pasar a otros?' },
];

export const vectorsByBand = (band: Band) => VECTORS.filter((v) => v.band === band);

// ── The mechanisms (the six places) ───────────────────────────────────────────
export type Tone = 'good' | 'bad' | 'warn';
export type Cell = { n?: number; t: string; tone?: Tone }; // n only for scale vectors (0..1)

export type Mechanism = {
  id: string;
  name: string;
  group: GroupId;
  kicker: string; // qué es, en una línea
  useWhen: string; // úsalo cuando…
  failure: string; // cómo falla
  v: Record<string, Cell>;
};

export const MECHS: Mechanism[] = [
  {
    id: 'prompt',
    name: 'Prompt',
    group: 'momento',
    kicker: 'Lo que escribes en el momento.',
    useWhen: 'Es específico de esta tarea, ahora.',
    failure: 'Se olvida: ni se reutiliza ni sobrevive a la siguiente sesión.',
    v: {
      carga: { n: 1, t: 'Bajo demanda' },
      progressive: { t: 'No aplica' },
      aislamiento: { n: 0, t: 'Compartida' },
      activacion: { t: 'Tú, a mano' },
      alcance: { t: 'Este turno' },
      payload: { n: 0, t: 'Palabras' },
      fuerza: { n: 1, t: 'Máxima', tone: 'good' },
      coste: { n: 0.85, t: 'Mínimo (1 turno)', tone: 'good' },
      friccion: { n: 0, t: 'Cero', tone: 'good' },
      capacidad: { t: 'Solo instruye' },
      compartir: { n: 0.05, t: 'Baja', tone: 'bad' },
    },
  },
  {
    id: 'comando',
    name: 'Slash command',
    group: 'momento',
    kicker: 'Un prompt guardado que lanzas por su nombre (/algo).',
    useWhen: 'Una rutina fija que disparas tú, a mano.',
    failure: 'Tienes que acordarte de invocarlo; no salta solo.',
    v: {
      carga: { n: 1, t: 'Bajo demanda' },
      progressive: { t: 'No aplica' },
      aislamiento: { n: 0, t: 'Compartida' },
      activacion: { t: 'Tú, por nombre' },
      alcance: { t: 'Reutilizable' },
      payload: { n: 0.2, t: 'Palabras (+bash/refs)' },
      fuerza: { n: 1, t: 'Alta', tone: 'good' },
      coste: { n: 0.85, t: 'Pago por uso', tone: 'good' },
      friccion: { n: 0.35, t: 'Baja', tone: 'good' },
      capacidad: { t: 'Ejecuta código' },
      compartir: { n: 0.75, t: 'Bastante (es un archivo)' },
    },
  },
  {
    id: 'md-user',
    name: 'CLAUDE.md de usuario',
    group: 'fondo',
    kicker: 'Tus reglas personales, en todos tus proyectos (~/.claude).',
    useWhen: 'Es verdad en todas partes, solo para ti (idioma, estilo, tu rol).',
    failure: 'Se diluye en sesiones largas; es invisible para tu equipo.',
    v: {
      carga: { n: 0, t: 'Siempre' },
      progressive: { n: 0.4, t: 'Si lo haces bien (punteros)', tone: 'warn' },
      aislamiento: { n: 0, t: 'Compartida' },
      activacion: { t: 'Automática' },
      alcance: { t: 'Todos tus proyectos · solo tú' },
      payload: { n: 0, t: 'Palabras' },
      fuerza: { n: 0.5, t: 'Media · se diluye', tone: 'warn' },
      coste: { n: 0, t: 'Impuesto fijo', tone: 'bad' },
      friccion: { n: 0.3, t: 'Baja', tone: 'good' },
      capacidad: { t: 'Solo instruye' },
      compartir: { n: 0.1, t: 'Baja (es local)', tone: 'bad' },
    },
  },
  {
    id: 'md-proj',
    name: 'CLAUDE.md de proyecto',
    group: 'fondo',
    kicker: 'Reglas y contexto del proyecto, para todo el equipo (en el repo).',
    useWhen: 'Es verdad para este proyecto, para todos. (+ apunta a docs.)',
    failure: 'Si engorda, se ignora y cuesta tokens en cada turno.',
    v: {
      carga: { n: 0, t: 'Siempre' },
      progressive: { n: 0.4, t: 'Si lo haces bien (punteros)', tone: 'warn' },
      aislamiento: { n: 0, t: 'Compartida' },
      activacion: { t: 'Automática' },
      alcance: { t: 'Este proyecto · todo el equipo' },
      payload: { n: 0.1, t: 'Palabras (+punteros)' },
      fuerza: { n: 0.5, t: 'Media · se diluye', tone: 'warn' },
      coste: { n: 0, t: 'Impuesto fijo', tone: 'bad' },
      friccion: { n: 0.3, t: 'Baja', tone: 'good' },
      capacidad: { t: 'Solo instruye' },
      compartir: { n: 0.55, t: 'Media (viaja con el repo)' },
    },
  },
  {
    id: 'skill',
    name: 'Skill',
    group: 'paquete',
    kicker: 'Capacidad empaquetada (instrucciones + scripts) que Claude usa cuando encaja.',
    useWhen: 'Una rutina que Claude debe coger solo cuando toca; puede traer scripts.',
    failure: 'No salta si la descripción no encaja (o salta cuando no toca).',
    v: {
      carga: { n: 1, t: 'Bajo demanda (desc. siempre)' },
      progressive: { n: 1, t: 'Sí, de serie', tone: 'good' },
      aislamiento: { n: 0.2, t: 'Compartida *', tone: 'warn' },
      activacion: { t: 'Claude decide (o tú)' },
      alcance: { t: 'Reutilizable · distribuible' },
      payload: { n: 1, t: 'Paquete + scripts' },
      fuerza: { n: 0.25, t: 'Condicional al disparo', tone: 'warn' },
      coste: { n: 0.6, t: 'Pago por uso', tone: 'good' },
      friccion: { n: 0.8, t: 'Media', tone: 'warn' },
      capacidad: { t: 'Ejecuta código' },
      compartir: { n: 1, t: 'Alta (plugins/marketplace)', tone: 'good' },
    },
  },
  {
    id: 'subagente',
    name: 'Subagente',
    group: 'paquete',
    kicker: 'Un agente aparte, con su contexto, que devuelve solo un resumen.',
    useWhen: 'Trabajón independiente o en paralelo que no debe ensuciar el hilo.',
    failure: 'No ve tu conversación; el resumen pierde matices.',
    v: {
      carga: { n: 1, t: 'Bajo demanda + se descarta' },
      progressive: { n: 1, t: 'Sí (solo el resumen)', tone: 'good' },
      aislamiento: { n: 1, t: 'Ventana propia', tone: 'good' },
      activacion: { t: 'Claude delega (o tú)' },
      alcance: { t: 'Reutilizable · distribuible' },
      payload: { n: 1, t: 'Paquete + herramientas + modelo' },
      fuerza: { n: 0.2, t: 'Condicional + resumen', tone: 'warn' },
      coste: { n: 1, t: 'Descargado a otra ventana', tone: 'good' },
      friccion: { n: 0.8, t: 'Media', tone: 'warn' },
      capacidad: { t: 'Herramientas + modelo propios' },
      compartir: { n: 0.9, t: 'Alta', tone: 'good' },
    },
  },
];

export const byId = (id: string) => MECHS.find((m) => m.id === id);
export const mechColor = (m: Mechanism) => GROUPS[m.group].color;
export const mechSoft = (m: Mechanism) => GROUPS[m.group].soft;

// ── Precedence: who wins when two layers contradict each other ────────────────
export const PRECEDENCE: string[] = [
  'Prompt',
  'Skill / comando (en uso)',
  'CLAUDE.md anidado',
  'CLAUDE.md de proyecto',
  'CLAUDE.md de usuario',
];

// ── The decision spine: "what goes where" ─────────────────────────────────────
export const DECISION: { when: string; pick: string }[] = [
  { when: 'Verdad en todo lo que hago, solo para mí', pick: 'CLAUDE.md de usuario' },
  { when: 'Verdad en este proyecto, para todo el equipo', pick: 'CLAUDE.md de proyecto' },
  { when: 'Solo esta tarea, ahora mismo', pick: 'Prompt' },
  { when: 'Algo que Claude debe coger solo (o que trae scripts)', pick: 'Skill' },
  { when: 'Una skill no invocable por el modelo', pick: 'Slash command' },
  { when: 'Trabajo delegable fuera de contexto', pick: 'Subagente' },
];

// The three ideas the map has to land — shown in the header.
export const TAKEAWAYS: string[] = [
  'Cargado no es lo mismo que obedecido',
  'Aislar limpia el hilo, pero pierde contexto compartido',
  'Empaqueta lo que repites; escribe lo de una sola vez',
];
