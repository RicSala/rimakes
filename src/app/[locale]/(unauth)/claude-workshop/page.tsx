import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Brain,
  Briefcase,
  CalendarDays,
  Check,
  FileText,
  type LucideIcon,
  Mail,
  MonitorPlay,
  Phone,
  PlugZap,
  Presentation,
  Quote,
  Rocket,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Terminal,
  User,
  Users,
  Wand2,
  Wrench,
  X,
  Zap,
} from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { buttonVariants } from '@/shared/components/ui/button';
import { routing } from '@/shared/internationalization/i18n/config';
import { cn } from '@/shared/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// Landing del taller — /claude-workshop. Bilingüe (COPY es/en), versión "venta
// directa": precio visible, contador de plazas, garantía, testimonios y llamada.
// PENDIENTE ANTES DE INDEXAR (hoy robots noindex): (1) Payment Link real de
// Stripe, (2) confirmar horario, (3) aprobar/sustituir los testimonios.
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ locale: Locale }>;
};

// ─────────────────────────────────────────────────────────────────────────────
// DATOS DE LA COHORTE — números y enlaces compartidos entre idiomas.
// Fechas, horario y precios viven en COPY (es/en): si los cambias, actualiza
// LOS DOS idiomas.
// ─────────────────────────────────────────────────────────────────────────────
const COHORT = {
  /** Plazas libres por cohorte — bájalas a mano según se vendan. */
  seatsLeft: {
    august: 9, // cohorte de agosto (en inglés) — la que vende la página EN
    september: 8, // cohorte de septiembre (en español) — la que vende la página ES
  },
  seatsTotal: 10,
  /** TODO: sustituir por el Payment Link real de Stripe antes de publicar. */
  stripeUrl: 'https://buy.stripe.com/REEMPLAZAR',
  /** TODO: crear en Cal.com un evento dedicado «Taller Claude — llamada de encaje (30 min)». */
  calUrl:
    'https://cal.com/ricardo-sala-mano7b/rimakes?overlayCalendar=true&layout=month_view',
  contactEmail: 'ricardo@rimakes.com',
};

/**
 * ⚠️ TESTIMONIOS: BORRADORES PENDIENTES DE APROBACIÓN — citas redactadas a
 * partir de los resultados reales de la Cohort 0, pero NO son palabras
 * textuales de nadie. Sustituir por los testimonios reales (aprobados por
 * cada persona) antes de publicar la página — en ambos idiomas.
 */
const COPY = {
  es: {
    meta: {
      title: 'Taller de Claude para profesionales no técnicos',
      description:
        'Cuatro semanas para pasar de usar la IA como un chat a delegarle trabajo de verdad. Curso en vídeo, 8h en grupo (máx. 10) y 4h individuales. Empezamos el 3 de septiembre.',
      ogLocale: 'es_ES',
    },
    mailSubject: 'Duda%20sobre%20el%20taller%20de%20Claude',
    price: '900 €',
    priceVat: '+ IVA',
    priceTotalLine:
      '1.089 € IVA incluido · factura para tu empresa (formación deducible)',
    futurePrice: '1.100 €',
    betaPriceLine: 'Precio de beta — subirá en las próximas ediciones',
    seatsLabel: `Quedan ${COHORT.seatsLeft.september} de ${COHORT.seatsTotal} plazas`,
    hero: {
      dateBadge: 'Cohorte de septiembre · empieza el jueves 3 de septiembre',
      h1: 'Deja de pedirle textos a la IA. Aprende a delegarle trabajo.',
      subPre:
        'Un taller en directo para profesionales no técnicos: pasa de usar la IA como un chat a ',
      subStrong: 'delegarle trabajo de verdad',
      subPost: ' — sin saber programar.',
      ctaSecondary: 'Ver el programa',
      chipPrice: '900 € + IVA, pago único',
      chipGuarantee: 'Si la primera sesión no es para ti, devolución del 100 %',
    },
    callButton: 'Reserva una llamada (30 min)',
    stats: [
      { value: '10', label: 'plazas por cohorte', icon: Users, highlight: true },
      { value: '8h', label: 'en grupo, en directo', icon: Presentation },
      { value: '4h', label: 'a solas contigo', icon: User },
      { value: '+5h', label: 'curso en vídeo', icon: MonitorPlay },
    ],
    empathy: {
      eyebrow: '¿Te suena?',
      title: 'Este taller nace de frases como estas',
      pains: [
        'Uso ChatGPT o Claude cada día… para redactar correos. Sé que ahí dentro hay mucho más, pero no sé llegar.',
        'No tengo tiempo para ponerme. Y menos para un curso grabado de 40 horas que no voy a terminar.',
        'No soy técnico. Los tutoriales asumen que sé programar y a la segunda pantalla me pierdo.',
        'Mi problema no es la herramienta: es que ni siquiera sé qué se le puede pedir.',
      ],
      closePre: 'Son frases (casi literales) de la primera edición. ',
      closeStrong:
        'Un mes después, cada uno tenía a Claude trabajando para él.',
      closePost:
        ' La diferencia no es talento técnico: son fundamentos bien puestos y alguien al lado las primeras veces.',
    },
    transformation: {
      eyebrow: 'La transformación',
      title: 'De dónde vienes, a dónde llegas',
      beforeTitle: 'Hoy',
      afterTitle: 'En cuatro semanas',
      before: [
        'La IA como chatbot: pides un texto, copias, pegas.',
        'Cada informe y tarea repetitiva sigue siendo tuya.',
        'No sabes qué se le puede pedir ni por dónde empezar.',
        '«Eso será para técnicos.»',
      ],
      after: [
        'La IA como equipo: le delegas y revisas el resultado.',
        'Informes y procesos recurrentes que se hacen solos.',
        'Sabes qué pedirle, cómo, y qué es posible.',
        '«Dame una hora y lo monto.»',
      ],
    },
    results: {
      eyebrow: 'La primera edición',
      title: 'Perfiles no técnicos, un mes: dos apps y dos sistemas',
      items: [
        {
          icon: Rocket,
          title: 'La semilla de su próximo negocio',
          body: 'Una plataforma (aún confidencial) para españoles recién mudados a EE. UU., llena de herramientas y guías. Empezó como ejercicio; hoy es su nuevo proyecto.',
        },
        {
          icon: Briefcase,
          title: 'Un CRM que trabaja como él',
          body: 'Consultor de automoción. Se construyó un CRM adaptado al 100 % a su forma de trabajar — algo que ningún software de mercado le daba.',
        },
        {
          icon: ShoppingCart,
          title: 'Su e-commerce, enchufado a Claude',
          body: 'Su tienda online, conectada por MCP a todas sus herramientas: trabaja con Claude con el negocio entero a la vista.',
        },
        {
          icon: FileText,
          title: 'Reporting que se hace solo',
          body: 'Los informes de dirección que hacía a mano cada mes ahora se montan solos sobre su Gmail, Calendar y Drive.',
        },
      ],
    },
    testimonials: {
      eyebrow: 'En sus palabras',
      title: 'Lo que dicen los que ya pasaron por aquí',
      items: [
        {
          quote:
            'Llegué sin tiempo y con cero ganas de nada técnico. Salí con el reporting de mi consejo montado sobre mi propio correo y calendario. Lo que más me sorprendió: no tuve que aprender a programar para nada de eso.',
          name: 'Humbert',
          role: 'Fundador, PdPaola',
        },
        {
          quote:
            'Yo hacía mi cuadro de KPIs a mano en Excel todos los meses. Ahora se hace solo. Solo por eso el taller ya está pagado.',
          name: 'Salva',
          role: 'CEO de varias compañías',
        },
        {
          quote:
            'Mi miedo era no saber ni qué pedirle a la IA. Acabé con una app funcionando que resuelve un problema real de un cliente. Todavía me cuesta creérmelo.',
          name: 'Jordi',
          role: 'Diseñador de marca',
        },
        {
          quote:
            'Pensaba que sin saber leer código esto no era para mí. Las sesiones individuales marcan la diferencia: sales con tu caso resuelto, no con teoría.',
          name: 'Guillem',
          role: 'Consultor de estrategia',
        },
      ],
    },
    midCta: {
      line: '¿Te ves en estas historias? Hablemos 30 minutos y lo comprobamos.',
      sub: `Sin compromiso · quedan ${COHORT.seatsLeft.september} de ${COHORT.seatsTotal} plazas`,
    },
    method: {
      eyebrow: 'Metodología',
      title: 'Cómo funciona',
      intro:
        'No es un curso ni una masterclass para cientos de personas. Es un taller: grupo pequeño, trabajo en directo y tu proyecto real como material.',
      steps: [
        {
          icon: Phone,
          title: 'Llamada previa individual (30 min)',
          body: 'Hablamos tú y yo antes de empezar: qué haces, qué te frena, qué quieres conseguir. Con eso adapto el contenido al grupo.',
        },
        {
          icon: MonitorPlay,
          title: 'Curso troncal en vídeo (+5 horas)',
          body: 'Los fundamentos, en vídeo y tuyos para siempre: a tu ritmo, y los repasas cuando quieras.',
        },
        {
          icon: Users,
          title: 'Cuatro sesiones en grupo (8 horas)',
          body: 'En directo por Zoom, con las slides sincronizadas en tu pantalla. Aquí va la parte más compleja — y la implementamos juntos, en el momento.',
        },
        {
          icon: User,
          title: 'Dos sesiones individuales (4 horas)',
          body: 'A solas contigo. Sin temario: tu proyecto, tu flujo de trabajo y tus dudas.',
        },
        {
          icon: BookOpen,
          title: 'Material y repaso a tu ritmo',
          body: 'Deck de repaso y seis recursos de referencia, con acceso a la plataforma también después del curso — incluido el material de las próximas ediciones, sin coste adicional.',
        },
      ],
    },
    program: {
      eyebrow: 'Contenido',
      title: 'Qué recorremos',
      introPre: 'Del primer contacto con Claude a ',
      introStrong: 'tu propio sistema de trabajo con IA',
      introPost:
        ' — incluida, si tu caso lo pide, tu primera herramienta a medida.',
      modules: [
        { icon: Sparkles, title: 'Primer contacto con Claude' },
        { icon: Wand2, title: 'Personaliza tu Claude' },
        { icon: PlugZap, title: 'Conectando a Claude' },
        { icon: Zap, title: 'Trabajo remoto y automático' },
        { icon: Boxes, title: 'Tus primeras herramientas' },
        { icon: Brain, title: 'La memoria de Claude' },
        { icon: Terminal, title: 'Nos pasamos a la terminal' },
        { icon: Wrench, title: 'Fundamentos de las apps' },
        { icon: Rocket, title: 'Creando una app juntos' },
      ],
      note: 'El detalle de cada módulo y su reparto entre sesiones se ajustan a cada cohorte: el programa se adapta a los proyectos del grupo, no al revés.',
    },
    bio: {
      eyebrow: 'Quién te acompaña',
      title: 'Hola, soy Ricardo',
      p1: 'Vengo del mundo de la empresa: negocio y finanzas. Hace tres años decidí aprender a programar y desde entonces trabajo con IA a diario — desde el primer Copilot hasta Claude Code. Esta web y las slides sincronizadas del taller están hechas así: yo más Claude.',
      p2: 'He estado en los dos lados: sé lo que es mirar lo técnico desde fuera y pensar «esto no es para mí». Por eso el grupo es pequeño — lo que más disfruto es el momento en que alguien «de letras» pone la IA a trabajar.',
      p3: 'El taller lo doy yo, de principio a fin.',
      blogLink: 'Lee mi blog',
      appsLink: 'Mira lo que construyo',
    },
    editions: {
      eyebrow: 'Ediciones',
      title: `Cohortes de ${COHORT.seatsTotal} plazas — y el precio va subiendo`,
      srFuturePrice: 'Precio de la próxima edición: ',
      july: { month: 'Julio 2026', flag: '🇪🇸', soldOut: 'Agotado' },
      august: {
        month: 'Agosto 2026',
        flag: '🇬🇧',
        seats: `Quedan ${COHORT.seatsLeft.august} de ${COHORT.seatsTotal}`,
        highlight: false,
      },
      september: {
        month: 'Septiembre 2026',
        flag: '🇪🇸',
        seats: `Quedan ${COHORT.seatsLeft.september} de ${COHORT.seatsTotal}`,
        highlight: true,
      },
      october: { month: 'Octubre 2026' },
      crossPre: '¿Prefieres hacerlo en inglés? ',
      crossLink: 'La cohorte de agosto se imparte en inglés',
    },
    priceSection: {
      eyebrow: 'La inversión',
      title: 'Una plaza, todo incluido',
      intro:
        'Las cuatro horas individuales, por sí solas, ya equivalen a una consultoría privada sobre tu caso.',
      cardEyebrow: 'Cohorte de septiembre',
      included: [
        'Llamada previa individual de 30 min para encuadrar tu caso',
        'Curso troncal en vídeo (+5 horas) para repasar cuando quieras',
        '4 sesiones en grupo — 8 horas en directo (3, 10, 17 y 24 de septiembre)',
        '2 sesiones individuales — 4 horas solo tú, yo y tu proyecto',
        'Deck de repaso + 6 recursos, con acceso también después del curso',
        'Material de las próximas ediciones incluido, sin coste adicional',
        `Grupo de ${COHORT.seatsTotal} personas como máximo`,
      ],
      schedule: 'Jueves, de 12:00 a 14:00 (hora peninsular)',
      callSub:
        'Sin compromiso: vemos tu caso y te digo, honestamente, si el taller te va a servir.',
      directPayPre: '¿Lo tienes claro? ',
      directPayLink: 'Reserva tu plaza directamente',
      directPayPost: ' — pago único y seguro por Stripe.',
      guaranteeLabel: 'Garantía de primera sesión:',
      guaranteeText:
        ' asiste a la primera sesión y, si no es para ti, te devuelvo el 100 % — sin preguntas y sin letra pequeña. Tu único riesgo real es quedarte sin plaza.',
    },
    notForYou: {
      eyebrow: 'Seamos claros',
      title: 'Este taller no es para ti si…',
      items: [
        'Buscas solo un curso grabado para ver «algún día». Aquí los vídeos son la base: lo importante pasa en directo, con fechas y con deberes.',
        'No puedes dedicarle unas 4–6 horas semanales durante un mes.',
        'Ya trabajas a diario con Claude Code y la terminal: se te quedará corto (escríbeme y te oriento hacia otra cosa).',
        'Esperas que la IA lo haga todo sola. Vas a aprender a dirigirla — y eso no sustituye tu criterio.',
      ],
    },
    faq: {
      eyebrow: 'Preguntas frecuentes',
      title: 'Lo que suelen preguntarme',
      items: [
        {
          q: 'No soy nada técnico. ¿De verdad es para mí?',
          a: 'Sí — es justo para ti. En la primera edición nadie sabía programar: un fundador de una marca de joyería, un CEO, un diseñador, dos consultores. Se asume cero técnica, y la llamada previa más las sesiones individuales ajustan el nivel a tu caso.',
        },
        {
          q: '¿Cuánto tiempo me va a llevar?',
          a: 'Entre vídeos, sesiones en directo y práctica, calcula unas 4–6 horas a la semana durante un mes. Si una semana no llegas, las individuales sirven para recuperar el ritmo.',
        },
        {
          q: '¿Qué necesito para empezar?',
          a: 'Un ordenador (Mac o Windows) y una suscripción a Claude (desde unos 20 €/mes; si no la tienes, la configuramos juntos al empezar). Nada más.',
        },
        {
          q: '¿Y si no puedo asistir a una sesión?',
          a: 'Los fundamentos quedan en el curso en vídeo y el material de repaso está disponible desde el primer día; en tu sesión individual nos ponemos al día con lo que te hayas perdido.',
        },
        {
          q: '¿Cómo funciona la garantía de devolución?',
          a: 'Asiste a la primera sesión completa. Si al terminarla decides que no es para ti, me escribes y te devuelvo el 100 % del importe — sin preguntas. Solo te pido que lo decidas antes de la segunda sesión.',
        },
        {
          q: '¿Cómo reservo mi plaza?',
          a: 'Reserva una llamada de 30 min: vemos tu caso y, si encajamos, te mando el enlace de pago y quedas dentro. Si ya lo tienes claro, puedes reservar directamente desde el bloque de precio.',
        },
        {
          q: '¿En qué idioma es el taller?',
          a: 'La cohorte de septiembre se imparte en español. ¿Prefieres inglés? La edición de agosto es en inglés — mismo programa y mismo precio.',
        },
        {
          q: '¿Puedo pagarlo como empresa?',
          a: 'Sí. Recibirás factura con el IVA desglosado, y la formación es un gasto deducible para tu empresa.',
        },
        {
          q: '¿Por qué solo 10 plazas?',
          a: 'Porque el formato no escala: 4 horas individuales por persona y ejercicios corregidos en directo. Con más de diez dejaría de ser lo que es.',
        },
        {
          q: '¿En qué se diferencia de un curso online al uso?',
          a: 'Un curso grabado te deja solo frente a los vídeos. Aquí es al revés: los fundamentos van en vídeo precisamente para que las 12 horas en directo se dediquen a aplicar sobre tu proyecto real. Sales con la herramienta trabajando para ti.',
        },
      ],
    },
    closing: {
      title: 'Empezamos el jueves 3 de septiembre',
      body: 'Si has pensado en ese informe que haces a mano cada mes o en ese «yo no soy técnico», es justo lo que resolvemos en cuatro semanas. Esta es la última edición a precio de beta: la de octubre ya costará 1.100 € + IVA.',
      mailButton: 'Escríbeme',
      sub: `Quedan ${COHORT.seatsLeft.september} de ${COHORT.seatsTotal} plazas · precio de beta (subirá en próximas ediciones) · si la primera sesión no es para ti, devolución del 100 %.`,
    },
    attendees: {
      question: '¿Ya eres asistente?',
      link: 'Accede al material',
    },
  },
  en: {
    meta: {
      title: 'Claude Workshop for Non-Technical Professionals',
      description:
        'Four weeks to go from using AI as a chat to delegating real work to it. Video course, 8h of live group sessions (max 10) and 4h one-on-one. Starts August 6. Taught in English.',
      ogLocale: 'en_US',
    },
    mailSubject: 'Question%20about%20the%20Claude%20workshop',
    price: '€900',
    priceVat: '+ VAT',
    priceTotalLine:
      '€1,089 VAT included · invoice for your company (tax-deductible training)',
    futurePrice: '€1,100',
    betaPriceLine: 'Beta price — it will go up in future editions',
    seatsLabel: `${COHORT.seatsLeft.august} of ${COHORT.seatsTotal} seats left`,
    hero: {
      dateBadge: 'August cohort, in English · starts Thursday, August 6',
      h1: 'Stop asking AI for text. Learn to delegate real work.',
      subPre:
        'A live workshop for non-technical professionals: go from using AI as a chatbot to ',
      subStrong: 'delegating real work to it',
      subPost: ' — no coding required.',
      ctaSecondary: 'See the program',
      chipPrice: '€900 + VAT, one-time payment',
      chipGuarantee: 'Full refund if the first session is not for you',
    },
    callButton: 'Book a call (30 min)',
    stats: [
      { value: '10', label: 'seats per cohort', icon: Users, highlight: true },
      { value: '8h', label: 'live, in group', icon: Presentation },
      { value: '4h', label: 'one-on-one with me', icon: User },
      { value: '+5h', label: 'video course', icon: MonitorPlay },
    ],
    empathy: {
      eyebrow: 'Sound familiar?',
      title: 'This workshop was born from lines like these',
      pains: [
        'I use ChatGPT or Claude every day… to draft emails. I know there is much more in there, but I cannot get to it.',
        'I have no time to sit down with it. Let alone a 40-hour recorded course I will never finish.',
        'I am not technical. Tutorials assume I can code, and by the second screen I am lost.',
        'My problem is not the tool: I do not even know what you can ask it for.',
      ],
      closePre:
        'These are (almost verbatim) from the first edition of the workshop. ',
      closeStrong: 'A month later, each of them had Claude working for them.',
      closePost:
        ' The difference is not technical talent: it is solid fundamentals and someone by your side the first few times.',
    },
    transformation: {
      eyebrow: 'The transformation',
      title: 'Where you start, where you land',
      beforeTitle: 'Today',
      afterTitle: 'In four weeks',
      before: [
        'AI as a chatbot: you ask for text, copy, paste.',
        'Every report and repetitive task is still yours.',
        'You do not know what to ask for or where to start.',
        '“That must be for technical people.”',
      ],
      after: [
        'AI as a team: you delegate and review the result.',
        'Reports and recurring processes that run themselves.',
        'You know what to ask for, how, and what is possible.',
        '“Give me an hour and I will build it.”',
      ],
    },
    results: {
      eyebrow: 'The first edition',
      title: 'Non-technical profiles, one month: two apps and two systems',
      items: [
        {
          icon: Rocket,
          title: 'The seed of his next business',
          body: 'A (still confidential) platform for Spaniards who just moved to the US, packed with tools and guides. It started as an exercise; today it is his new project.',
        },
        {
          icon: Briefcase,
          title: 'A CRM that works like he does',
          body: 'An automotive-sector consultant. He built himself a CRM 100% adapted to how he works — something no off-the-shelf software gave him.',
        },
        {
          icon: ShoppingCart,
          title: 'His e-commerce, plugged into Claude',
          body: 'His online store, connected via MCP to all his tools: he works with Claude with the whole business in view.',
        },
        {
          icon: FileText,
          title: 'Reporting that writes itself',
          body: 'The management reports he used to build by hand every month now assemble themselves from his Gmail, Calendar and Drive.',
        },
      ],
    },
    testimonials: {
      eyebrow: 'In their words',
      title: 'What past participants say',
      items: [
        {
          quote:
            'I arrived with no time and zero appetite for anything technical. I left with my board reporting running on my own email and calendar. What surprised me most: I did not have to learn to code for any of it.',
          name: 'Humbert',
          role: 'Founder, PdPaola',
        },
        {
          quote:
            'I used to build my KPI dashboard by hand in Excel every month. Now it builds itself. That alone paid for the workshop.',
          name: 'Salva',
          role: 'CEO of several companies',
        },
        {
          quote:
            'My fear was not even knowing what to ask AI for. I ended up with a working app that solves a real client problem. I still can hardly believe it.',
          name: 'Jordi',
          role: 'Brand designer',
        },
        {
          quote:
            'I thought that without being able to read code this was not for me. The one-on-one sessions make the difference: you leave with your case solved, not with theory.',
          name: 'Guillem',
          role: 'Strategy consultant',
        },
      ],
    },
    midCta: {
      line: 'See yourself in these stories? Let’s talk for 30 minutes and find out.',
      sub: `No strings attached · ${COHORT.seatsLeft.august} of ${COHORT.seatsTotal} seats left`,
    },
    method: {
      eyebrow: 'Method',
      title: 'How it works',
      intro:
        'This is not a course or a masterclass for hundreds of people. It is a workshop: small group, live work, and your real project as the material.',
      steps: [
        {
          icon: Phone,
          title: 'Individual pre-call (30 min)',
          body: 'You and I talk before we start: what you do, what holds you back, what you want to achieve. I use it to adapt the content to the group.',
        },
        {
          icon: MonitorPlay,
          title: 'Core video course (+5 hours)',
          body: 'The fundamentals, on video and yours forever: at your own pace, to review whenever you want.',
        },
        {
          icon: Users,
          title: 'Four group sessions (8 hours)',
          body: 'Live on Zoom, with the slides synced on your screen. This is where the hardest parts go — and we implement them together, on the spot.',
        },
        {
          icon: User,
          title: 'Two individual sessions (4 hours)',
          body: 'Just you and me. No syllabus: your project, your workflow, your questions.',
        },
        {
          icon: BookOpen,
          title: 'Materials and review at your pace',
          body: 'Review deck and six reference resources, with platform access after the course too — including the material from future editions, at no extra cost.',
        },
      ],
    },
    program: {
      eyebrow: 'Content',
      title: 'What we cover',
      introPre: 'From your first conversation with Claude to ',
      introStrong: 'your own AI-powered way of working',
      introPost:
        ' — including, if your case calls for it, your first custom tool.',
      modules: [
        { icon: Sparkles, title: 'First contact with Claude' },
        { icon: Wand2, title: 'Personalize your Claude' },
        { icon: PlugZap, title: 'Connecting Claude' },
        { icon: Zap, title: 'Remote & automated work' },
        { icon: Boxes, title: 'Your first tools' },
        { icon: Brain, title: 'Claude’s memory' },
        { icon: Terminal, title: 'Moving to the terminal' },
        { icon: Wrench, title: 'App fundamentals' },
        { icon: Rocket, title: 'Building an app together' },
      ],
      note: 'The detail of each module and how they split across sessions adjusts to each cohort: the program adapts to the group’s projects, not the other way around.',
    },
    bio: {
      eyebrow: 'Who you will work with',
      title: 'Hi, I’m Ricardo',
      p1: 'I come from the business world: management and finance. Three years ago I decided to learn to code, and I have worked with AI every day since — from the first Copilot to Claude Code. This website and the workshop’s synced slides are built that way: me plus Claude.',
      p2: 'I have been on both sides: I know what it is like to look at the technical world from the outside and think “this is not for me”. That is why the group is small — what I enjoy most is the moment a “non-technical” person puts AI to work.',
      p3: 'I teach the workshop myself, start to finish.',
      blogLink: 'Read my blog',
      appsLink: 'See what I build',
    },
    editions: {
      eyebrow: 'Editions',
      title: `Cohorts of ${COHORT.seatsTotal} seats — and the price keeps going up`,
      srFuturePrice: 'Next edition’s price: ',
      july: { month: 'July 2026', flag: '🇪🇸', soldOut: 'Sold out' },
      august: {
        month: 'August 2026',
        flag: '🇬🇧',
        seats: `${COHORT.seatsLeft.august} of ${COHORT.seatsTotal} left`,
        highlight: true,
      },
      september: {
        month: 'September 2026',
        flag: '🇪🇸',
        seats: `${COHORT.seatsLeft.september} of ${COHORT.seatsTotal} left`,
        highlight: false,
      },
      october: { month: 'October 2026' },
      crossPre: 'Prefer Spanish? ',
      crossLink: 'The September cohort is taught in Spanish',
    },
    priceSection: {
      eyebrow: 'The investment',
      title: 'One seat, everything included',
      intro:
        'The four one-on-one hours alone are the equivalent of private consulting on your case.',
      cardEyebrow: 'August cohort',
      included: [
        'Individual 30-min pre-call to frame your case',
        'Core video course (+5 hours) to review whenever you want',
        '4 group sessions — 8 live hours (August 6, 13, 20 & 27)',
        '2 individual sessions — 4 hours: just you, me and your project',
        'Review deck + 6 resources, with access after the course too',
        'Material from future editions included, at no extra cost',
        `A group of ${COHORT.seatsTotal} people, maximum`,
      ],
      // TODO: confirmar el horario definitivo de la cohorte en inglés.
      schedule: 'Thursdays, 12:00–14:00 (Madrid time, CET)',
      callSub:
        'No strings attached: we look at your case and I tell you, honestly, whether the workshop will help you.',
      directPayPre: 'Already sure? ',
      directPayLink: 'Book your seat directly',
      directPayPost: ' — one-time, secure payment via Stripe.',
      guaranteeLabel: 'First-session guarantee:',
      guaranteeText:
        ' attend the first session and, if it is not for you, I refund 100% — no questions, no fine print. Your only real risk is missing out on a seat.',
    },
    notForYou: {
      eyebrow: 'Let’s be clear',
      title: 'This workshop is not for you if…',
      items: [
        'You just want a recorded course to watch “someday”. Here the videos are the foundation: the important part happens live, with dates and homework.',
        'You cannot put in about 4–6 hours a week for a month.',
        'You already work with Claude Code and the terminal every day: it will fall short (write me and I will point you somewhere better).',
        'You expect AI to do everything on its own. You are going to learn to direct it — and that does not replace your judgment.',
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'What people usually ask',
      items: [
        {
          q: 'What language is the workshop in?',
          a: 'The August cohort is taught in English — live sessions and one-on-ones included. There is also a Spanish cohort in September: same program, same price. Pick the language you think in.',
        },
        {
          q: 'I am not technical at all. Is this really for me?',
          a: 'Yes — it is precisely for you. Nobody in the first edition could code: the founder of a jewelry brand, a CEO, a designer, two consultants. Zero technical knowledge is assumed, and the pre-call plus the one-on-one sessions tune the level to your case.',
        },
        {
          q: 'How much time will it take me?',
          a: 'Between the videos, the live sessions and practice, plan on 4–6 hours a week for a month. If you fall behind one week, the one-on-ones help you catch up.',
        },
        {
          q: 'What do I need to start?',
          a: 'A computer (Mac or Windows) and a Claude subscription (from about €20/month; if you do not have one, we set it up together at the start). Nothing else.',
        },
        {
          q: 'What if I cannot attend a session?',
          a: 'The fundamentals live in the video course and the materials are available from day one; in your individual session we catch up on whatever you missed.',
        },
        {
          q: 'How does the refund guarantee work?',
          a: 'Attend the full first session. If you decide it is not for you, write me and I refund 100% — no questions. I only ask that you decide before the second session.',
        },
        {
          q: 'How do I book my seat?',
          a: 'Book a 30-minute call: we look at your case and, if we are a fit, I send you the payment link and you are in. Already sure? You can book directly from the pricing section.',
        },
        {
          q: 'Can my company pay for it?',
          a: 'Yes. You will receive an invoice with VAT itemized, and training is a tax-deductible expense for your company.',
        },
        {
          q: 'Why only 10 seats?',
          a: 'Because the format does not scale: 4 one-on-one hours per person and exercises corrected live. With more than ten it would stop being what it is.',
        },
        {
          q: 'How is this different from a regular online course?',
          a: 'A recorded course leaves you alone with the videos. Here it is the opposite: the fundamentals go on video precisely so the 12 live hours are spent applying everything to your real project. You leave with the tool working for you.',
        },
      ],
    },
    closing: {
      title: 'We start Thursday, August 6',
      body: 'If this made you think of that report you still build by hand every month, or of that “I am not technical”… that is exactly what we fix in four weeks. This is one of the last seats at beta price: October will cost €1,100 + VAT.',
      mailButton: 'Write me',
      sub: `${COHORT.seatsLeft.august} of ${COHORT.seatsTotal} seats left · beta price (going up next edition) · full refund if the first session is not for you.`,
    },
    attendees: {
      question: 'Already an attendee?',
      link: 'Access the materials',
    },
  },
};

function copyFor(locale: Locale) {
  return locale === 'en' ? COPY.en : COPY.es;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = copyFor(locale);
  return {
    title: t.meta.title,
    description: t.meta.description,
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      type: 'website',
      locale: t.meta.ogLocale,
    },
    // Borrador en revisión: que no lo indexen los buscadores.
    robots: { index: false, follow: false },
  };
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className='flex flex-col gap-1'>
      <span className='text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400'>
        {eyebrow}
      </span>
      <h2 className='text-2xl font-bold tracking-tight sm:text-3xl'>{title}</h2>
    </div>
  );
}

function IconChip({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400'>
      <Icon className='size-5' />
    </div>
  );
}

function SeatsBadge({ label }: { label: string }) {
  return (
    <span className='inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-300/70 bg-amber-100/60 px-3 py-1 text-xs font-medium text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300'>
      {label}
    </span>
  );
}

function BookCallButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <a
      href={COHORT.calUrl}
      target='_blank'
      rel='noopener noreferrer'
      className={cn(
        buttonVariants({ size: 'lg' }),
        'w-full gap-2 bg-indigo-600 text-white hover:bg-indigo-500 sm:w-auto',
        className
      )}
    >
      <Phone className='size-4' />
      {label}
    </a>
  );
}

export default async function ClaudeWorkshopPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = copyFor(locale);

  // Locale-aware paths (localePrefix is "as-needed": no prefix for the default
  // locale, so we must not emit "/es/…").
  const withLocale = (path: string) =>
    locale === routing.defaultLocale ? path : `/${locale}${path}`;

  const materialHref = withLocale('/training');
  const blogHref = withLocale('/blog');
  const appsHref = withLocale('/my-apps');
  const mailHref = `mailto:${COHORT.contactEmail}?subject=${t.mailSubject}`;

  // Enlace a esta misma landing en el otro idioma (para la cohorte alterna).
  const otherLocale = locale === 'en' ? 'es' : 'en';
  const otherLocaleHref =
    otherLocale === routing.defaultLocale
      ? '/claude-workshop'
      : `/${otherLocale}/claude-workshop`;

  return (
    <div className='flex flex-col gap-20'>
      {/* Hero */}
      <header className='flex flex-col gap-5'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='inline-flex w-fit items-center gap-1.5 rounded-full bg-indigo-600/10 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300'>
            <CalendarDays className='size-3.5' />
            {t.hero.dateBadge}
          </span>
          <SeatsBadge label={t.seatsLabel} />
        </div>
        <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
          {t.hero.h1}
        </h1>
        <p className='text-lg text-muted-foreground'>
          {t.hero.subPre}
          <strong className='font-semibold text-foreground'>
            {t.hero.subStrong}
          </strong>
          {t.hero.subPost}
        </p>
        <div className='flex flex-wrap items-center gap-3'>
          <BookCallButton label={t.callButton} />
          <Link
            href='#programa'
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'w-full sm:w-auto'
            )}
          >
            {t.hero.ctaSecondary}
          </Link>
        </div>
        <p className='flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground'>
          <span className='inline-flex items-center gap-1.5'>
            <Check className='size-4 text-emerald-600 dark:text-emerald-400' />
            {t.hero.chipPrice}
          </span>
          <span className='inline-flex items-center gap-1.5'>
            <ShieldCheck className='size-4 text-emerald-600 dark:text-emerald-400' />
            {t.hero.chipGuarantee}
          </span>
        </p>
      </header>

      {/* Format at a glance */}
      <section className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
        {t.stats.map(({ value, label, icon: Icon, highlight }) => (
          <div
            key={label}
            className={cn(
              'flex flex-col gap-1 rounded-xl border p-4',
              highlight
                ? 'border-indigo-500/50 bg-indigo-600/5'
                : 'border-border bg-card'
            )}
          >
            <Icon className='size-5 text-indigo-600 dark:text-indigo-400' />
            <span className='mt-1 text-2xl font-bold leading-none'>
              {value}
            </span>
            <span className='text-sm text-muted-foreground'>{label}</span>
          </div>
        ))}
      </section>

      {/* Empathy — the reader's own words */}
      <section className='flex flex-col gap-6'>
        <SectionHeader eyebrow={t.empathy.eyebrow} title={t.empathy.title} />
        <div className='grid gap-4 sm:grid-cols-2'>
          {t.empathy.pains.map((pain) => (
            <div
              key={pain}
              className='flex gap-3 rounded-xl border border-border bg-card p-4'
            >
              <Quote className='size-4 shrink-0 rotate-180 text-indigo-600 dark:text-indigo-400' />
              <p className='text-sm text-muted-foreground'>{pain}</p>
            </div>
          ))}
        </div>
        <p className='text-muted-foreground'>
          {t.empathy.closePre}
          <strong className='font-semibold text-foreground'>
            {t.empathy.closeStrong}
          </strong>
          {t.empathy.closePost}
        </p>
      </section>

      {/* Transformation — before / after */}
      <section className='flex flex-col gap-6'>
        <SectionHeader
          eyebrow={t.transformation.eyebrow}
          title={t.transformation.title}
        />
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='flex flex-col gap-3 rounded-xl border border-border bg-card p-5'>
            <h3 className='font-semibold text-muted-foreground'>
              {t.transformation.beforeTitle}
            </h3>
            <ul className='flex flex-col gap-2.5'>
              {t.transformation.before.map((item) => (
                <li
                  key={item}
                  className='flex gap-2 text-sm text-muted-foreground'
                >
                  <X className='mt-0.5 size-4 shrink-0' />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className='flex flex-col gap-3 rounded-xl border border-emerald-300/60 bg-emerald-50/60 p-5 dark:border-emerald-900 dark:bg-emerald-950/30'>
            <h3 className='font-semibold'>{t.transformation.afterTitle}</h3>
            <ul className='flex flex-col gap-2.5'>
              {t.transformation.after.map((item) => (
                <li key={item} className='flex gap-2 text-sm'>
                  <Check className='mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400' />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Real results from Cohort 0 */}
      <section className='flex flex-col gap-6'>
        <SectionHeader eyebrow={t.results.eyebrow} title={t.results.title} />
        <div className='grid gap-4 sm:grid-cols-2'>
          {t.results.items.map(({ title, body, icon: Icon }) => (
            <div
              key={title}
              className='flex gap-4 rounded-xl border border-border bg-card p-5'
            >
              <IconChip icon={Icon} />
              <div className='flex flex-col gap-1'>
                <h3 className='font-semibold'>{title}</h3>
                <p className='text-sm text-muted-foreground'>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className='flex flex-col gap-6'>
        <SectionHeader
          eyebrow={t.testimonials.eyebrow}
          title={t.testimonials.title}
        />
        <div className='grid gap-4 sm:grid-cols-2'>
          {t.testimonials.items.map(({ quote, name, role }) => (
            <figure
              key={name}
              className='flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5'
            >
              <blockquote className='text-sm leading-relaxed'>
                «{quote}»
              </blockquote>
              <figcaption className='flex items-center gap-3'>
                <div className='flex size-9 items-center justify-center rounded-full bg-indigo-600/10 text-sm font-semibold text-indigo-600 dark:text-indigo-400'>
                  {name.charAt(0)}
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm font-semibold'>{name}</span>
                  <span className='text-xs text-muted-foreground'>{role}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Mid-page CTA — right after the social proof peak */}
      <section className='flex flex-col items-center gap-3 rounded-2xl bg-indigo-600/5 p-6 text-center sm:p-8'>
        <p className='font-medium'>{t.midCta.line}</p>
        <BookCallButton label={t.callButton} />
        <p className='text-xs text-muted-foreground'>{t.midCta.sub}</p>
      </section>

      {/* Format */}
      <section className='flex flex-col gap-6'>
        <SectionHeader eyebrow={t.method.eyebrow} title={t.method.title} />
        <p className='text-muted-foreground'>{t.method.intro}</p>
        <div className='flex flex-col gap-4'>
          {t.method.steps.map(({ title, body, icon: Icon }, i) => (
            <div
              key={title}
              className='flex gap-4 rounded-xl border border-border bg-card p-5'
            >
              <IconChip icon={Icon} />
              <div className='flex flex-col gap-1'>
                <h3 className='flex items-center gap-2 font-semibold'>
                  <span className='text-sm text-muted-foreground'>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {title}
                </h3>
                <p className='text-sm text-muted-foreground'>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Program */}
      <section id='programa' className='flex scroll-mt-24 flex-col gap-6'>
        <SectionHeader eyebrow={t.program.eyebrow} title={t.program.title} />
        <p className='text-muted-foreground'>
          {t.program.introPre}
          <strong className='font-semibold text-foreground'>
            {t.program.introStrong}
          </strong>
          {t.program.introPost}
        </p>
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
          {t.program.modules.map(({ title, icon: Icon }) => (
            <div
              key={title}
              className='flex items-center gap-3 rounded-xl border border-border bg-card p-4'
            >
              <div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400'>
                <Icon className='size-4' />
              </div>
              <span className='text-sm font-medium'>{title}</span>
            </div>
          ))}
        </div>
        <p className='text-sm text-muted-foreground'>{t.program.note}</p>
      </section>

      {/* Who am I */}
      <section className='flex flex-col gap-6'>
        <SectionHeader eyebrow={t.bio.eyebrow} title={t.bio.title} />
        <div className='flex flex-col gap-6 sm:flex-row'>
          <Image
            src='/images/personal/me.jpeg'
            alt='Ricardo Sala'
            width={176}
            height={176}
            className='size-44 shrink-0 rounded-2xl object-cover'
          />
          <div className='flex flex-col gap-3 text-muted-foreground'>
            <p>{t.bio.p1}</p>
            <p>{t.bio.p2}</p>
            <p className='font-medium text-foreground'>{t.bio.p3}</p>
            <div className='flex flex-wrap gap-4 text-sm'>
              <Link
                href={blogHref}
                className='inline-flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400'
              >
                {t.bio.blogLink} <ArrowRight className='size-3.5' />
              </Link>
              <Link
                href={appsHref}
                className='inline-flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400'
              >
                {t.bio.appsLink} <ArrowRight className='size-3.5' />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Editions grid — track record + honest price anchor */}
      <section className='flex flex-col gap-6'>
        <SectionHeader eyebrow={t.editions.eyebrow} title={t.editions.title} />
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='flex flex-col justify-between gap-6 rounded-xl border border-border bg-card p-5'>
            <div className='flex items-start justify-between gap-2'>
              <span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                {t.editions.july.month}
              </span>
              <span className='text-base leading-none'>
                {t.editions.july.flag}
              </span>
            </div>
            <span className='text-2xl font-bold tracking-tight text-muted-foreground'>
              {t.editions.july.soldOut}
            </span>
          </div>
          {[t.editions.august, t.editions.september].map((edition) => (
            <div
              key={edition.month}
              className={cn(
                'flex flex-col justify-between gap-6 rounded-xl p-5',
                edition.highlight
                  ? 'border-2 border-indigo-500/60 bg-indigo-600/5 dark:border-indigo-500/40'
                  : 'border border-border bg-card'
              )}
            >
              <div className='flex items-start justify-between gap-2'>
                <div className='flex flex-col gap-1'>
                  <span
                    className={cn(
                      'text-xs font-semibold uppercase tracking-wide',
                      edition.highlight
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-muted-foreground'
                    )}
                  >
                    {edition.month}
                  </span>
                  <span className='text-xs font-medium text-amber-700 dark:text-amber-400'>
                    {edition.seats}
                  </span>
                </div>
                <span className='text-base leading-none'>{edition.flag}</span>
              </div>
              <span className='flex flex-wrap items-baseline gap-x-2'>
                <s className='text-base font-medium text-muted-foreground'>
                  <span className='sr-only'>{t.editions.srFuturePrice}</span>
                  {t.futurePrice}
                </s>
                <span className='text-2xl font-bold tracking-tight'>
                  {t.price}
                </span>
                <span className='text-sm text-muted-foreground'>
                  {t.priceVat}
                </span>
              </span>
            </div>
          ))}
          <div className='flex flex-col justify-between gap-6 rounded-xl border border-dashed border-border p-5'>
            <span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
              {t.editions.october.month}
            </span>
            <span className='flex flex-wrap items-baseline gap-x-2 text-muted-foreground'>
              <span className='text-2xl font-bold tracking-tight'>
                {t.futurePrice}
              </span>
              <span className='text-sm'>{t.priceVat}</span>
            </span>
          </div>
        </div>
        <p className='text-sm text-muted-foreground'>
          {t.editions.crossPre}
          <Link
            href={otherLocaleHref}
            className='font-medium text-indigo-600 hover:underline dark:text-indigo-400'
          >
            {t.editions.crossLink}
          </Link>
        </p>
      </section>

      {/* Price */}
      <section id='precio' className='flex scroll-mt-24 flex-col gap-6'>
        <SectionHeader
          eyebrow={t.priceSection.eyebrow}
          title={t.priceSection.title}
        />
        <p className='text-muted-foreground'>{t.priceSection.intro}</p>
        <div className='flex flex-col overflow-hidden rounded-2xl border border-indigo-300/60 dark:border-indigo-900'>
          <div className='flex flex-col gap-6 bg-card p-8'>
            <div className='flex flex-wrap items-end justify-between gap-4'>
              <div className='flex flex-col gap-1'>
                <span className='text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400'>
                  {t.priceSection.cardEyebrow}
                </span>
                <div className='flex items-baseline gap-2'>
                  <span className='text-4xl font-bold tracking-tight'>
                    {t.price}
                  </span>
                  <span className='text-muted-foreground'>{t.priceVat}</span>
                </div>
                <span className='text-xs text-muted-foreground'>
                  {t.priceTotalLine}
                </span>
                <span className='text-xs font-medium text-amber-700 dark:text-amber-400'>
                  {t.betaPriceLine}
                </span>
              </div>
              <SeatsBadge label={t.seatsLabel} />
            </div>
            <ul className='flex flex-col gap-2.5'>
              {t.priceSection.included.map((item) => (
                <li key={item} className='flex gap-2 text-sm'>
                  <Check className='mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400' />
                  {item}
                </li>
              ))}
              <li className='flex gap-2 text-sm text-muted-foreground'>
                <CalendarDays className='mt-0.5 size-4 shrink-0' />
                {t.priceSection.schedule}
              </li>
            </ul>
            <div className='flex flex-col gap-3'>
              <div className='flex flex-wrap items-center gap-3'>
                <BookCallButton label={t.callButton} />
              </div>
              <p className='text-xs text-muted-foreground'>
                {t.priceSection.callSub}
              </p>
              <p className='text-sm text-muted-foreground'>
                {t.priceSection.directPayPre}
                <a
                  href={COHORT.stripeUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-medium text-indigo-600 hover:underline dark:text-indigo-400'
                >
                  {t.priceSection.directPayLink}
                </a>
                {t.priceSection.directPayPost}
              </p>
            </div>
          </div>
          <div className='flex gap-3 border-t border-emerald-300/60 bg-emerald-50/60 p-5 dark:border-emerald-900 dark:bg-emerald-950/30'>
            <ShieldCheck className='mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400' />
            <p className='text-sm'>
              <span className='font-semibold'>
                {t.priceSection.guaranteeLabel}
              </span>
              {t.priceSection.guaranteeText}
            </p>
          </div>
        </div>
      </section>

      {/* Honest disqualification */}
      <section className='flex flex-col gap-6'>
        <SectionHeader
          eyebrow={t.notForYou.eyebrow}
          title={t.notForYou.title}
        />
        <ul className='flex flex-col gap-2.5'>
          {t.notForYou.items.map((item) => (
            <li key={item} className='flex gap-2 text-sm text-muted-foreground'>
              <X className='mt-0.5 size-4 shrink-0' />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className='flex flex-col gap-6'>
        <SectionHeader eyebrow={t.faq.eyebrow} title={t.faq.title} />
        <Accordion type='single' collapsible className='w-full'>
          {t.faq.items.map(({ q, a }) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger className='text-left'>{q}</AccordionTrigger>
              <AccordionContent className='text-muted-foreground'>
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Closing CTA */}
      <section className='flex flex-col items-start gap-4 rounded-2xl border border-indigo-300/60 bg-indigo-600/5 p-8 dark:border-indigo-900'>
        <div className='flex flex-col gap-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            {t.closing.title}
          </h2>
          <p className='max-w-prose text-muted-foreground'>{t.closing.body}</p>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <BookCallButton label={t.callButton} />
          <a
            href={mailHref}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'lg' }),
              'gap-2'
            )}
          >
            <Mail className='size-4' />
            {t.closing.mailButton}
          </a>
        </div>
        <p className='text-xs text-muted-foreground'>{t.closing.sub}</p>
      </section>

      {/* Attendees shortcut */}
      <p className='text-center text-sm text-muted-foreground'>
        {t.attendees.question}{' '}
        <Link
          href={materialHref}
          className='text-indigo-600 hover:underline dark:text-indigo-400'
        >
          {t.attendees.link}
        </Link>
      </p>
    </div>
  );
}
