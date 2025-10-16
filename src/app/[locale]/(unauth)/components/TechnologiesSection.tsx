import { SectionHeader } from '@/app/[locale]/(unauth)/work-with-me/components/SectionHeader';
import { technologies as technologiesQuery } from '@/shared/cms/queries';
import BlurFade from '@/shared/components/BlurFade';
import { Badge } from '@/shared/components/ui/badge';
import { Icon } from 'basehub/react-icon';
type TechnologiesSectionProps = {};

export async function TechnologiesSection(props: TechnologiesSectionProps) {
  const technologies = await technologiesQuery.getTechnologies('en');
  return (
    <div className='space-y-6 scroll-mt-24' id='technologies'>
      <SectionHeader
        title='Technologies I use'
        description='These are the main tools in my toolbox ⚒️'
      />
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
                        className='text-white hover:text-blue-600'
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
    </div>
  );
}
