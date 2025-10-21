import { ScheduleButton } from '@/shared/components/ScheduleButton';
import { useTranslations } from 'next-intl';

export const Banner = () => {
  const t = useTranslations('banner');

  return (
    <div className='bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg p-14 @container'>
      <div className='flex-col flex @xl:flex-row justify-between gap-8'>
        <div className='flex flex-col gap-4'>
          <h2 className='text-4xl font-bold'>{t('title')}</h2>
          <p className='text-lg text-muted'>{t('description')}</p>
        </div>
        <div className='flex flex-col justify-center'>
          <ScheduleButton label={t('buttonLabel')} />
        </div>
      </div>
      <p className='mt-6'>
        {t('emailText')}{' '}
        <a href='mailto:ricardo@rimakes.com?subject=Let%27s%20work%20together&body=Hi%20Ricardo%2C%0A%0AI%27d%20like%20to%20discuss...'>
          ricardo@rimakes.com
        </a>
      </p>
    </div>
  );
};
