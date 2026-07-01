import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

/**
 * Serves the CLAUDE.md reference template used in the "Desarrollando paso a paso"
 * section of the intro deck as a forced download. The file lives next to the deck
 * (content/decks/intro-to-synced-slides/CLAUDE.template.md) so it's versioned with
 * the slides; this route just streams it with an attachment disposition so the
 * browser downloads it cleanly instead of rendering the markdown inline.
 */
const templatePath = resolve(
  process.cwd(),
  'content',
  'decks',
  'intro-to-synced-slides',
  'CLAUDE.template.md',
);

export async function GET() {
  try {
    const file = await readFile(templatePath);

    return new Response(new Uint8Array(file), {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': 'attachment; filename="CLAUDE.template.md"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
