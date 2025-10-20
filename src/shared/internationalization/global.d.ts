import common from './dictionaries/es.json';
import comparisonTable from '@/app/[locale]/(unauth)/work-with-me/components/ComparisonTable/dictionaries/es.json';
import hero from '@/app/[locale]/(unauth)/work-with-me/components/Hero/dictionaries/es.json';
import ourProcess from '@/app/[locale]/(unauth)/work-with-me/components/OurProcess/dictionaries/es.json';
import heroSection from '@/app/[locale]/(unauth)/components/dictionaries/es.json';
import navbar from '@/shared/components/dictionaries/es/navbar.json';

import { routing } from './i18n/config';

declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof common &
      typeof comparisonTable &
      typeof hero &
      typeof ourProcess &
      typeof heroSection &
      typeof navbar;
    //  & typeof marketing;
    Locale: (typeof routing.locales)[number];
  }
}
