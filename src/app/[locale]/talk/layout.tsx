import type { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Minimal, full-bleed shell for code-deck talks — mirrors the `present` shell:
// no navbar/footer/chat. Decks aren't localized; the locale segment only exists
// to satisfy the root layout.
export default async function TalkLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <div className='min-h-screen w-full bg-background text-foreground'>
      {children}
    </div>
  );
}
