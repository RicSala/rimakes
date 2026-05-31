import { SectionHeader } from '@/app/[locale]/(unauth)/work-with-me/components/SectionHeader';
import BlurFade from '@/shared/components/BlurFade';
import { Badge } from '@/shared/components/ui/badge';
import { PORTFOLIO_TECHNOLOGIES } from '@/shared/config/portfolio';
import { getTranslations } from 'next-intl/server';

function TechnologyIcon({ src }: { src: string }) {
  return (
    <span
      aria-hidden
      className='inline-block size-4 shrink-0 bg-current'
      style={{
        WebkitMaskImage: `url(${src})`,
        WebkitMaskPosition: 'center',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskImage: `url(${src})`,
        maskPosition: 'center',
        maskRepeat: 'no-repeat',
        maskSize: 'contain',
      }}
    />
  );
}

export async function TechnologiesSection() {
  const t = await getTranslations('technologiesSection');

  return (
    <section className='home-section' id='technologies'>
      <SectionHeader title={t('title')} description={t('description')} />
      <BlurFade key='technologies'>
        <div className='flex flex-wrap gap-2 justify-center'>
          {PORTFOLIO_TECHNOLOGIES.map((technology) => (
            <Badge key={technology.id} className='text-base rounded-full'>
              {technology.icon ? <TechnologyIcon src={technology.icon} /> : null}
              {technology.title}
            </Badge>
          ))}
        </div>
      </BlurFade>
    </section>
  );
}
