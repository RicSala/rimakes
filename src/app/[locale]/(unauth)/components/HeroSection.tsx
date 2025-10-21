import { secondaryFont } from '@/shared/config/fonts';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export const HeroSection = () => {
  const t = useTranslations('heroSection');

  return (
    <section className='mx-auto px-4 text-center space-y-8 mt-16' id='hero'>
      <h1
        className={`${secondaryFont.className} text-5xl font-bold leading-[1.5]`}
      >
        {t('greeting')}{' '}
        <Image
          src={'/images/personal/me.jpeg'}
          className='inline rounded-md'
          width={60}
          height={60}
          alt='Ricardo profile pic'
        />{' '}
        {t('name')}
        <span className='text-5xl wave inline-block ml-2'>👋🏻</span>
      </h1>
      <p className='text-lg'>{t('description')}</p>
    </section>
  );
};
