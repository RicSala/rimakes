import { Locale, NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Navbar } from '@/shared/components/Navbar';
import { Footer } from '@/shared/components/Footer';
import { WipDisclaimer } from '@/shared/components/WipDisclaimer';
import { setRequestLocale } from 'next-intl/server';
import { ChatButton } from '@/shared/chat/components/ChatButton';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const messages = await getMessages({ locale });
  return (
    <NextIntlClientProvider locale={locale as Locale} messages={messages}>
      <div className='grow flex flex-col isolate'>
        <Navbar className='bg-background sticky top-0 z-50 border-b' />
        <main className='flex-1 relative'>
          <div className='max-w-screen-md mx-auto w-full px-6 py-12'>
            {children}
          </div>
          <ChatButton className='fixed bottom-28 right-8 z-50' />
          <WipDisclaimer className='bottom-8 mb-8 right-8 z-50 ml-auto block fixed' />
        </main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
