'use client';

import { FileText, Layers, Map } from 'lucide-react';

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
}: {
  unlocked: boolean;
  mapaHref: string;
  mapaContextoHref: string;
  claudeMdHref: string;
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
