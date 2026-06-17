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

// Full-bleed shell (no navbar/footer/chat), like the presentation surface. This
// page is a standalone visual aid for the workshop — the "Mapa de trabajo
// agéntico" — meant to be shown full-screen.
export default async function MapaLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return <div className='mapa-root min-h-screen w-full'>{children}</div>;
}
