import { Link } from '@/shared/internationalization/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',
  alternateLinks: false, // Disable HTTP header hreflang to avoid duplicates with HTML tags
  pathnames: {
    '/': '/',
    '/#projects': '/#projects',
    '/#open-source': '/#open-source',
    '/blog': '/blog',
    '/work-with-me': {
      es: '/trabaja-conmigo',
      en: '/work-with-me',
    },
  },
});

// Extract route paths as a union type
export type Routes = keyof typeof routing.pathnames;
// Better this one:
export type RouteNew = Parameters<typeof Link>[0]['href'];
