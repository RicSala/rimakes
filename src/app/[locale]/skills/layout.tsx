import type { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/shared/internationalization/i18n/config';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Full-bleed shell (no navbar/footer/chat), like /claude-md and /comandos.
// Standalone workshop resource: "Crear buenas skills", a printable guide.
export default async function SkillsLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return <div className='mapa-root min-h-screen w-full'>{children}</div>;
}
