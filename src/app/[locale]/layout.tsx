import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Locale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/shared/internationalization/i18n/config';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'rimakes · Desarrollo de aplicaciones a medida y formación en IA',
  description:
    'Desarrollo de aplicaciones a medida y formación en IA. Portfolio, blog y workshops de Ric Sala.',
  // Only to test link previews through a tunnel (e.g. WhatsApp against this
  // machine). It must be a production build, because in `next dev` Next always
  // points file-based OG images at localhost:
  //   OG_BASE_URL=https://xxx.trycloudflare.com pnpm build && pnpm start
  // When unset, Next uses its default (the production domain on Vercel).
  ...(process.env.OG_BASE_URL && {
    metadataBase: new URL(process.env.OG_BASE_URL),
  }),
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <NextIntlClientProvider locale={locale as Locale}>
      <html lang='en' className='h-full scroll-smooth'>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-full overflow-y-scroll`}
        >
          {children}
        </body>
      </html>
    </NextIntlClientProvider>
  );
}
