// Single source of truth for «Glosario» — the workshop glossary.
// Plain-language definitions aimed at non-technical people, mirroring the
// Notion glossary (the source of truth). 89 terms across 7 sections; keep each
// entry short and jargon-free. To update, re-sync from the Notion «Glosario»
// database (data source fc0ab83f-e79c-4e52-9134-006fc85c6b1f).

// ── How to read this glossary — shown in the header ───────────────────────────
export const USAGE: string[] = [
  'Búscalo cuando una palabra te suene a chino',
  'Pensado para no técnicos: sin tecnicismos',
  'Lo que no esté, se lo preguntas a Claude',
];

export type GlossaryEntry = { term: string; def: string };
export type GlossarySection = {
  id: string;
  n: string;
  title: string;
  hint: string;
  accent: string;
  entries: GlossaryEntry[];
};

// Sections are numbered and each gets one accent from the mapa palette.
export const GLOSSARY: GlossarySection[] = [
  {
    id: 'fundamentos',
    n: '01',
    title: 'Fundamentos de IA',
    hint: 'cómo piensa (y cómo falla)',
    accent: 'var(--c-core)',
    entries: [
      {
        term: 'Alucinación',
        def: 'Cuando la IA se inventa algo y lo presenta con total seguridad como si fuera cierto (un dato, una cita, una función que no existe). Es la razón principal por la que siempre hay que verificar.',
      },
      {
        term: 'Contexto / Ventana de contexto',
        def: 'Toda la información que la IA tiene delante en un momento dado: tu mensaje, la conversación previa y los archivos que le has dado. Es limitada, así que conviene no llenarla de cosas irrelevantes: si se satura, pierde precisión.',
      },
      {
        term: 'Dumb zone (zona de bajo rendimiento)',
        def: 'Cuando una conversación se llena demasiado, la IA empieza a perder calidad y a olvidar cosas del principio. A esa parte del contexto «saturado» se le llama dumb zone. La solución suele ser empezar una conversación nueva.',
      },
      {
        term: 'Few-shot / Zero-shot',
        def: 'Formas de pedir las cosas según cuántos ejemplos pongas en el prompt. Zero-shot = sin ejemplos, solo la instrucción. Few-shot = con varios ejemplos para que la IA copie el patrón. Dar ejemplos suele ser la forma más fácil de obtener justo lo que quieres.',
      },
      {
        term: 'LLM (modelo de lenguaje)',
        def: 'El tipo de IA que hay detrás de estas herramientas. En el fondo predice la siguiente palabra una y otra vez; no es una base de datos ni una persona. Por eso es probabilística y a veces se equivoca con total seguridad.',
      },
      {
        term: 'Modelo',
        def: 'El «cerebro» de IA concreto que genera las respuestas, con su versión y capacidades (ej.: Claude Opus 4.6). Un mismo proveedor ofrece varios modelos: unos más rápidos y baratos, otros más potentes y lentos.',
      },
      {
        term: 'Opus, Sonnet y Haiku (y Fable)',
        def: 'Los modelos de Claude, de más a menos potente: Opus (el más capaz, para lo difícil), Sonnet (equilibrado) y Haiku (el más rápido y barato). Fable es un modelo puntual que consume el doble de tus límites que Opus.',
      },
      {
        term: 'Prompt',
        def: 'La instrucción o pregunta que le das a la IA: lo que escribes para pedirle algo. La calidad del resultado depende mucho de lo claro y específico que seas.',
      },
      {
        term: 'Proveedor (de IA)',
        def: 'La empresa que crea y ofrece los modelos de IA. No es lo mismo que el modelo: Anthropic es el proveedor, y Claude Opus 4.6 es el modelo. Otros proveedores son OpenAI o Google.',
      },
      {
        term: 'RAG (Retrieval-Augmented Generation)',
        def: 'Una forma de hacer que la IA responda basándose en TUS documentos: en lugar de fiarse solo de lo que «sabe», recupera los trozos relevantes de tus textos y se los mete en el contexto antes de responder. Es la idea de «anclar» (grounding) el modelo a tus datos. Hoy, a pequeña escala, ese efecto se consigue más fácil subiendo archivos, conectando tus fuentes (conectores/MCP) o dejando que el agente busque sobre la marcha; la RAG «de manual» sigue siendo útil sobre todo cuando hay muchísimos documentos que no caben en el contexto.',
      },
      {
        term: 'Sicofancia (ser «sicofante»)',
        def: 'La tendencia de la IA a ser demasiado complaciente: a darte la razón o decirte lo que quieres oír en vez de contradecirte. Conviene recordarlo: que esté de acuerdo no significa que tengas razón.',
      },
      {
        term: 'System prompt (instrucciones del sistema)',
        def: 'Las instrucciones permanentes que definen cómo se comporta un asistente de IA —fijadas una vez y aplicadas a toda la conversación (quién es, su tono, qué evita)— frente al mensaje puntual que escribes en cada turno. En Claude.ai lo pone Anthropic antes de todo; tu CLAUDE.md o las instrucciones de un Proyecto son una capa que va encima, no lo sustituyen.',
      },
      {
        term: 'Temperatura',
        def: 'Un «mando» interno que regula cuánta variación tienen las respuestas. Por eso, ante la misma pregunta, la IA puede contestar de formas distintas: no es un fallo, es que no es una calculadora, sino algo probabilístico.',
      },
      {
        term: 'Thinking effort (esfuerzo de razonamiento)',
        def: 'Pedirle a la IA que «piense más» antes de responder. Más razonamiento da mejores resultados en tareas difíciles, a cambio de tardar más. Para tareas sencillas no hace falta.',
      },
      {
        term: 'Token',
        def: 'La unidad en la que la IA «trocea» el texto (aproximadamente una palabra o un trozo de palabra). Tanto el contexto como el coste se miden en tokens.',
      },
    ],
  },
  {
    id: 'agentes',
    n: '02',
    title: 'Agentes y autonomía',
    hint: 'de autocompletar a actuar solo',
    accent: 'var(--c-surface)',
    entries: [
      {
        term: 'Agente',
        def: 'Una IA que no solo responde, sino que actúa: usa herramientas, lee y modifica archivos, ejecuta tareas y repite el proceso hasta cumplir un objetivo. Le delegas una meta, no un paso concreto.',
      },
      {
        term: 'Agentes autónomos / asíncronos',
        def: 'Agentes a los que delegas una tarea y «te vas»: funcionan en segundo plano, en bucle o programados, sin que tengas que vigilarlos paso a paso. Es el nivel más alto de autonomía.',
      },
      {
        term: 'Agéntico',
        def: 'Describe cuánta autonomía le damos a la IA. En un extremo, el autocompletado (te sugiere la siguiente palabra); en el otro, lo «agéntico»: le das un objetivo («hazme una app para agendar posts») y ella decide los pasos y los ejecuta.',
      },
      {
        term: 'Autocompletado',
        def: 'La IA integrada en la herramienta que ya usas, completando lo que escribes sobre la marcha (por ejemplo, el texto sugerido al redactar un correo). Es el nivel más básico de ayuda.',
      },
      {
        term: 'Computer use (uso del ordenador)',
        def: 'La capacidad de la IA de manejar la pantalla como lo haría una persona: «ver» mediante capturas y hacer clic y escribir. Sirve para programas que no tienen otra forma de conexión. Es lento, pero funciona.',
      },
      {
        term: 'Harness',
        def: 'El «armazón» que envuelve al modelo y lo convierte en una herramienta útil: el programa que le da acceso a herramientas, gestiona el contexto, controla permisos y ejecuta el bucle de trabajo. Claude Code es un harness; el modelo es el motor que lleva dentro.',
      },
      {
        term: 'Herramienta (tool use)',
        def: 'Acciones que la IA puede ejecutar por sí misma más allá de escribir texto: leer un archivo, buscar en la web, mandar un email. Cuando «usa una herramienta» (tool use) está haciendo algo en el mundo real, no solo respondiendo.',
      },
      {
        term: 'Modo plan (Plan mode)',
        def: 'Hacer que la IA primero investigue y proponga un plan, que tú revisas y ajustas, y solo entonces la dejas ejecutar. Evita que se lance a hacer algo que no era lo que pedías.',
      },
      {
        term: 'Modos de permisos',
        def: 'El nivel de libertad que le das a Claude para actuar sin preguntarte: desde confirmar cada paso, pasando por «auto-aceptar ediciones», hasta «auto» (avanza solo) o «bypass» (se salta todos los permisos). A más autonomía, más cuidado.',
      },
      {
        term: 'Subagente',
        def: 'Un agente secundario al que se le encarga una subtarea con su propio contexto limpio: investiga a fondo y devuelve solo un resumen, manteniendo despejado el contexto principal.',
      },
      {
        term: 'Wrapper (envoltorio)',
        def: 'Una capa que «envuelve» algo más complejo para que sea más fácil de usar o para añadirle funciones, sin tocar lo que hay dentro. La palabra aparece en muchos sitios —un programa que envuelve a otro, una web que envuelve una herramienta, una función que envuelve a otra—, pero la idea es siempre casi la misma: algo que rodea otra cosa y te la presenta de forma más cómoda. Ejemplo del curso: el harness (Claude Code, Cursor…) es un wrapper alrededor del modelo de IA.',
      },
    ],
  },
  {
    id: 'ecosistema',
    n: '03',
    title: 'Ecosistema Claude',
    hint: 'apps, configuración y memoria',
    accent: 'var(--c-capability)',
    entries: [
      {
        term: '/loop',
        def: 'Hacer que Claude repita una tarea de forma programada (cada X minutos, cada día): vigilar algo, mantenerlo al día o recopilar información de forma recurrente.',
      },
      {
        term: 'Artefacto',
        def: 'Concepto general: cualquier output concreto y reutilizable que produces con la IA y conservas —un documento, una hoja de cálculo, un prompt guardado, una «spec» (especificación) o un fragmento de código—. La idea de fondo (Sean Grove): lo que de verdad perdura y aporta valor es el artefacto (la spec o el prompt), no solo la respuesta puntual. El «Artifact» de Claude es un caso concreto de esto.',
      },
      {
        term: 'Artifact (Claude)',
        def: 'La función de Claude: un panel aparte donde la IA crea contenido independiente (un documento, código, una página) que puedes ver, editar y reutilizar, separado de la conversación del chat. Es un tipo concreto de «artefacto» (ver Artefacto).',
      },
      {
        term: 'Chat',
        def: 'Conversación de ida y vuelta con la IA: recuerda el hilo de esa sesión y vas refinando turno a turno. Sigue siendo solo texto, y eres tú quien da cada paso.',
      },
      {
        term: 'Claude Code',
        def: 'La versión de Claude que no solo conversa, sino que HACE: vive en la terminal (y en app de escritorio), lee y edita tus archivos, ejecuta comandos y construye cosas. Nació para programar, pero hoy sirve para mucho más.',
      },
      {
        term: 'Claude Cowork',
        def: 'Claude Code «disfrazado» de asistente dentro de la app de escritorio: la misma potencia para hacer cosas en tu ordenador, pero con una interfaz más cómoda y menos técnica que la terminal.',
      },
      {
        term: 'Claude Design',
        def: 'La herramienta de Claude orientada a trabajar con diseño (interfaces, mockups, visuales) en lugar de solo texto o código.',
      },
      {
        term: 'CLAUDE.md',
        def: 'Un archivo de instrucciones del proyecto que la IA lee siempre: estilo, normas y cosas que debe evitar. Cada vez que la IA se equivoca, añades ahí la corrección para que no repita el error.',
      },
      {
        term: 'Comando (slash command)',
        def: 'Un prompt guardado que ejecutas tú manualmente escribiendo /nombre. A diferencia de una skill, la IA no lo activa sola: tú decides cuándo usarlo.',
      },
      {
        term: 'Connectors (conectores)',
        def: 'La forma de conectar Claude (en Chat y Cowork) con apps externas como Notion, Gmail o Google Drive. Es el equivalente a los MCP en Claude Code: un «enchufe» para que Claude lea y actúe en otras herramientas.',
      },
      {
        term: 'Extensión de Chrome (de Claude)',
        def: 'Un complemento del navegador que deja a Claude ver y actuar sobre la página web que tienes abierta. Útil para herramientas web que no tienen conector ni API: la IA opera «a través de tu navegador».',
      },
      {
        term: 'Frontmatter',
        def: 'El pequeño bloque de configuración al principio de un archivo (entre «---») donde se indican ajustes como el nombre, la descripción o el modelo a usar. Habitual en las skills y en el contenido.',
      },
      {
        term: 'Hook',
        def: 'Una orden que se ejecuta automáticamente cuando pasa algo (antes o después de una acción), para imponer reglas o comprobaciones sin depender de que la IA se acuerde. Solo «consume» atención cuando se dispara.',
      },
      {
        term: 'Live artifact (artifact interactivo)',
        def: 'Un artifact que además funciona: una mini-aplicación que puedes usar (pulsar, escribir), compartir e incluso que use IA por dentro. Todo sin instalar ni publicar nada.',
      },
      {
        term: 'MCP (Model Context Protocol)',
        def: 'Un estándar para conectar la IA con tus aplicaciones y datos (Slack, Google Drive, calendario, bases de datos), de modo que pueda leer y actuar dentro de tus herramientas reales.',
      },
      {
        term: 'Memoria (MEMORY.md)',
        def: 'Lo que Claude recuerda entre conversaciones por su cuenta: puede ser un archivo (MEMORY.md) donde va anotando cosas, o un resumen que se actualiza solo cada cierto tiempo. Distinto de CLAUDE.md, que lo escribes tú.',
      },
      {
        term: 'Plugin',
        def: 'Un «paquete» que agrupa varias capacidades (skills, agentes y conexiones) para instalarlas, compartirlas y activarlas de una vez, en lugar de configurarlas una a una.',
      },
      {
        term: 'Progressive disclosure (revelación progresiva)',
        def: 'Mostrar o cargar la información solo cuando hace falta, en vez de toda de golpe. La IA arranca con lo mínimo (un índice, un resumen, un puntero) y va abriendo el detalle a medida que lo necesita, para no saturar su atención (el contexto) y mantenerse centrada. Ocurre, por ejemplo, en las skills, al leer archivos bajo demanda o en un CLAUDE.md esbelto que apunta a otros documentos.',
      },
      {
        term: 'Remote Control / Dispatch',
        def: 'Maneras de usar Claude a distancia: «remote control» es controlar tu Claude Code desde el móvil o la web; «dispatch» es dejar el ordenador encendido y mandarle tareas para que las haga mientras no estás.',
      },
      {
        term: 'Schedule (tareas programadas / rutinas)',
        def: 'Agentes programados que se ejecutan de forma recurrente en el servidor, incluso con el portátil cerrado. Es la versión «en la nube» de /loop.',
      },
      {
        term: 'Skill',
        def: 'Una capacidad reutilizable que la IA puede usar automáticamente cuando encaja con la tarea: una especie de «receta» empaquetada con sus instrucciones. Las hay incluidas de serie y también puedes crear las tuyas.',
      },
      {
        term: 'Workflow (flujo de trabajo)',
        def: 'Una secuencia de pasos definida por ti en la que la IA rellena cada paso (por ejemplo: redactar → traducir → publicar). Tú decides el orden; es predecible y repetible. No es lo mismo que un agente, donde es la IA quien decide los pasos.',
      },
    ],
  },
  {
    id: 'desarrollo',
    n: '04',
    title: 'Desarrollo web',
    hint: 'de qué está hecha una app',
    accent: 'var(--c-lens)',
    entries: [
      {
        term: 'Backend',
        def: 'La «trastienda» de una aplicación: la lógica, el acceso a los datos y la custodia de las claves secretas. Funciona en un servidor, no en el navegador, y el usuario no lo ve.',
      },
      {
        term: 'CLI (interfaz de línea de comandos)',
        def: 'Una herramienta que se maneja escribiendo órdenes de texto en la terminal, en vez de con ventanas y botones. Claude Code es una CLI: una aplicación que usas desde la terminal. Diferencia: la terminal es la ventana/entorno; la CLI es el programa que ejecutas dentro de ella.',
      },
      {
        term: 'CSS',
        def: 'El lenguaje que define el aspecto de una página web: colores, tipografías, tamaños, espacios y posición. Responde a «¿cómo se ve?». En el stack del curso suele escribirse como clases de Tailwind.',
      },
      {
        term: 'Cursor',
        def: 'Un editor de código (donde se escribe y se ve el proyecto) con terminal integrada y ayuda de IA. Es el «sitio» donde trabajas con tus archivos.',
      },
      {
        term: 'Dependencia',
        def: 'Una librería de la que tu proyecto depende para funcionar. Un proyecto normal tiene muchas (decenas o cientos); la lista de las tuyas vive en el archivo package.json.',
      },
      {
        term: 'Deploy (despliegue)',
        def: 'Publicar tu aplicación para que esté disponible en internet. Hasta que no haces «deploy», tu web solo funciona en tu ordenador.',
      },
      {
        term: 'Framework',
        def: 'El armazón completo de una aplicación: te da la estructura y resuelve de serie lo común (cómo se conectan las páginas, cómo se ejecuta, cómo se publica) a cambio de seguir sus convenciones. Una librería te da piezas sueltas; un framework, la estructura entera. Ejemplo: Next.js.',
      },
      {
        term: 'Frontend',
        def: 'La parte de una aplicación que el usuario ve y toca: las pantallas, los botones, los formularios. Funciona dentro del navegador.',
      },
      {
        term: 'HTML',
        def: 'El lenguaje que define la estructura y el contenido de una página web: títulos, párrafos, botones, imágenes, formularios… Responde a «¿qué hay en la página?». Uno de los tres lenguajes de la web, junto a CSS y JavaScript.',
      },
      {
        term: 'JavaScript (JS)',
        def: 'El lenguaje que da comportamiento a una web: lo que pasa al pulsar un botón, validar un formulario o cargar datos. Responde a «¿qué hace?». Con Node también funciona fuera del navegador.',
      },
      {
        term: 'Librería (paquete)',
        def: 'Código ya hecho por otros que reutilizas en tu proyecto en lugar de escribirlo tú (p. ej. React). También se le llama «paquete». Te ahorra reinventar la rueda.',
      },
      {
        term: 'Next.js',
        def: 'El framework de React más usado para construir aplicaciones web, y el que usamos en el curso. React te da las piezas (componentes); Next.js te da el armazón de toda la app alrededor: rutas, navegación y el camino para publicarla.',
      },
      {
        term: 'Node.js',
        def: 'El «motor» que permite ejecutar JavaScript fuera del navegador (en tu ordenador o en un servidor). Es lo que hace de servidor cuando arrancas tu app en local, y lo que trae npm.',
      },
      {
        term: 'npm',
        def: 'El gestor de paquetes, o «instalador de librerías»: descarga las librerías que tu proyecto necesita y las coloca en su sitio. Viene incluido con Node; el comando típico es «npm install».',
      },
      {
        term: 'React',
        def: 'La tecnología más usada para construir la parte visual (frontend) de las webs modernas: el «motor» para crear interfaces a base de piezas reutilizables.',
      },
      {
        term: 'SDK',
        def: 'Un kit de piezas ya preparadas que una empresa ofrece para que los programadores conecten con su producto sin construirlo todo desde cero. (De Software Development Kit.)',
      },
      {
        term: 'Terminal',
        def: 'La ventana donde escribes comandos de texto y ves sus resultados, en lugar de usar ventanas y botones. Es el entorno donde se ejecutan herramientas como Claude Code (la terminal es la ventana; la CLI es el programa que corre dentro). Parece intimidante, pero es solo otra forma de hablar con el ordenador.',
      },
      {
        term: 'TypeScript',
        def: 'Una versión de JavaScript que añade «etiquetas» a los datos para detectar errores antes de que la app se ejecute. Es JavaScript con red de seguridad.',
      },
      {
        term: 'Vercel',
        def: 'Una plataforma para publicar (desplegar) aplicaciones web en internet con muy poca configuración. Es donde «vive» la web una vez terminada.',
      },
    ],
  },
  {
    id: 'git',
    n: '05',
    title: 'Git y versiones',
    hint: 'los checkpoints de tu código',
    accent: 'var(--c-core)',
    entries: [
      {
        term: 'Commit',
        def: 'Un punto de guardado del proyecto, con un mensaje que describe qué cambiaste (p. ej. «añado el formulario de contacto»). Es el ladrillo del historial; puedes volver a cualquier commit anterior.',
      },
      {
        term: 'Git',
        def: 'La herramienta de control de versiones: la «máquina del tiempo» de tu proyecto en tu ordenador. Va guardando la historia de los cambios y te deja volver atrás cuando algo se rompe.',
      },
      {
        term: 'GitHub',
        def: 'Git en la nube. El sitio web donde subes tu repositorio: copia de seguridad, fuente de verdad, lugar para compartir y colaborar, y el puente que conecta tu proyecto con servicios como Vercel para publicarlo. (Git es la herramienta; GitHub es el sitio.)',
      },
      {
        term: 'Rama (branch)',
        def: 'Una copia paralela de tu proyecto para trabajar en algo nuevo sin tocar la versión que funciona. Si sale bien, se une (merge) a la principal; si no, se descarta sin haber roto nada.',
      },
      {
        term: 'Repositorio',
        def: 'La carpeta de tu proyecto junto con todo su historial de cambios, «vigilada» por git. En corto, «repo».',
      },
    ],
  },
  {
    id: 'conexiones',
    n: '06',
    title: 'Conexiones y seguridad',
    hint: 'enchufes, llaves y candados',
    accent: 'var(--c-surface)',
    entries: [
      {
        term: '.env',
        def: 'Archivo de texto donde guardas las variables de entorno en tu ordenador (formato CLAVE=valor). Nunca se sube a GitHub: va dentro del .gitignore para que no se filtren las llaves.',
      },
      {
        term: 'Allowlist de dominios',
        def: 'Una lista blanca de webs a las que se le permite acceder a la IA. Sirve para limitar por seguridad a dónde puede conectarse, dejando fuera todo lo que no esté en la lista.',
      },
      {
        term: 'API',
        def: 'Una «puerta» estándar que ofrece un programa para que otros (incluida la IA) le pidan datos o le manden hacer cosas de forma automática. Si tu herramienta tiene API, se puede conectar a la IA aunque no exista un conector ya hecho — pero suele ser algo más técnico.',
      },
      {
        term: 'API key',
        def: 'Una llave secreta que identifica a tu app ante un servicio externo (la IA, pagos, una base de datos…) cada vez que lo usa. Suele costar dinero, así que se trata como una contraseña: quien la tiene puede gastar en tu nombre.',
      },
      {
        term: 'Autenticación y autorización',
        def: 'Dos cosas distintas: autenticación es demostrar quién eres (como enseñar el DNI); autorización es qué te permiten hacer una vez dentro (qué puertas puedes abrir).',
      },
      {
        term: 'Cron',
        def: 'Una forma de programar que algo se ejecute automáticamente en momentos concretos y de forma repetida (por ejemplo, «cada lunes a las 9:00»). El despertador de las tareas automáticas.',
      },
      {
        term: 'HTTPS',
        def: 'La versión segura y cifrada de las conexiones web (la «S» es de seguro; el candadito del navegador). Garantiza que lo que viaja entre tu ordenador y la web no se pueda espiar.',
      },
      {
        term: 'SSH',
        def: 'Un método de conexión segura y cifrada entre tu ordenador y un servicio. Usa un par de «llaves» en lugar de contraseña: más seguro, pero algo más complejo de configurar.',
      },
      {
        term: 'Variable de entorno',
        def: 'Un valor de configuración que vive fuera del código y que la app lee al arrancar. Se usan para guardar secretos (como las API keys) y para valores que cambian según el entorno (tu ordenador vs. el servidor).',
      },
      {
        term: 'Web scraping',
        def: 'Extraer información de una página web «leyéndola» automáticamente, cuando no hay una forma limpia (API o conector) de obtener esos datos. Es el comodín para sacar datos de webs; más frágil y técnico, último recurso.',
      },
      {
        term: 'Webhook',
        def: 'Una dirección (URL) que actúa como timbre: cuando ocurre algo en una app (llega un pago, se rellena un formulario), avisa automáticamente a otra para que reaccione al instante.',
      },
    ],
  },
  {
    id: 'negocio',
    n: '07',
    title: 'Negocio y producto',
    hint: 'el vocabulario del entorno',
    accent: 'var(--c-capability)',
    entries: [
      {
        term: 'AI-first',
        def: 'Diseñar un producto o una empresa poniendo la IA en el centro desde el principio, no como un añadido posterior. Hoy se ha vuelto también una forma de atraer usuarios.',
      },
      {
        term: 'KPI',
        def: 'Un indicador clave que mide si algo va bien o mal (ventas del mes, nuevos clientes…). La cifra en la que te fijas para decidir. (De Key Performance Indicator.)',
      },
      {
        term: 'MVP',
        def: 'La versión mínima de un producto: lo más sencillo que ya aporta valor y permite probar la idea con usuarios reales sin construirlo todo. (De Minimum Viable Product, producto mínimo viable.)',
      },
      {
        term: 'P&L',
        def: 'La cuenta de resultados: el resumen de ingresos, gastos y beneficio de un negocio en un periodo. Dice si ganas o pierdes dinero. (De Profit & Loss.)',
      },
      {
        term: 'Personal software',
        def: 'Pequeñas aplicaciones hechas a medida para resolver tu propio problema concreto, en lugar de comprar un programa genérico. La IA pone crearlas al alcance de cualquiera.',
      },
      {
        term: 'SaaS',
        def: 'Software que se usa por internet mediante suscripción, en lugar de comprarlo e instalarlo una vez. Por ejemplo, Notion o Spotify. (De Software as a Service.)',
      },
    ],
  },
];
