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

// Full-bleed shell (no navbar/footer/chat), like /comandos and /claude-md.
// Standalone workshop reference: "Crear una app con Claude", the app-building
// guide (fundamentals + step-by-step), printable.
export default async function CrearAppLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return <div className='mapa-root min-h-screen w-full'>{children}</div>;
}
