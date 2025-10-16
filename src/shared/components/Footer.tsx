import { LanguageSwitcher } from '@/shared/internationalization/components/LanguageSwitcher';
import { getTranslations } from 'next-intl/server';

export async function Footer() {
  const t = await getTranslations();

  return (
    <footer className='bg-gray-100'>
      <div className='max-w-screen-xl mx-auto px-4 py-8 flex items-center justify-between'>
        <p className='text-center text-gray-500'>{t('footer.copyright')}</p>
        <LanguageSwitcher />
      </div>
    </footer>
  );
}
