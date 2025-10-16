import { Locale, NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Navbar } from '@/shared/components/Navbar';
import { Footer } from '@/shared/components/Footer';

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar className='bg-white sticky top-0 z-50 border-b' />
      <main className='flex-1 max-w-screen-md mx-auto w-full px-6 py-12'>
        {children}
      </main>
      <Footer />
    </NextIntlClientProvider>
  );
}
