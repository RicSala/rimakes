import common from './dictionaries/es.json';
import comparisonTable from '@/app/[locale]/(unauth)/work-with-me/components/ComparisonTable/dictionaries/es.json';
import hero from '@/app/[locale]/(unauth)/work-with-me/components/Hero/dictionaries/es.json';
import ourProcess from '@/app/[locale]/(unauth)/work-with-me/components/OurProcess/dictionaries/es.json';
import heroSection from '@/app/[locale]/(unauth)/components/dictionaries/es.json';
import technologiesSection from '@/app/[locale]/(unauth)/components/TechnologiesSection/dictionaries/es.json';
import projectsSection from '@/app/[locale]/(unauth)/components/ProjectsSection/dictionaries/es.json';
import openSourceSection from '@/app/[locale]/(unauth)/components/OpenSourceSection/dictionaries/es.json';
import latestPostSection from '@/app/[locale]/(unauth)/components/LatestPostSection/dictionaries/es.json';
import banner from '@/app/[locale]/(unauth)/work-with-me/components/Banner/dictionaries/es.json';
import navbar from '@/shared/components/dictionaries/es/navbar.json';

import { routing } from './i18n/config';

declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof common &
      typeof comparisonTable &
      typeof hero &
      typeof ourProcess &
      typeof heroSection &
      typeof technologiesSection &
      typeof projectsSection &
      typeof openSourceSection &
      typeof latestPostSection &
      typeof banner &
      typeof navbar;
    //  & typeof marketing;
    Locale: (typeof routing.locales)[number];
  }
}
