import type {
  MarkdocPostMeta,
  MarkdocPostStatus,
} from '@/shared/blog/types';
import type { Locale } from 'next-intl';

type RawFrontmatter = Record<string, string | string[] | undefined>;

export function splitFrontmatter(source: string) {
  if (!source.startsWith('---')) {
    return {
      frontmatter: {},
      content: source.trim(),
    };
  }

  const end = source.indexOf('\n---', 3);

  if (end === -1) {
    return {
      frontmatter: {},
      content: source.trim(),
    };
  }

  const rawFrontmatter = source.slice(3, end).trim();
  const content = source.slice(end + 4).trim();

  return {
    frontmatter: parseFrontmatter(rawFrontmatter),
    content,
  };
}

export function normalizePostMeta({
  frontmatter,
  slug,
  locale,
}: {
  frontmatter: RawFrontmatter;
  slug: string;
  locale: Locale;
}): MarkdocPostMeta {
  return {
    slug,
    locale,
    title: readString(frontmatter.title, slug),
    description: readString(frontmatter.description),
    publishedAt: readString(frontmatter.publishedAt, new Date().toISOString()),
    status: readStatus(frontmatter.status),
    authors: readStringList(frontmatter.authors),
    categories: readStringList(frontmatter.categories),
    tags: readStringList(frontmatter.tags),
    image: readOptionalString(frontmatter.image),
    imageAlt: readOptionalString(frontmatter.imageAlt),
    readingTime: readOptionalNumber(frontmatter.readingTime),
  };
}

function parseFrontmatter(source: string): RawFrontmatter {
  const result: RawFrontmatter = {};
  const lines = source.split('\n');
  let currentListKey: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      continue;
    }

    if (currentListKey && trimmed.startsWith('- ')) {
      const currentValue = result[currentListKey];
      const nextValue = cleanValue(trimmed.slice(2));

      result[currentListKey] = Array.isArray(currentValue)
        ? [...currentValue, nextValue]
        : [nextValue];

      continue;
    }

    currentListKey = null;

    const separatorIndex = trimmed.indexOf(':');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (!value) {
      result[key] = [];
      currentListKey = key;
      continue;
    }

    result[key] = parseInlineValue(value);
  }

  return result;
}

function parseInlineValue(value: string) {
  if (value.startsWith('[') && value.endsWith(']')) {
    return value
      .slice(1, -1)
      .split(',')
      .map((item) => cleanValue(item))
      .filter(Boolean);
  }

  return cleanValue(value);
}

function cleanValue(value: string) {
  return value.trim().replace(/^["']|["']$/g, '');
}

function readString(value: string | string[] | undefined, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function readOptionalString(value: string | string[] | undefined) {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readStringList(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string' && value.length > 0) {
    return [value];
  }

  return [];
}

function readStatus(value: string | string[] | undefined): MarkdocPostStatus {
  return value === 'draft' ? 'draft' : 'published';
}

function readOptionalNumber(value: string | string[] | undefined) {
  if (typeof value !== 'string') {
    return undefined;
  }

  const number = Number(value);

  return Number.isNaN(number) ? undefined : number;
}
