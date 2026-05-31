import {
  bundledLanguages,
  bundledLanguagesAlias,
  codeToHtml,
  type BundledLanguage,
  type SpecialLanguage,
} from 'shiki';

type MarkdocCodeBlockProps = {
  code: string;
  language?: string;
};

type ShikiLanguage = BundledLanguage | SpecialLanguage;

function resolveLanguage(language?: string): ShikiLanguage {
  const normalizedLanguage = language?.trim();

  if (!normalizedLanguage) {
    return 'text';
  }

  if (normalizedLanguage === 'plainText') {
    return 'text';
  }

  if (normalizedLanguage === 'markdoc') {
    return 'markdown';
  }

  if (
    normalizedLanguage in bundledLanguages ||
    normalizedLanguage in bundledLanguagesAlias
  ) {
    return normalizedLanguage as BundledLanguage;
  }

  return 'text';
}

export async function MarkdocCodeBlock({
  code,
  language,
}: MarkdocCodeBlockProps) {
  const html = await codeToHtml(code, {
    lang: resolveLanguage(language),
    theme: 'monokai',
  });

  return (
    <div
      className='not-prose my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-6 [&_pre]:shadow-sm'
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
