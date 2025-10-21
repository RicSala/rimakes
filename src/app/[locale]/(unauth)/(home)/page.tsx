import { HeroSection } from '@/app/[locale]/(unauth)/components/HeroSection';
import { LatestPostSection } from '@/app/[locale]/(unauth)/components/LatestPostSection/LatestPostSection';
import { OpenSourceSection } from '@/app/[locale]/(unauth)/components/OpenSourceSection/OpenSourceSection';
import { TechnologiesSection } from '@/app/[locale]/(unauth)/components/TechnologiesSection/TechnologiesSection';
import { Banner } from '@/app/[locale]/(unauth)/work-with-me/components/Banner/Banner';
import { ProjectsSection } from '@/app/[locale]/(unauth)/components/ProjectsSection/ProjectsSection';

export default async function Home() {
  return (
    <div className='flex flex-col gap-32'>
      <HeroSection />
      <TechnologiesSection />
      <ProjectsSection />
      <OpenSourceSection />
      <LatestPostSection />
      <Banner />
    </div>
  );
}
