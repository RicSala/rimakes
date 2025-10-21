import { SectionHeader } from '@/app/[locale]/(unauth)/work-with-me/components/SectionHeader';
import { technologies as technologiesQuery } from '@/shared/cms/queries/technologyQueries';
import BlurFade from '@/shared/components/BlurFade';
import { Badge } from '@/shared/components/ui/badge';
import { Icon } from 'basehub/react-icon';
import { getTranslations } from 'next-intl/server';

export async function TechnologiesSection() {
  const technologies = await technologiesQuery.getTechnologies();
  const t = await getTranslations('technologiesSection');

  return (
    <section className='home-section' id='technologies'>
      <SectionHeader title={t('title')} description={t('description')} />
      <BlurFade key='technologies'>
        <div className='flex flex-wrap gap-2 justify-center'>
          {technologies.map((technology) => (
            <Badge key={technology._id} className='text-base rounded-full'>
              {technology.icon && (
                <Icon
                  content={technology.icon || ''}
                  components={{
                    svg: (props) => (
                      <svg
                        {...props}
                        className='text-primary-foreground'
                        fill='currentColor'
                      />
                    ),
                  }}
                />
              )}
              {technology._title}
            </Badge>
          ))}
        </div>
      </BlurFade>
    </section>
  );
}
