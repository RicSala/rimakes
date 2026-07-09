'use client';

import { BookA, FileText, Layers, Map, Rocket, Terminal, Wand2 } from 'lucide-react';

import { ResourceCard, type Resource } from './ResourceCard';

const COPY = {
  es: {
    mapa: {
      title: 'Mapa de trabajo agéntico',
      description:
        'Las piezas de la IA y cómo se combinan: el mapa visual de las sesiones, para encontrar la pieza que necesitas. Descargable en PDF.',
    },
    contexto: {
      title: 'Dónde poner el contexto',
      description:
        'Los seis sitios donde meter contexto —prompt, CLAUDE.md, skills, subagentes…— comparados por los mismos vectores. Descargable en PDF.',
    },
    claudeMd: {
      title: 'Entender el CLAUDE.md',
      description:
        'Cómo funciona el archivo que Claude lee solo: qué poner, qué no, y cómo escribirlo para que lo siga.',
    },
    skills: {
      title: 'Crear buenas skills',
      description:
        'Qué es una skill, por qué la descripción decide casi todo, y cómo escribir una que Claude active en el momento justo. Descargable en PDF.',
    },
    glosario: {
      title: 'Glosario',
      description:
        'Las palabras técnicas de las sesiones explicadas en cristiano, para no técnicos. Con buscador por término y descargable en PDF.',
    },
    comandos: {
      title: 'Chuleta de comandos',
      description:
        'Una referencia rápida de la terminal, Claude Code y Git para reconocer los comandos y empezar a usarlos. Descargable en PDF.',
    },
    crearApp: {
      title: 'Crear una app con Claude',
      description:
        'Los nueve fundamentos, el stack por defecto y el paso a paso completo —con sus prompts— para ir del proyecto vacío a una app publicada. Descargable en PDF.',
    },
  },
  en: {
    mapa: {
      title: 'Agentic work map',
      description:
        'The pieces of AI and how they combine: the visual map from the sessions, to find the piece you need. Downloadable as PDF.',
    },
    contexto: {
      title: 'Where to put context',
      description:
        'The six places to put context —prompt, CLAUDE.md, skills, subagents…— compared along the same vectors. Downloadable as PDF.',
    },
    claudeMd: {
      title: 'Understanding CLAUDE.md',
      description:
        'How the file Claude reads on its own works: what to put in, what to leave out, and how to write it so Claude follows it.',
    },
    skills: {
      title: 'Writing good skills',
      description:
        'What a skill is, why the description decides almost everything, and how to write one Claude triggers at the right moment. Downloadable as PDF.',
    },
    glosario: {
      title: 'Glossary',
      description:
        'The technical words from the sessions explained in plain language, for non-technical people. Searchable and downloadable as PDF.',
    },
    comandos: {
      title: 'Command cheat sheet',
      description:
        'A quick reference for the terminal, Claude Code and Git, to recognize the commands and start using them. Downloadable as PDF.',
    },
    crearApp: {
      title: 'Building an app with Claude',
      description:
        'The nine fundamentals, the default stack and the full step-by-step —prompts included— to go from an empty project to a deployed app. Downloadable as PDF.',
    },
  },
} as const;

/**
 * The resources grid. Lives client-side so it can hold the Lucide icon
 * components directly — React components can't be serialised across the
 * server→client boundary inside plain props, so the server only passes the
 * primitives (`unlocked`, `locale`, hrefs) and we build the resource list here.
 * Note: the linked resource pages themselves are Spanish-only for now.
 */
export function ResourcesSection({
  unlocked,
  locale = 'es',
  mapaHref,
  mapaContextoHref,
  claudeMdHref,
  skillsHref,
  glosarioHref,
  comandosHref,
  crearAppHref,
}: {
  unlocked: boolean;
  locale?: 'es' | 'en';
  mapaHref: string;
  mapaContextoHref: string;
  claudeMdHref: string;
  skillsHref: string;
  glosarioHref: string;
  comandosHref: string;
  crearAppHref: string;
}) {
  const c = COPY[locale];

  const resources: Resource[] = [
    { href: mapaHref, icon: Map, ...c.mapa },
    { href: mapaContextoHref, icon: Layers, ...c.contexto },
    { href: claudeMdHref, icon: FileText, ...c.claudeMd },
    { href: skillsHref, icon: Wand2, ...c.skills },
    { href: glosarioHref, icon: BookA, ...c.glosario },
    { href: comandosHref, icon: Terminal, ...c.comandos },
    { href: crearAppHref, icon: Rocket, ...c.crearApp },
  ];

  return (
    <div className='grid gap-4 sm:grid-cols-2'>
      {resources.map((resource) => (
        <ResourceCard
          key={resource.href}
          resource={resource}
          unlocked={unlocked}
          locale={locale}
        />
      ))}
    </div>
  );
}
