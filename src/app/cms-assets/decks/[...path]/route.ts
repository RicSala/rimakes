import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const decksAssetsDirectory = resolve(process.cwd(), 'content', 'decks');

const contentTypes: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

type Props = {
  params: Promise<{ path: string[] }>;
};

export async function GET(_request: Request, { params }: Props) {
  const { path } = await params;
  const filePath = resolve(decksAssetsDirectory, ...path);

  if (!isWithinDecksAssetsDirectory(filePath)) {
    return new Response('Not found', { status: 404 });
  }

  const contentType = contentTypes[extname(filePath).toLowerCase()];

  if (!contentType) {
    return new Response('Not found', { status: 404 });
  }

  try {
    const file = await readFile(filePath);

    return new Response(new Uint8Array(file), {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Type': contentType,
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}

function isWithinDecksAssetsDirectory(filePath: string) {
  return (
    filePath === decksAssetsDirectory ||
    filePath.startsWith(`${decksAssetsDirectory}${sep}`)
  );
}
