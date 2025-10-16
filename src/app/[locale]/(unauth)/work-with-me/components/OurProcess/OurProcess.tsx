import { getTranslations } from 'next-intl/server';
import { SectionHeader } from '../SectionHeader';

export async function OurProcess() {
  const t = await getTranslations('our-process');
  return (
    <>
      <SectionHeader title={t('title')} description={t('description')} />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {([1, 2, 3] as const).map((step) => (
          <div key={step}>
            <h3>{t(`steps.${step}.title`)}</h3>
            <p>{t(`steps.${step}.description`)}</p>
          </div>
        ))}
      </div>
    </>
  );
}
