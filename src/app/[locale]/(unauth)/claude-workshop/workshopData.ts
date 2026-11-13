// ─────────────────────────────────────────────────────────────────────────────
// Datos del taller compartidos entre la landing (page.tsx) y la imagen de Open
// Graph (opengraph-image.tsx). Si cambias las plazas aquí, cambian en los dos.
// ─────────────────────────────────────────────────────────────────────────────

// DATOS DE LA COHORTE — números y enlaces compartidos entre idiomas.
// Fechas, horario y precios viven en COPY (es/en) de page.tsx: si los cambias,
// actualiza LOS DOS idiomas.
// Solo hay una cohorte con fecha: la de diciembre–enero, en español. Las dos
// páginas (ES y EN) venden esa misma cohorte; la de febrero ya va a precio
// completo y la edición en inglés se abrirá según el interés (sin fecha).
export const COHORT = {
  /** Plazas libres por cohorte — bájalas a mano según se vendan. */
  seatsLeft: {
    december: 3, // cohorte de diciembre–enero (en español) — la única con fecha
  },
  seatsTotal: 5,
  /** TODO: sustituir por el Payment Link real de Stripe antes de publicar. */
  stripeUrl: 'https://buy.stripe.com/REEMPLAZAR',
  /** TODO: crear en Cal.com un evento dedicado «Taller Claude — llamada de encaje (30 min)». */
  calUrl:
    'https://cal.com/ricardo-sala-mano7b/rimakes?overlayCalendar=true&layout=month_view',
  contactEmail: 'ricardo@rimakes.com',
};

/**
 * TESTIMONIOS — personas de la Cohort 0. Todos son textos públicos de LinkedIn
 * (recomendaciones, o comentarios en mis posts como el de Humbert): la foto, el
 * nombre y el enlace al perfil son lo que hace que la cita sea *verificable*
 * (que es de donde viene la credibilidad, no de un pantallazo).
 * Datos compartidos entre idiomas; la cita y el cargo viven en COPY (es/en).
 */
export const RECOMMENDATIONS_URL =
  'https://www.linkedin.com/in/ricardosala/details/recommendations/';

export const TESTIMONIAL_PEOPLE = {
  guillem: {
    name: 'Guillem "Bill" Garcia Galofre',
    image: '/images/testimonials/guillem.jpg',
    linkedin: 'https://www.linkedin.com/in/guillemgarciagalofre/',
  },
  salva: {
    name: 'Salvador Rovira',
    image: '/images/testimonials/salva.jpg',
    linkedin: 'https://www.linkedin.com/in/salvador-rovira-991a4832/',
  },
  borja: {
    name: 'Borja Camblor',
    image: '/images/testimonials/borja.jpg',
    linkedin: 'https://www.linkedin.com/in/borja-camblor-a582a629/',
  },
  jordi: {
    name: 'Jordi Teijeiro',
    image: '/images/testimonials/jordi.jpg',
    linkedin: 'https://www.linkedin.com/in/jordi-teijeiro/',
  },
  humbert: {
    name: 'Humbert Sasplugas Mateu',
    image: '/images/testimonials/humbert.jpg',
    linkedin: 'https://www.linkedin.com/in/humbertsasplugas/',
  },
} as const;

export type TestimonialKey = keyof typeof TESTIMONIAL_PEOPLE;
