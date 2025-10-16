import { HeroSection } from '@/app/[locale]/(unauth)/components/HeroSection';
import { LatestPostSection } from '@/app/[locale]/(unauth)/components/LatestPostSection';
import { OpenSourceSection } from '@/app/[locale]/(unauth)/components/OpenSourceSection';
import { TechnologiesSection } from '@/app/[locale]/(unauth)/components/TechnologiesSection';
import { Banner } from '@/app/[locale]/(unauth)/work-with-me/components/Banner/Banner';
import { ProjectsSection } from '@/app/[locale]/(unauth)/components/ProjectsSection';

export default async function Home() {
  return (
    <div className='flex flex-col gap-24'>
      <HeroSection />
      <TechnologiesSection />
      <ProjectsSection />
      <OpenSourceSection />
      <LatestPostSection />
      <Banner
        title='Make your company faster / smarter with custom AI tools'
        description='I can create the secret weapon your company needs to stay ahead of the competition'
        buttonLabel='Schedule a consultation'
      />
    </div>
  );
}
