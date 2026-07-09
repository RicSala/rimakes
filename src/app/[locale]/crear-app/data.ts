// Single source of truth for «Crear una app con Claude» - the app-building
// guide, condensed from Módulos 8 y 9 of the workshop deck: the nine
// fundamentals, the default stack, and the step-by-step build where every
// step is a prompt you paste to Claude. Spanish-only, like the other
// resource pages. Kept deliberately terse: one idea per line.

// ── How to use this guide - shown in the header ──────────────────────────────
export const USAGE: string[] = [
  'Para consultar, no memorizar',
  'Cada paso es un prompt que pegas a Claude',
  'Lo que va en [corchetes] lo adaptas a tu app',
];

export type Fundamento = {
  /** Anchor id so the steps can link back to the concept (e.g. "f-git"). */
  id: string;
  title: string;
  what: string;
};

export type StackRow = { need: string; lib: string; gives: string };

export type Step = {
  title: string;
  body: string;
  /** The literal prompt to paste to Claude, shown collapsed. */
  prompt?: string;
  /** Chip linking back to the fundamental this step exercises. */
  concept?: { label: string; anchor: string };
};

export type Phase = { title: string; intro?: string; steps: Step[] };

// ════════════════════════════════════════════════════════════════════════════
//  01 · LAS NUEVE PIEZAS - los fundamentos
// ════════════════════════════════════════════════════════════════════════════

export const FUNDAMENTOS_PUNCHLINE =
  'Tú no escribes código - lo hace Claude. Pero para pedirle bien necesitas el mapa de las piezas: estas nueve.';

export const FUNDAMENTOS: Fundamento[] = [
  {
    id: 'f-arquitectura',
    title: 'Cliente y servidor',
    what: 'El **frontend** es la interfaz: lo que el usuario ve (corre en su navegador); el **backend**, la lógica, los datos y los secretos (corre en un servidor). Se hablan por una **API**: el frontend pide, el backend responde. Lo sensible vive **solo en el backend**.',
  },
  {
    id: 'f-librerias',
    title: 'Librerías',
    what: 'Un **paquete de código que ya escribió otra persona** para resolver un problema: en vez de fabricar la pieza, la «enchufas». Tu trabajo es **unir piezas**. Elige lo **mainstream** (la IA lo escribe mejor) e instala su **skill** (skills.sh) si cambia rápido.',
  },
  {
    id: 'f-apis',
    title: 'APIs y servicios externos',
    what: 'Una **API** es la forma en que dos programas **se hablan**: tu app le **pide** algo a otro servicio (IA, emails, pagos…) y este **responde**. No construyes desde cero: **ensamblas servicios** ya hechos. Casi todos piden una **clave** (→ variables de entorno) y muchos **cuestan dinero** por uso.',
  },
  {
    id: 'f-bd',
    title: 'Bases de datos',
    what: 'Donde la app **recuerda** lo que cambia mientras funciona (contactos, pedidos…). Un Excel «on steroids»: tabla = pestaña, fila = registro, columna = campo. Vive en el **backend** - no en el código, que solo cambia si alguien reescribe la app.',
  },
  {
    id: 'f-git',
    title: 'Git y GitHub',
    what: '**Git** va creando un **árbol de versiones** de tu proyecto: cada **commit** añade una «foto» (un nodo) a la que siempre puedes volver. **GitHub** guarda ese árbol **en la nube**, para trabajar con otros. Commit guarda en tu ordenador; **push** lo sube.',
  },
  {
    id: 'f-deploy',
    title: 'Deploy (Vercel)',
    what: 'Mientras la construyes, tu app corre **solo en tu ordenador** - un borrador que solo ves tú. **Deployar** es publicarla: mandarla a un servidor de verdad (Vercel coge tu código de GitHub) que la pone **en internet, con una URL** que cualquiera puede abrir.',
  },
  {
    id: 'f-env',
    title: 'Variables de entorno',
    what: 'Las claves viven **fuera del código**: en `.env` (no sube a GitHub) y en los ajustes de Vercel. **Nunca escribas una clave en el código**; si se escapa, dala por quemada y crea otra.',
  },
  {
    id: 'f-workflow',
    title: 'El workflow',
    what: 'Un bucle: **Explorar → Plan → Ejecutar → Verificar**, una y otra vez. Pide el **qué** y el **porqué**; deja el **cómo** a Claude. Tú decides el plan y verificas el resultado.',
  },
  {
    id: 'f-errores',
    title: '¿Y cuando hay un error?',
    what: 'Son normales. Aparecen en la **terminal** o en el **navegador** (consola: F12). Copia **el error entero** (o pega una **captura**) tal cual, sin resumirlo. Muchas veces no hace falta más.',
  },
];

// ════════════════════════════════════════════════════════════════════════════
//  02 · EL STACK POR DEFECTO
// ════════════════════════════════════════════════════════════════════════════

// (1) marks the pieces Supabase can replace in one service - see STACK_NOTE.
export const STACK: StackRow[] = [
  { need: 'Framework', lib: 'Next.js', gives: 'Front y back en el mismo proyecto' },
  { need: 'Estilos', lib: 'Tailwind CSS', gives: 'Estilos rápidos por clases' },
  { need: 'Componentes', lib: 'shadcn/ui', gives: 'Componentes listos que copias y editas' },
  { need: 'BD · ORM', lib: 'Prisma (1)', gives: 'Hablar con la BD sin SQL a mano' },
  { need: 'BD · hosting', lib: 'Neon (1)', gives: 'La BD Postgres en la nube' },
  { need: 'Autenticación', lib: 'better-auth (1)', gives: 'Registro, login y sesiones' },
  { need: 'Formularios', lib: 'React Hook Form + Zod', gives: 'Formularios con validación' },
  { need: 'IA', lib: 'Vercel AI SDK', gives: 'Chat, streaming y tools con cualquier modelo' },
  { need: 'Email', lib: 'Resend', gives: 'Enviar emails' },
  { need: 'Pagos', lib: 'Stripe', gives: 'Pagos y suscripciones' },
  { need: 'Archivos', lib: 'Cloudflare R2 (1)', gives: 'Almacenar archivos e imágenes' },
  { need: 'Publicar', lib: 'Vercel', gives: 'Desplegar casi en un clic' },
];

export const STACK_NOTE =
  'Son **populares y estándar**: cuanto más conocida es una librería, mejor la escribe la IA. (1) **Supabase** engloba BD, auth y archivos en un solo servicio - también muy buena opción.';

// ════════════════════════════════════════════════════════════════════════════
//  03 · DE CERO A PUBLICADA - el paso a paso
// ════════════════════════════════════════════════════════════════════════════

export const PASOS_PUNCHLINE =
  'Del proyecto vacío a una app publicada. Cada paso, un prompt.';

export const PHASES: Phase[] = [
  {
    title: 'El esqueleto',
    steps: [
      {
        title: 'Inicializa el proyecto con Next.js',
        body: 'Abre Claude en la carpeta **padre** - la del proyecto la crea él.',
        prompt:
          'Inicializa una aplicación de Next.js usando el CLI. El nuevo proyecto se llama [nombre-de-tu-app].',
        concept: { label: 'Librerías', anchor: '#f-librerias' },
      },
      {
        title: 'shadcn/ui y una página /theme',
        body: '**Sesión nueva, en la carpeta del proyecto.** Monta la librería de componentes con un preset (elígelo en [ui.shadcn.com/create](https://ui.shadcn.com/create)) y una página `/theme` de preview.',
        prompt: `Instala la skill de shadcn: https://ui.shadcn.com/docs/skills

Asegúrate de que el MCP de shadcn está instalado también: https://ui.shadcn.com/docs/mcp

Después, inicializa shadcn usando el CLI. Quiero usar el preset: --preset [tu-preset]

Instala 15 componentes comunes y crea una página "/theme" donde enseñes los distintos componentes en una especie de preview del tema; quiero verlos usados en su contexto.`,
      },
      {
        title: 'Arranca la app: botón ▶ Run',
        body: 'Pulsa **▶ Run** (lanza el `npm run dev` que Claude dejó en `.claude/launch.json`) y abre `/theme`. Copia la URL: el puerto puede variar.',
      },
    ],
  },
  {
    title: 'Guarda y publica',
    steps: [
      {
        title: 'Commit y sube a GitHub',
        body: 'Un checkpoint al que poder volver, y tu copia en la nube (repo privado).',
        prompt: `Haz commit y publica en GitHub en un repositorio privado.

Comprueba si tengo instalado git y el CLI de gh; si no es así, instálalo y guíame en la autenticación.`,
        concept: { label: 'Git y GitHub', anchor: '#f-git' },
      },
      {
        title: 'Publica en Vercel y provisiona Neon',
        body: 'Cada push a `main` se autopublica; de paso, provisiona la base de datos Neon.',
        prompt: `Quiero publicarlo con Vercel y, ya que estamos allí, provisionaremos una base de datos Neon que luego usaremos (con Prisma; de momento no hagas el scaffolding).

A través del CLI de Vercel, linka el repositorio con un nuevo proyecto en Vercel para que cada push a main se autopublique. Comprueba si tengo instalado el CLI de Vercel; si no es así, instálalo y guíame para autenticarme y que puedas continuar. Una vez conectado, guíame para provisionar la base de datos a través de la interfaz.

De momento no hagas pull de las variables de entorno, quiero ponerlas yo (de momento .env en lugar de .env.local). Crea el archivo .env totalmente vacío.`,
        concept: { label: 'Deploy', anchor: '#f-deploy' },
      },
      {
        title: 'Pega tú las variables de entorno',
        body: 'Las claves las pegas **tú** en `.env` (panel *Files* de la app de Claude). El `.gitignore` evita que suba a GitHub.',
        concept: { label: 'Variables de entorno', anchor: '#f-env' },
      },
      {
        title: 'Monta Prisma y prueba la BD',
        body: 'El scaffold del ORM y una tabla de ejemplo, para comprobar la base de datos y el autodeploy.',
        prompt: `Instala la skill de Prisma database setup: https://www.skills.sh/prisma/skills/prisma-database-setup

Añade el scaffold de Prisma y crea una tabla de ejemplo (TODOs) para comprobar que funciona correctamente; añade 3 todos de ejemplo.

Cuando lo tengas, haz commit y push para que comprobemos que todo es correcto y que el autodeploy de Vercel funciona.`,
        concept: { label: 'Bases de datos', anchor: '#f-bd' },
      },
      {
        title: 'Añade Prisma Studio',
        body: 'Un segundo servidor para ver y editar tus datos en el navegador.',
        prompt: 'Añade al launch.json otro servidor que corra Prisma Studio.',
      },
      {
        title: 'Cierra la sesión',
        body: 'Verifica, actualiza el `CLAUDE.md`, commit y push - nada a medias. (Si lo harás a menudo: una skill tipo `/session-close`.)',
        prompt: `Hemos terminado la sesión de trabajo y voy a borrar esta sesión.

Actualiza el CLAUDE.md si es necesario (no añadas secciones, simplemente actualiza lo que no esté al día tras los cambios de esta sesión). Corre los comandos de verificación de los que dispongas (typecheck, lint, build; usa el browser si el cambio de UI en esta sesión fue relevante).

Si algo cambia, commit y push.

Revisa que no dejamos el proyecto en un estado inconsistente o con una funcionalidad a medias y confírmame que podemos cerrar.`,
      },
    ],
  },
  {
    title: 'Define y construye',
    steps: [
      {
        title: 'Define la app en un spec.md',
        body: 'Sesión nueva. Define **antes de construir**: cuéntale la idea, deja que pregunte y que lo escriba en un `spec.md`.',
        prompt: `Estoy pensando en crear la siguiente aplicación: [tu idea en una frase] (MVP).

[Contexto del dominio: quién la usará y qué problema resuelve.]

Objetivo: [qué quieres conseguir]. Esta app no debería requerir integrar servicios externos: debería ser, de momento, un CRUD sofisticado.

Dame ideas de qué funcionalidades y pantallas debería tener, «mono-tenant» y con un único rol de usuario de momento.

Precarga datos seed con [datos ficticios] para una visualización realista. Quiero una estética cuidada y polished. Hazme cuantas preguntas consideres necesarias. No empieces a construir, estamos explorando y definiendo la app.

Usa la skill de specs en modo PROTOTIPO.`,
        concept: { label: 'El workflow', anchor: '#f-workflow' },
      },
      {
        title: 'Actualiza el CLAUDE.md',
        body: '[Descarga la plantilla](/api/plantilla-claude-md), adjúntasela junto al prompt - y léelo después.',
        prompt: `Actualiza el CLAUDE.md utilizando como referencia este template:

[adjunta aquí la plantilla que has descargado]`,
      },
      {
        title: 'Implementa el spec',
        body: 'Para un prototipo, todas las fases de golpe (con más calma: fase a fase, verificando). Mantente atento por si te pregunta. Antes, commit + push; en una app pequeña, sigue en la misma sesión.',
        prompt: `Implementa todas las fases.

Puedes hacer \`npx prisma db push --force-reset\` para limpiar la base de datos; la tabla actual es una prueba.`,
      },
      {
        title: 'Verifica, cierra… y úsala',
        body: 'Revisa la app y cierra como siempre; con el push, Vercel la publica. Será una primera versión funcional, no perfecta.',
      },
    ],
  },
  {
    title: 'Itera',
    steps: [
      {
        title: 'El mismo bucle, siempre',
        body: 'Para añadir algo grande: **explora** (alternativas), **modo plan** (`Shift+Tab` - investiga y planifica sin tocar código) y, aprobado el plan, que implemente.',
        prompt: `Quiero añadir una nueva funcionalidad a la app: [descríbela].

Me gustaría hacerlo de la forma más sencilla posible. Investiga qué librerías o enfoques podemos utilizar y dame 3 alternativas; recomienda una de ellas.`,
        concept: { label: 'El workflow', anchor: '#f-workflow' },
      },
    ],
  },
];
