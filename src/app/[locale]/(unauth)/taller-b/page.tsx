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
// BORRADOR ALTERNATIVO de la landing /taller — versión "venta directa":
// precio visible, pago por Stripe, contador de plazas, garantía y testimonios.
// Compárala con /taller y borra la carpeta de la versión descartada.
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ locale: Locale }>;
};

// ─────────────────────────────────────────────────────────────────────────────
// DATOS DE LA COHORTE — edita solo este bloque para actualizar la página.
// ─────────────────────────────────────────────────────────────────────────────
const COHORT = {
  /** Plazas libres — bájalo a mano según se vendan. */
  seatsLeft: 8,
  seatsTotal: 10,
  /** TODO: sustituir por el Payment Link real de Stripe antes de publicar. */
  stripeUrl: 'https://buy.stripe.com/REEMPLAZAR',
  /** TODO: crear en Cal.com un evento dedicado «Taller Claude — llamada de encaje (30 min)». */
  calUrl:
    'https://cal.com/ricardo-sala-mano7b/rimakes?overlayCalendar=true&layout=month_view',
  startDateLong: 'jueves 3 de septiembre',
  sessionDates: '3, 10, 17 y 24 de septiembre',
  schedule: 'Jueves, de 12:00 a 14:00 (hora peninsular)',
  price: '900 €',
  priceTotal: '1.089 €',
  /** Precio anunciado para la siguiente edición (ancla del tachado). */
  futurePrice: '1.100 €',
  contactEmail: 'ricardo@rimakes.com',
};

export const metadata: Metadata = {
  title: 'Taller de Claude para profesionales no técnicos',
  description:
    'Cuatro semanas para pasar de usar la IA como un chat a delegarle trabajo de verdad. Curso en vídeo, 8h en grupo (máx. 10) y 4h individuales. Empezamos el 3 de septiembre.',
  // Borrador en revisión: que no lo indexen los buscadores.
  robots: { index: false, follow: false },
};

/** Frases (parafraseadas) con las que llegaron los participantes de la 1.ª edición. */
const PAINS: string[] = [
  'Uso ChatGPT o Claude cada día… para redactar correos. Sé que ahí dentro hay mucho más, pero no sé llegar.',
  'No tengo tiempo para ponerme. Y menos para un curso grabado de 40 horas que no voy a terminar.',
  'No soy técnico. Los tutoriales asumen que sé programar y a la segunda pantalla me pierdo.',
  'Mi problema no es la herramienta: es que ni siquiera sé qué se le puede pedir.',
];

const BEFORE: string[] = [
  'La IA como chatbot: pides un texto, copias, pegas.',
  'Cada informe y tarea repetitiva sigue siendo tuya.',
  'No sabes qué se le puede pedir ni por dónde empezar.',
  '«Eso será para técnicos.»',
];

const AFTER: string[] = [
  'La IA como equipo: le delegas y revisas el resultado.',
  'Informes y procesos recurrentes que se hacen solos.',
  'Sabes qué pedirle, cómo, y qué es posible.',
  '«Dame una hora y lo monto.»',
];

/** Resultados de la Cohort 0: dos apps y dos sistemas de trabajo. */
const RESULTS: { title: string; body: string; icon: LucideIcon }[] = [
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
];

/**
 * ⚠️ BORRADORES PENDIENTES DE APROBACIÓN — citas redactadas a partir de los
 * resultados reales de la Cohort 0, pero NO son palabras textuales de nadie.
 * Sustituir por los testimonios reales (aprobados por cada persona) antes de
 * publicar la página.
 */
const TESTIMONIALS: { quote: string; name: string; role: string }[] = [
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
];

/** El formato, paso a paso. */
const STEPS: { title: string; body: string; icon: LucideIcon }[] = [
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
];

/**
 * Los módulos del taller — solo títulos a propósito: el detalle y el reparto
 * entre sesiones cambian con cada cohorte.
 */
const MODULES: { title: string; icon: LucideIcon }[] = [
  { icon: Sparkles, title: 'Primer contacto con Claude' },
  { icon: Wand2, title: 'Personaliza tu Claude' },
  { icon: PlugZap, title: 'Conectando a Claude' },
  { icon: Zap, title: 'Trabajo remoto y automático' },
  { icon: Boxes, title: 'Tus primeras herramientas' },
  { icon: Brain, title: 'La memoria de Claude' },
  { icon: Terminal, title: 'Nos pasamos a la terminal' },
  { icon: Wrench, title: 'Fundamentos de las apps' },
  { icon: Rocket, title: 'Creando una app juntos' },
];

/** Lo que incluye la plaza (bloque de precio). */
const INCLUDED: string[] = [
  'Llamada previa individual de 30 min para encuadrar tu caso',
  'Curso troncal en vídeo (+5 horas) para repasar cuando quieras',
  `4 sesiones en grupo — 8 horas en directo (${COHORT.sessionDates})`,
  '2 sesiones individuales — 4 horas solo tú, yo y tu proyecto',
  'Deck de repaso + 6 recursos, con acceso también después del curso',
  'Material de las próximas ediciones incluido, sin coste adicional',
  `Grupo de ${COHORT.seatsTotal} personas como máximo`,
];

const FAQ: { q: string; a: string }[] = [
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
];

const NOT_FOR_YOU: string[] = [
  'Buscas solo un curso grabado para ver «algún día». Aquí los vídeos son la base: lo importante pasa en directo, con fechas y con deberes.',
  'No puedes dedicarle unas 4–6 horas semanales durante un mes.',
  'Ya trabajas a diario con Claude Code y la terminal: se te quedará corto (escríbeme y te oriento hacia otra cosa).',
  'Esperas que la IA lo haga todo sola. Vas a aprender a dirigirla — y eso no sustituye tu criterio.',
];

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

function SeatsBadge() {
  return (
    <span className='inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-300/70 bg-amber-100/60 px-3 py-1 text-xs font-medium text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300'>
      Quedan {COHORT.seatsLeft} de {COHORT.seatsTotal} plazas
    </span>
  );
}

function BookCallButton({ className }: { className?: string }) {
  return (
    <a
      href={COHORT.calUrl}
      target='_blank'
      rel='noopener noreferrer'
      className={cn(
        buttonVariants({ size: 'lg' }),
        'gap-2 bg-indigo-600 text-white hover:bg-indigo-500',
        className
      )}
    >
      <Phone className='size-4' />
      Reserva una llamada (30 min)
    </a>
  );
}

/** Vía rápida para quien ya lo tiene claro — solo en el bloque de precio. */
function DirectPayLine() {
  return (
    <p className='text-sm text-muted-foreground'>
      ¿Lo tienes claro?{' '}
      <a
        href={COHORT.stripeUrl}
        target='_blank'
        rel='noopener noreferrer'
        className='font-medium text-indigo-600 hover:underline dark:text-indigo-400'
      >
        Reserva tu plaza directamente
      </a>{' '}
      — pago único y seguro por Stripe.
    </p>
  );
}

export default async function TallerBPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Locale-aware paths (localePrefix is "as-needed": no prefix for the default
  // locale, so we must not emit "/es/…").
  const withLocale = (path: string) =>
    locale === routing.defaultLocale ? path : `/${locale}${path}`;

  const materialHref = withLocale('/training');
  const blogHref = withLocale('/blog');
  const appsHref = withLocale('/my-apps');
  const mailHref = `mailto:${COHORT.contactEmail}?subject=Duda%20sobre%20el%20taller%20de%20Claude`;

  return (
    <div className='flex flex-col gap-20'>
      {/* Hero */}
      <header className='flex flex-col gap-5'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='inline-flex w-fit items-center gap-1.5 rounded-full bg-indigo-600/10 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300'>
            <CalendarDays className='size-3.5' />
            Cohorte de septiembre · empieza el {COHORT.startDateLong}
          </span>
          <SeatsBadge />
        </div>
        <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
          Deja de pedirle textos a la IA. Aprende a delegarle trabajo.
        </h1>
        <p className='text-lg text-muted-foreground'>
          Un taller en directo para profesionales no técnicos:{' '}
          <strong className='font-semibold text-foreground'>
            curso troncal en vídeo
          </strong>
          ,{' '}
          <strong className='font-semibold text-foreground'>
            8 horas en grupo
          </strong>{' '}
          (máximo {COHORT.seatsTotal}) y{' '}
          <strong className='font-semibold text-foreground'>
            4 horas individuales
          </strong>{' '}
          contigo. Para pasar de usar la IA como un chat a{' '}
          <strong className='font-semibold text-foreground'>
            delegarle trabajo de verdad
          </strong>{' '}
          — sin saber programar.
        </p>
        <div className='flex flex-wrap items-center gap-3'>
          <BookCallButton />
          <Link
            href='#programa'
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
          >
            Ver el programa
          </Link>
        </div>
        <p className='flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground'>
          <span className='inline-flex items-center gap-1.5'>
            <Check className='size-4 text-emerald-600 dark:text-emerald-400' />
            {COHORT.price} + IVA, pago único
          </span>
          <span className='inline-flex items-center gap-1.5'>
            <ShieldCheck className='size-4 text-emerald-600 dark:text-emerald-400' />
            Si la primera sesión no es para ti, devolución del 100 %
          </span>
        </p>
      </header>

      {/* Empathy — the reader's own words */}
      <section className='flex flex-col gap-6'>
        <SectionHeader
          eyebrow='¿Te suena?'
          title='Este taller nace de frases como estas'
        />
        <div className='grid gap-4 sm:grid-cols-2'>
          {PAINS.map((pain) => (
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
          Son frases (casi literales) de la primera edición.{' '}
          <strong className='font-semibold text-foreground'>
            Un mes después, cada uno tenía a Claude trabajando para él.
          </strong>{' '}
          La diferencia no es talento técnico: son fundamentos bien puestos y
          alguien al lado las primeras veces.
        </p>
      </section>

      {/* Transformation — before / after */}
      <section className='flex flex-col gap-6'>
        <SectionHeader
          eyebrow='La transformación'
          title='De dónde vienes, a dónde llegas'
        />
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='flex flex-col gap-3 rounded-xl border border-border bg-card p-5'>
            <h3 className='font-semibold text-muted-foreground'>Hoy</h3>
            <ul className='flex flex-col gap-2.5'>
              {BEFORE.map((item) => (
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
            <h3 className='font-semibold'>En cuatro semanas</h3>
            <ul className='flex flex-col gap-2.5'>
              {AFTER.map((item) => (
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
        <SectionHeader
          eyebrow='La primera edición'
          title='Perfiles no técnicos, un mes: dos apps y dos sistemas'
        />
        <div className='grid gap-4 sm:grid-cols-2'>
          {RESULTS.map(({ title, body, icon: Icon }) => (
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
          eyebrow='En sus palabras'
          title='Lo que dicen los que ya pasaron por aquí'
        />
        <div className='grid gap-4 sm:grid-cols-2'>
          {TESTIMONIALS.map(({ quote, name, role }) => (
            <figure
              key={name}
              className='flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5'
            >
              <blockquote className='text-sm text-muted-foreground'>
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

      {/* Format */}
      <section className='flex flex-col gap-6'>
        <SectionHeader eyebrow='Metodología' title='Cómo funciona' />
        <p className='text-muted-foreground'>
          No es un curso ni una masterclass para cientos de personas. Es un
          taller: grupo pequeño, trabajo en directo y tu proyecto real como
          material.
        </p>
        <div className='flex flex-col gap-4'>
          {STEPS.map(({ title, body, icon: Icon }, i) => (
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
        <SectionHeader eyebrow='Contenido' title='Qué recorremos' />
        <p className='text-muted-foreground'>
          Del primer contacto con Claude a{' '}
          <strong className='font-semibold text-foreground'>
            tu propio sistema de trabajo con IA
          </strong>{' '}
          — incluida, si tu caso lo pide, tu primera herramienta a medida.
        </p>
        <div className='grid gap-3 sm:grid-cols-3'>
          {MODULES.map(({ title, icon: Icon }) => (
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
        <p className='text-sm text-muted-foreground'>
          El detalle de cada módulo y su reparto entre sesiones se ajustan a
          cada cohorte: el programa se adapta a los proyectos del grupo, no al
          revés.
        </p>
      </section>

      {/* Who am I */}
      <section className='flex flex-col gap-6'>
        <SectionHeader eyebrow='Quién te acompaña' title='Hola, soy Ricardo' />
        <div className='flex flex-col gap-6 sm:flex-row'>
          <Image
            src='/images/personal/me.jpeg'
            alt='Ricardo Sala'
            width={176}
            height={176}
            className='size-44 shrink-0 rounded-2xl object-cover'
          />
          <div className='flex flex-col gap-3 text-muted-foreground'>
            <p>
              Vengo del mundo de la empresa: negocio y finanzas. Hace tres años
              decidí aprender a programar y desde entonces trabajo con IA a
              diario — desde el primer Copilot hasta Claude Code. Esta web y las
              slides sincronizadas del taller están hechas así: yo más Claude.
            </p>
            <p>
              He estado en los dos lados: sé lo que es mirar lo técnico desde
              fuera y pensar «esto no es para mí». Por eso el grupo es pequeño —
              lo que más disfruto es el momento en que alguien «de letras» pone
              la IA a trabajar.
            </p>
            <p className='font-medium text-foreground'>
              El taller lo doy yo, de principio a fin.
            </p>
            <div className='flex flex-wrap gap-4 text-sm'>
              <Link
                href={blogHref}
                className='inline-flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400'
              >
                Lee mi blog <ArrowRight className='size-3.5' />
              </Link>
              <Link
                href={appsHref}
                className='inline-flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400'
              >
                Mira lo que construyo <ArrowRight className='size-3.5' />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Editions grid — track record + honest price anchor */}
      <section className='flex flex-col gap-6'>
        <SectionHeader
          eyebrow='Ediciones'
          title='Cohortes pequeñas, y el precio va subiendo'
        />
        <div className='grid gap-4 sm:grid-cols-3'>
          <div className='flex flex-col justify-between gap-6 rounded-xl border border-border bg-card p-5'>
            <span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
              Julio 2026
            </span>
            <span className='text-2xl font-bold tracking-tight text-muted-foreground'>
              Agotado
            </span>
          </div>
          <div className='flex flex-col justify-between gap-6 rounded-xl border-2 border-indigo-500/60 bg-indigo-600/5 p-5 dark:border-indigo-500/40'>
            <div className='flex flex-col gap-1'>
              <span className='text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400'>
                Septiembre 2026
              </span>
              <span className='text-xs font-medium text-amber-700 dark:text-amber-400'>
                Quedan {COHORT.seatsLeft} de {COHORT.seatsTotal} plazas
              </span>
            </div>
            <span className='flex flex-wrap items-baseline gap-x-2'>
              <s className='text-base font-medium text-muted-foreground'>
                {COHORT.futurePrice}
              </s>
              <span className='text-2xl font-bold tracking-tight'>
                {COHORT.price}
              </span>
              <span className='text-sm text-muted-foreground'>+ IVA</span>
            </span>
          </div>
          <div className='flex flex-col justify-between gap-6 rounded-xl border border-dashed border-border p-5'>
            <span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
              Octubre 2026
            </span>
            <span className='flex flex-wrap items-baseline gap-x-2 text-muted-foreground'>
              <span className='text-2xl font-bold tracking-tight'>
                {COHORT.futurePrice}
              </span>
              <span className='text-sm'>+ IVA</span>
            </span>
          </div>
        </div>
      </section>

      {/* Price */}
      <section id='precio' className='flex scroll-mt-24 flex-col gap-6'>
        <SectionHeader eyebrow='La inversión' title='Una plaza, todo incluido' />
        <p className='text-muted-foreground'>
          Las cuatro horas individuales, por sí solas, ya equivalen a una
          consultoría privada sobre tu caso.
        </p>
        <div className='flex flex-col overflow-hidden rounded-2xl border border-indigo-300/60 dark:border-indigo-900'>
          <div className='flex flex-col gap-6 bg-card p-8'>
            <div className='flex flex-wrap items-end justify-between gap-4'>
              <div className='flex flex-col gap-1'>
                <span className='text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400'>
                  Cohorte de septiembre
                </span>
                <div className='flex items-baseline gap-2'>
                  <span className='text-4xl font-bold tracking-tight'>
                    {COHORT.price}
                  </span>
                  <span className='text-muted-foreground'>+ IVA</span>
                </div>
                <span className='text-xs text-muted-foreground'>
                  {COHORT.priceTotal} IVA incluido · factura para tu empresa
                  (formación deducible)
                </span>
                <span className='text-xs font-medium text-amber-700 dark:text-amber-400'>
                  Precio de beta — subirá en las próximas ediciones
                </span>
              </div>
              <SeatsBadge />
            </div>
            <ul className='flex flex-col gap-2.5'>
              {INCLUDED.map((item) => (
                <li key={item} className='flex gap-2 text-sm'>
                  <Check className='mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400' />
                  {item}
                </li>
              ))}
              <li className='flex gap-2 text-sm text-muted-foreground'>
                <CalendarDays className='mt-0.5 size-4 shrink-0' />
                {COHORT.schedule}
              </li>
            </ul>
            <div className='flex flex-col gap-3'>
              <div className='flex flex-wrap items-center gap-3'>
                <BookCallButton />
              </div>
              <p className='text-xs text-muted-foreground'>
                Sin compromiso: vemos tu caso y te digo, honestamente, si el
                taller te va a servir.
              </p>
              <DirectPayLine />
            </div>
          </div>
          <div className='flex gap-3 border-t border-emerald-300/60 bg-emerald-50/60 p-5 dark:border-emerald-900 dark:bg-emerald-950/30'>
            <ShieldCheck className='mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400' />
            <p className='text-sm'>
              <span className='font-semibold'>Garantía de primera sesión:</span>{' '}
              asiste a la primera sesión y, si no es para ti, te devuelvo el
              100 % — sin preguntas y sin letra pequeña. Tu único riesgo real es
              quedarte sin plaza.
            </p>
          </div>
        </div>
      </section>

      {/* Honest disqualification */}
      <section className='flex flex-col gap-6'>
        <SectionHeader
          eyebrow='Seamos claros'
          title='Este taller no es para ti si…'
        />
        <ul className='flex flex-col gap-2.5'>
          {NOT_FOR_YOU.map((item) => (
            <li
              key={item}
              className='flex gap-2 text-sm text-muted-foreground'
            >
              <X className='mt-0.5 size-4 shrink-0' />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className='flex flex-col gap-6'>
        <SectionHeader
          eyebrow='Preguntas frecuentes'
          title='Lo que suelen preguntarme'
        />
        <Accordion type='single' collapsible className='w-full'>
          {FAQ.map(({ q, a }) => (
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
            Empezamos el {COHORT.startDateLong}
          </h2>
          <p className='max-w-prose text-muted-foreground'>
            Si has pensado en ese informe que haces a mano cada mes o en ese
            «yo no soy técnico», es justo lo que resolvemos en cuatro semanas.
            Esta es la última edición a precio de beta: la de octubre ya
            costará {COHORT.futurePrice} + IVA.
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <BookCallButton />
          <a
            href={mailHref}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'lg' }),
              'gap-2'
            )}
          >
            <Mail className='size-4' />
            Escríbeme
          </a>
        </div>
        <p className='text-xs text-muted-foreground'>
          Quedan {COHORT.seatsLeft} de {COHORT.seatsTotal} plazas · precio de
          beta (subirá en próximas ediciones) · si la primera sesión no es para
          ti, devolución del 100 %.
        </p>
      </section>

      {/* Attendees shortcut */}
      <p className='text-center text-sm text-muted-foreground'>
        ¿Ya eres asistente?{' '}
        <Link href={materialHref} className='text-indigo-600 hover:underline dark:text-indigo-400'>
          Accede al material
        </Link>
      </p>
    </div>
  );
}
