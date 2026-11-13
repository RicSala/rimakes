import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

import { COHORT, TESTIMONIAL_PEOPLE, type TestimonialKey } from './workshopData';

// ─────────────────────────────────────────────────────────────────────────────
// Imagen de Open Graph del taller (la que sale al compartir el enlace, p. ej. en
// WhatsApp). Cada petición elige al azar a una persona de la Cohort 0 y una de
// sus frases. La PÁGINA sigue siendo estática: solo esta imagen es dinámica.
//
// Pensada para WhatsApp: en el móvil se ve a ~300 px de ancho (≈ 1/4 del
// tamaño real), así que la frase va muy grande y el resto es secundario.
// ─────────────────────────────────────────────────────────────────────────────

// Se genera en cada petición (si no, Next la fijaría en el build y saldría
// siempre la misma persona).
export const dynamic = 'force-dynamic';

export const alt = 'Taller de Claude para profesionales no técnicos';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type Quote = { text: string };
type Person = { key: TestimonialKey; role: string; quotes: Quote[] };

/**
 * Frases de la imagen: las mismas que están resaltadas en la landing, copiadas
 * tal cual. Guillem tiene además una de su comentario en LinkedIn (escrito en
 * español; solo se le han añadido las tildes que faltaban).
 */
const PEOPLE: Record<'es' | 'en', Person[]> = {
  es: [
    {
      key: 'jordi',
      role: 'Diseño y comunicación gráfica · Ultramarinos Comunicación',
      quotes: [{ text: '…de una manera clara, práctica y accesible.' }],
    },
    {
      key: 'salva',
      role: 'Consejero delegado, Poble Espanyol de Barcelona',
      quotes: [{ text: 'Sin duda, un curso con un alto retorno.' }],
    },
    {
      key: 'borja',
      role: 'TheFork (Tripadvisor) · INSEAD MBA, ex-McKinsey',
      quotes: [
        {
          text: '100 % práctico y adaptado a tu perfil gracias a las clases individuales.',
        },
      ],
    },
    {
      key: 'guillem',
      role: 'Consultor independiente · Nueva York',
      quotes: [
        { text: 'Ricardo estuvo ahí cada vez que me atasqué.' },
        {
          text: 'El curso ha sido de lejos el mejor retorno a la inversión de tiempo y dinero que he hecho!',
        },
      ],
    },
    {
      key: 'humbert',
      role: 'Cofundador y CEO · PDPAOLA Jewelry',
      quotes: [{ text: '100% recomendado.' }],
    },
  ],
  en: [
    {
      key: 'jordi',
      role: 'Graphic & brand communication · Ultramarinos Comunicación',
      quotes: [
        { text: '…in a way that is clear, practical and accessible.' },
      ],
    },
    {
      key: 'salva',
      role: 'CEO, Poble Espanyol de Barcelona',
      quotes: [
        { text: 'Without a doubt, a course with a high return.' },
      ],
    },
    {
      key: 'borja',
      role: 'TheFork (Tripadvisor) · INSEAD MBA, ex-McKinsey',
      quotes: [
        {
          text: '100% practical and tailored to your profile thanks to the one-on-one sessions.',
        },
      ],
    },
    {
      key: 'guillem',
      role: 'Independent consultant · New York',
      quotes: [
        { text: 'He was right there whenever I got stuck.' },
        {
          text: 'The course has been by far the best return on investment of time and money I’ve ever made!',
        },
      ],
    },
    {
      key: 'humbert',
      role: 'Co-founder & CEO · PDPAOLA Jewelry',
      quotes: [{ text: '100% recommended.' }],
    },
  ],
};

const LABELS = {
  es: {
    title: 'Taller de Claude',
    seats: `Dic–Ene · Quedan ${COHORT.seatsLeft.december} de ${COHORT.seatsTotal} plazas`,
  },
  en: {
    title: 'Claude Workshop',
    seats: `Dec–Jan · ${COHORT.seatsLeft.december} of ${COHORT.seatsTotal} seats left`,
  },
};

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

/** Big phrase, but never more than ~3 lines. */
function quoteFontSize(text: string) {
  if (text.length <= 20) return 112;
  if (text.length <= 45) return 84;
  if (text.length <= 75) return 68;
  return 60;
}

/**
 * Geist (la fuente de la web) desde Google Fonts, recortada a los caracteres
 * que usa la imagen. Si falla, la imagen sale con la fuente por defecto.
 */
async function loadGeist(weight: number, text: string) {
  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=Geist:wght@${weight}&text=${encodeURIComponent(text)}`
    )
  ).text();
  const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error('Geist font not found');
  return (await fetch(url)).arrayBuffer();
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = locale === 'en' ? 'en' : 'es';
  const t = LABELS[lang];

  const person = pick(PEOPLE[lang]);
  const quote = pick(person.quotes);
  const { name, image } = TESTIMONIAL_PEOPLE[person.key];

  const photo = await readFile(join(process.cwd(), 'public', image));
  const photoSrc = `data:image/jpeg;base64,${photo.toString('base64')}`;

  const allText = [t.title, t.seats, quote.text, name, person.role, '“'].join('');
  const fonts = await Promise.all([loadGeist(500, allText), loadGeist(700, allText)])
    .then(([regular, bold]) => [
      { name: 'Geist', data: regular, weight: 500 as const, style: 'normal' as const },
      { name: 'Geist', data: bold, weight: 700 as const, style: 'normal' as const },
    ])
    .catch(() => undefined);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '52px 72px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 55%, #1e1b4b 100%)',
          color: 'white',
          fontFamily: fonts ? 'Geist' : undefined,
        }}
      >
        {/* Marca + plazas */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {/* La «r» del logo con su punto verde */}
            <div style={{ display: 'flex', position: 'relative', width: 46, height: 46 }}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 46,
                  height: 18,
                  background: 'white',
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 4,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 18,
                  height: 46,
                  background: 'white',
                  borderTopLeftRadius: 16,
                  borderBottomLeftRadius: 4,
                  borderBottomRightRadius: 4,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  background: '#34d399',
                }}
              />
            </div>
            <div style={{ display: 'flex', fontSize: 34, fontWeight: 700 }}>{t.title}</div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              fontWeight: 700,
              color: '#064e3b',
              background: '#6ee7b7',
              borderRadius: 999,
              padding: '10px 26px',
            }}
          >
            {t.seats}
          </div>
        </div>

        {/* La frase */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              height: 64,
              fontSize: 150,
              lineHeight: 1,
              fontWeight: 700,
              color: '#34d399',
            }}
          >
            “
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: quoteFontSize(quote.text),
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
            }}
          >
            {quote.text}
          </div>
        </div>

        {/* Quién lo dice */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <img
            src={photoSrc}
            width={108}
            height={108}
            alt=''
            style={{ borderRadius: 999, border: '4px solid white', objectFit: 'cover' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', fontSize: 36, fontWeight: 700 }}>{name}</div>
            <div style={{ display: 'flex', fontSize: 26, fontWeight: 500, color: '#c7d2fe' }}>
              {person.role}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
      // Que nadie (CDN, navegador) guarde la imagen: si no, saldría siempre la
      // misma persona.
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    }
  );
}
