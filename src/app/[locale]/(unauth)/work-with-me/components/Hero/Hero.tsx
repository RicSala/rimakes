import { ScheduleButton } from '@/shared/components/ScheduleButton';
import { CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const Hero = () => {
  const t = useTranslations('comp-hero');

  return (
    <section className='container mx-auto px-4'>
      <div className='text-center space-y-6 max-w-3xl mx-auto'>
        <h1 className='text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight'>
          {t('title')}
        </h1>
        <p className='text-xl text-gray-600'>{t('description')}</p>
        <div className='flex justify-center gap-4 flex-wrap'>
          <Feature text={t('features.fixed-price')} />
          <Feature text={t('features.no-hidden-costs')} />
          <Feature text={t('features.training-included')} />
        </div>
        <ScheduleButton label='Work with me' />
      </div>
    </section>
  );
};

export const Feature = ({
  text,
  light = false,
}: {
  text: string;
  light?: boolean;
}) => (
  <div
    className={`flex items-center gap-2 ${
      light ? 'text-white' : 'text-gray-700'
    }`}
  >
    <CheckCircle className='w-5 h-5 text-green-500' />
    <span>{text}</span>
  </div>
);
