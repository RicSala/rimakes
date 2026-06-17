import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

// Marker-style highlight. Colors are intentional (like a real highlighter), so
// they're hardcoded and stay put on any slide `bg` scheme — the dark text keeps
// the highlighted run readable on both light and dark slides. `box-decoration-clone`
// makes the rounded band wrap cleanly across multiple lines.
const HIGHLIGHT_COLORS: Record<string, string> = {
  yellow: 'bg-yellow-300 text-neutral-900',
  green: 'bg-green-300 text-neutral-900',
  blue: 'bg-sky-300 text-neutral-900',
  pink: 'bg-pink-300 text-neutral-900',
  orange: 'bg-orange-300 text-neutral-900',
};

export function Highlight({
  color,
  children,
}: {
  color?: string;
  children?: ReactNode;
}) {
  const palette = HIGHLIGHT_COLORS[color ?? 'yellow'] ?? HIGHLIGHT_COLORS.yellow;

  return (
    <mark
      className={cn(
        'box-decoration-clone rounded-[0.25em] px-1 py-0.5 font-medium',
        palette
      )}
    >
      {children}
    </mark>
  );
}
