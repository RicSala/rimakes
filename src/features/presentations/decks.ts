import { cache } from 'react';
import { createReader } from '@keystatic/core/reader';

import { keystaticConfig } from '@/keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);

export const getDeck = cache(async (slug: string) => {
  return reader.collections.decks.read(slug, { resolveLinkedFiles: true });
});

export async function getDeckSlugs(): Promise<string[]> {
  return [...(await reader.collections.decks.list())];
}
