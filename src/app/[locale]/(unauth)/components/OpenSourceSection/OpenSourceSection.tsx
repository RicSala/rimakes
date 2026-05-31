import { SectionHeader } from '@/app/[locale]/(unauth)/work-with-me/components/SectionHeader';
import { OpenSourceCard } from '@/shared/components/OpenSourceCard';
import { OPEN_SOURCE_PROJECT_CARDS } from '@/shared/config/const/openSourceProjects';
import { getTranslations } from 'next-intl/server';

export const OpenSourceSection = async () => {
  const t = await getTranslations('openSourceSection');

  return (
    <section className='home-section' id='open-source'>
      <SectionHeader title={t('title')} description={t('description')} />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {OPEN_SOURCE_PROJECT_CARDS.map((project) => (
          <OpenSourceCard
            key={project.id}
            title={project.title}
            description={project.description}
            githubLink={project.githubLink ?? undefined}
            docsLink={project.docsLink ?? undefined}
            imageUrl={project.imageUrl ?? undefined}
            why={project.why ?? undefined}
            role={project.role ?? undefined}
            postPath={project.postPath ?? undefined}
          />
        ))}
      </div>
    </section>
  );
};
