// Single source of truth for «Crear buenas skills» - qué es una skill de Claude,
// cómo funciona la carga progresiva, y cómo escribir una que se active y se porte
// bien. Pautas que valen para CUALQUIER skill; lo que cambia de una a otra son los
// ejemplos concretos. Pensado para crecer: plantillas por tipo de skill irán debajo.
//
// Fuentes: documentación oficial de Anthropic (Agent Skills: overview y
// best-practices, blog de ingeniería) + práctica de usuarios intensivos de Claude
// (Simon Willison, Jesse Vincent / obra). Ver research en el repo si hace falta.

// ── Las tres ideas que la página tiene que dejar claras - en la cabecera ──────
export const TAKEAWAYS: string[] = [
  'Una skill es una carpeta que Claude carga sola, cuando el trabajo la pide',
  'La descripción es lo único siempre cargado: decide sola si la skill se activa',
  'Carga progresiva: el cuerpo corto, el detalle en archivos aparte',
];

// ── El modelo mental - la frase de la que cuelga todo ─────────────────────────
export const PUNCHLINE =
  'Una skill es una carpeta con instrucciones -y, si hace falta, scripts y recursos- que Claude descubre y carga él solo, justo cuando la tarea lo pide.';

// ── Cómo funciona - la mecánica, en tarjetas ──────────────────────────────────
export type HowItem = { title: string; body: string };

export const HOW: HowItem[] = [
  {
    title: 'Es una carpeta, no un prompt suelto',
    body: 'Un archivo `SKILL.md` con las instrucciones y, si hace falta, scripts, ejemplos y plantillas - todo junto en una carpeta, en texto normal.',
  },
  {
    title: 'Claude la elige solo',
    body: 'No la invocas tú: Claude decide cargarla cuando el contexto encaja con su descripción. Por eso la descripción es lo que más pesa.',
  },
  {
    title: 'Carga progresiva, en tres niveles',
    body: 'Solo el nombre y la descripción están siempre presentes. El cuerpo se lee al activarse; los archivos, solo si hacen falta.',
  },
  {
    title: 'Solo pagas lo que se usa',
    body: 'Puedes instalar muchas sin coste: hasta que una se activa, apenas ocupa unas líneas. Y un script se ejecuta sin que su código entre en el contexto - solo cuesta su salida.',
  },
  {
    title: 'Se combinan entre sí',
    body: 'Claude encadena varias skills en una misma tarea. Mejor muchas pequeñas y enfocadas que una enorme que lo intente todo.',
  },
  {
    title: 'Son portables',
    body: 'El mismo formato vale en Claude Code, en la API y en las apps de Claude. Es una carpeta de texto: cualquier agente que lea archivos puede usarla.',
  },
];

// ── Los tres niveles de la carga progresiva - el mecanismo central ────────────
export type Level = {
  n: string;
  name: string;
  when: string;
  size: string;
  nick: string;
};

export const LEVELS: Level[] = [
  {
    n: '1',
    name: 'Nombre + descripción',
    when: 'Siempre cargado',
    size: '~unas líneas por skill',
    nick: 'el escaparate - lo único que Claude ve siempre',
  },
  {
    n: '2',
    name: 'El cuerpo de SKILL.md',
    when: 'Al activarse la skill',
    size: 'menos de ~500 líneas',
    nick: 'el manual - el procedimiento, a modo de índice',
  },
  {
    n: '3',
    name: 'Archivos: scripts/, references/, assets/',
    when: 'Bajo demanda',
    size: 'casi ilimitado · 0 tokens hasta abrirse',
    nick: 'el almacén - se lee o se ejecuta solo si hace falta',
  },
];

export const LEVELS_NOTE =
  'La clave: el código de un script no entra en el contexto - solo su resultado. Por eso un script pre-escrito gana a pedirle a Claude que genere el mismo código cada vez.';

// ════════════════════════════════════════════════════════════════════════════
//  02 · La descripción lo es todo
// ════════════════════════════════════════════════════════════════════════════

export const DESC_CALLOUT =
  'Es la única parte de la skill que está siempre cargada. Así que la descripción -ella sola- decide si la skill se activa, antes de que Claude lea una sola línea del cuerpo. Es lo de mayor impacto que vas a escribir.';

export type Rule = { title: string; detail: string };

export const DESC_RULES: Rule[] = [
  {
    title: 'En tercera persona',
    detail: '«Procesa archivos de Excel…», nunca «Te ayudo a…» ni «Puedes usar esto para…».',
  },
  {
    title: 'Di QUÉ hace y CUÁNDO usarla',
    detail: 'Las dos cosas. El «cuándo» dispara la activación; el «qué» la distingue de otras skills.',
  },
  {
    title: 'Mete las palabras que la disparan',
    detail: 'Sinónimos, tipos de archivo, términos que diría el usuario («.pdf», «factura», «changelog»). Claude empareja por ahí.',
  },
  {
    title: 'Sé insistente',
    detail: 'El fallo por defecto de Claude es NO activar skills útiles. Inclínate a incluir: «úsala siempre que se mencione X, aunque no lo pida explícitamente».',
  },
  {
    title: 'Añade un «no usar para…»',
    detail: 'Cuando haya skills hermanas que se pisen (PDF vs Word vs Excel), acota: «No la uses para hojas de cálculo ni PDFs».',
  },
];

export type Example = { label: string; text: string; note: string };

export const DESC_BAD: Example = {
  label: 'Floja',
  text: 'Ayuda con documentos.',
  note: 'No dice ni qué hace ni cuándo usarla. No tiene con qué emparejar: no se activará nunca.',
};

export const DESC_GOOD: Example = {
  label: 'Buena',
  text: 'Extrae texto y tablas de archivos PDF, rellena formularios y combina documentos. Úsala cuando se trabaje con archivos PDF o cuando el usuario mencione PDFs, formularios o extracción de documentos.',
  note: 'Qué + cuándo + las palabras que la disparan. Claude sabe reconocerla en el momento justo.',
};

export const DESC_GOTCHA =
  'Describe el CUÁNDO, no el flujo de trabajo. Si resumes los pasos en la descripción, Claude los toma como atajo y se salta el cuerpo de la skill. Los pasos van dentro; en la descripción, solo disparadores.';

// ════════════════════════════════════════════════════════════════════════════
//  03 · La anatomía
// ════════════════════════════════════════════════════════════════════════════

// Visual overview of the folder, rendered as a code block above the annotated
// list. Comments map each entry to its one-word job.
export const TREE = `mi-skill/
├── SKILL.md        # obligatorio: las instrucciones
├── scripts/        # se ejecutan
├── references/     # se leen si hacen falta
└── assets/         # se usan en la salida`;

export type LayoutItem = { path: string; role: string };

export const LAYOUT: LayoutItem[] = [
  {
    path: 'SKILL.md',
    role: 'Obligatorio. Cabecera YAML (name + description) y, debajo, las instrucciones en Markdown.',
  },
  {
    path: 'scripts/',
    role: 'Código que se EJECUTA, no se lee: lo determinista, frágil o repetitivo.',
  },
  {
    path: 'references/',
    role: 'Documentos que Claude LEE solo cuando los necesita: instrucciones largas o detalles para casos concretos.',
  },
  {
    path: 'assets/',
    role: 'Archivos que se usan en la SALIDA: plantillas, fuentes, iconos…',
  },
];

export type Field = { name: string; rule: string };

export const FRONTMATTER: Field[] = [
  {
    name: 'name',
    rule: 'Obligatorio. Minúsculas, números y guiones; máx. 64 caracteres. En gerundio mejor (`processing-pdfs`); evita `helper` o `utils`.',
  },
  {
    name: 'description',
    rule: 'Obligatorio. Máx. 1024 caracteres. Qué hace + cuándo usarla, en tercera persona. Es el campo que decide la activación.',
  },
];

export const ANATOMY_NOTES: string[] = [
  'El cuerpo de `SKILL.md` funciona como un índice: corto (< 500 líneas) y apuntando a los archivos.',
  'Las referencias, a un solo nivel desde `SKILL.md`: las cadenas de enlaces se leen a medias.',
  'Rutas con barra normal (`/`), nunca `\\`.',
];

// Annotated SKILL.md, rendered as a code block. Backticks aquí son literales:
// imitan el código en línea dentro del propio ejemplo. La descripción va en una
// sola línea y sin comillas: así se escribe una cabecera de skill.
export const EXAMPLE = `---
name: notas-de-version
description: Redacta las notas de una versión a partir del historial de git. Úsala cuando se pida un changelog, las notas de una release o «qué ha cambiado».
---

# Notas de versión

1. Ejecuta \`scripts/recopilar-commits.sh\` para sacar los commits desde la
   última etiqueta (no lo leas: ejecútalo).
2. Agrúpalos en Novedades / Arreglos / Cambios internos.
3. Da formato siguiendo \`references/formato.md\`.`;

// ════════════════════════════════════════════════════════════════════════════
//  04 · Cómo escribirla bien
// ════════════════════════════════════════════════════════════════════════════

export type Principle = { title: string; body: string };

export const PRINCIPLES: Principle[] = [
  {
    title: 'Conciso: el contexto es un bien común',
    body: 'Da por hecho que Claude ya es listo: añade solo lo que no sabría. Cada párrafo tiene que ganarse sus tokens.',
  },
  {
    title: 'La altura justa',
    body: 'Ni reglas rígidas que se rompen, ni vaguedades. Ajusta la libertad a lo frágil de la tarea: puente estrecho, script exacto; campo abierto, dirección general.',
  },
  {
    title: 'Explica el porqué',
    body: 'El modelo obedece mejor cuando entiende la razón. Un muro de MUST en mayúsculas es mala señal: suele indicar sobreajuste.',
  },
  {
    title: 'Determinismo con scripts',
    body: 'Para lo repetitivo, frágil o exacto, escribe un script y dile que lo EJECUTE (deja claro «ejecuta» vs «lee como referencia»). Y que resuelva, no que escurra el bulto - sin constantes mágicas.',
  },
  {
    title: 'Una skill = una capacidad',
    body: 'Alcance estrecho: así la descripción dispara bien y el cuerpo se mantiene corto. Componer muchas pequeñas, no una que lo haga todo.',
  },
  {
    title: 'Empieza por el fallo',
    body: 'Mira primero a Claude fallar sin la skill y escribe lo mínimo que arregle ESE fallo. Itera: que una instancia la escriba y otra fresca la use, y observa dónde se atasca.',
  },
];

// ── Qué evitar - anti-patrones ────────────────────────────────────────────────
export type AntiPattern = { wrong: string; why: string };

export const ANTIPATTERNS: AntiPattern[] = [
  {
    wrong: 'Descripción vaga o en 1.ª/2.ª persona',
    why: 'No tiene con qué emparejar: no se activa nunca.',
  },
  {
    wrong: 'Resumir el flujo de trabajo en la descripción',
    why: 'Claude lo toma como atajo y se salta el cuerpo.',
  },
  {
    wrong: 'Volcarlo todo en SKILL.md (> 500 líneas)',
    why: 'Infla el contexto y diluye lo que importa.',
  },
  {
    wrong: 'Referencias muy anidadas',
    why: 'Los archivos en cadena se leen a medias.',
  },
  {
    wrong: 'Ofrecer mil opciones',
    why: 'Da una por defecto y una salida de emergencia.',
  },
  {
    wrong: 'Scripts que escurren el bulto o con constantes mágicas',
    why: 'Si tú no sabes el valor correcto, Claude tampoco.',
  },
  {
    wrong: 'Instalar skills que no son de fiar',
    why: 'Ejecutan código: revísalas antes, como cualquier software.',
  },
];

// ════════════════════════════════════════════════════════════════════════════
//  05 · Avanzado
//  Campos verificados contra la documentación oficial de Claude Code
//  (code.claude.com/docs/en/skills). Lo universal es name + description; el resto
//  son extensiones propias de Claude Code. «name-only» NO es un campo de la
//  cabecera: vive en los ajustes (skillOverrides en settings.json).
// ════════════════════════════════════════════════════════════════════════════

export const ADVANCED_INTRO =
  'La cabecera de una skill admite más campos que name y description. Son opciones propias de Claude Code: para la mayoría de skills no hacen falta, pero ayudan cuando quieres afinar el control.';

export type Advanced = {
  title: string;
  body: string;
  code: string;
  codeNote?: string;
};

export const ADVANCED: Advanced[] = [
  {
    title: 'Que el modelo no la active solo',
    body: 'La skill deja de activarse por su cuenta: solo se ejecuta cuando la invocas tú con «/su-nombre». Ideal para acciones delicadas -desplegar, borrar, publicar- que no quieres que Claude lance por iniciativa propia.',
    code: 'disable-model-invocation: true',
  },
  {
    title: 'Que la use el modelo, pero no aparezca para ti',
    body: 'Se esconde del menú de «/» (no la invocas a mano), pero Claude sí puede activarla él solo. Útil para conocimiento de fondo que no tiene sentido lanzar manualmente.',
    code: 'user-invocable: false',
  },
  {
    title: 'Que el modelo solo vea el nombre',
    body: 'Cuando tienes muchas skills puedes ocultar su descripción, para que Claude solo vea el nombre hasta que de verdad haga falta - así ahorras contexto. Ojo: esto NO va en la cabecera de la skill, sino en los ajustes.',
    code: '// .claude/settings.json\n"skillOverrides": { "mi-skill": "name-only" }',
    codeNote: 'Va en settings.json, no en SKILL.md. Otros valores: «off» la oculta del todo; «on» (por defecto) muestra nombre + descripción.',
  },
  {
    title: 'Que se ejecute en un contexto aparte',
    body: 'La skill corre como un subagente, en su propia sesión aislada: no ve tu conversación y te devuelve solo el resultado. Bueno para tareas largas o ruidosas que, si no, llenarían el hilo principal. Con «agent» eliges el perfil (Explore, Plan…).',
    code: 'context: fork\nagent: Explore',
  },
  {
    title: 'Pre-aprobar o vetar herramientas',
    body: 'Con «allowed-tools» pre-apruebas herramientas para que Claude no te pida permiso cada vez mientras la skill está activa. Con «disallowed-tools» se las quitas durante ese rato.',
    code: 'allowed-tools: Bash(git *) Read Grep',
  },
  {
    title: 'Que se active solo en ciertos archivos',
    body: 'Limita la activación automática a los archivos que encajen con un patrón. Así la skill solo entra en juego cuando trabajas en la zona que le toca.',
    code: 'paths: ["src/**/*.ts"]',
  },
];

export const ADVANCED_NOTE =
  'También puedes forzar el modelo o el nivel de esfuerzo mientras la skill está activa (`model`, `effort`). Recuerda: lo único universal es `name` y `description` - el resto son extras de Claude Code.';

// ── Cierre ────────────────────────────────────────────────────────────────────
export const ABOUT =
  'Estas pautas valen para cualquier skill. Lo que cambia de una a otra son los ejemplos concretos: qué disparadores, qué scripts, qué referencias. Empieza pequeño, mira a Claude usarla y afínala desde donde falle.';
