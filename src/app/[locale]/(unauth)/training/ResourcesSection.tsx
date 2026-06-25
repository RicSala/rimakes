'use client';

import { BookA, FileText, Layers, Map, Terminal } from 'lucide-react';

import { ResourceCard, type Resource } from './ResourceCard';

/**
 * The "Recursos" grid. Lives client-side so it can hold the Lucide icon
 * components directly — React components can't be serialised across the
 * server→client boundary inside plain props, so the server only passes the
 * primitives (`unlocked`, `mapaHref`) and we build the resource list here.
 */
export function ResourcesSection({
  unlocked,
  mapaHref,
  mapaContextoHref,
  claudeMdHref,
  glosarioHref,
  comandosHref,
}: {
  unlocked: boolean;
  mapaHref: string;
  mapaContextoHref: string;
  claudeMdHref: string;
  glosarioHref: string;
  comandosHref: string;
}) {
  const resources: Resource[] = [
    {
      href: mapaHref,
      icon: Map,
      title: 'Mapa de trabajo agéntico',
      description:
        'Las piezas de la IA y cómo se combinan: el mapa visual de las sesiones, para encontrar la pieza que necesitas. Descargable en PDF.',
    },
    {
      href: mapaContextoHref,
      icon: Layers,
      title: 'Dónde poner el contexto',
      description:
        'Los seis sitios donde meter contexto —prompt, CLAUDE.md, skills, subagentes…— comparados por los mismos vectores. Descargable en PDF.',
    },
    {
      href: claudeMdHref,
      icon: FileText,
      title: 'Entender el CLAUDE.md',
      description:
        'Cómo funciona el archivo que Claude lee solo: qué poner, qué no, y cómo escribirlo para que lo siga.',
    },
    {
      href: glosarioHref,
      icon: BookA,
      title: 'Glosario',
      description:
        'Las palabras técnicas de las sesiones explicadas en cristiano, para no técnicos. Con buscador por término y descargable en PDF.',
    },
    {
      href: comandosHref,
      icon: Terminal,
      title: 'Chuleta de comandos',
      description:
        'Una referencia rápida de la terminal, Claude Code y Git para reconocer los comandos y empezar a usarlos. Descargable en PDF.',
    },
  ];

  return (
    <div className='grid gap-4 sm:grid-cols-2'>
      {resources.map((resource) => (
        <ResourceCard
          key={resource.href}
          resource={resource}
          unlocked={unlocked}
        />
      ))}
    </div>
  );
}
