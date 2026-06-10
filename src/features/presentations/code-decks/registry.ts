import type { CodeDeck } from './types';

// Static map of literal-path dynamic imports → one code-split chunk per deck.
// Use literal paths (not a template-literal path) to preserve per-deck splitting.
const decks: Record<string, () => Promise<{ default: CodeDeck }>> = {
  'intro-to-synced-slides': () => import('./intro-to-synced-slides/deck'),
};

export function getCodeDeckSlugs(): string[] {
  return Object.keys(decks);
}

export async function getCodeDeck(slug: string): Promise<CodeDeck | null> {
  const load = decks[slug];
  return load ? (await load()).default : null;
}
