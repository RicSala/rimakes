import type { ReactNode } from 'react';

/**
 * A code deck: slides authored as React elements (composed from the shared
 * templates) instead of Markdoc. The realtime layer only needs `slides`.
 */
export type CodeDeck = {
  title: string;
  slides: ReactNode[];
};
