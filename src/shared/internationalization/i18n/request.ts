import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';

import { routing } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  // if (!routing.locales.includes(requested as any)) notFound();
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const [common, comparisonTable, hero, ourProcess, heroSection, navbar] =
    await Promise.all([
      import(
        `@/app/[locale]/(unauth)/work-with-me/components/ComparisonTable/dictionaries/${locale}.json`
      ).then((m) => m.default),
      import(
        `@/shared/internationalization/dictionaries/${locale}/shared.json`
      ).then((m) => m.default),
      import(
        `@/app/[locale]/(unauth)/work-with-me/components/Hero/dictionaries/${locale}.json`
      ).then((m) => m.default),
      // add our process messages
      import(
        `@/app/[locale]/(unauth)/work-with-me/components/OurProcess/dictionaries/${locale}.json`
      ).then((m) => m.default),
      import(
        `@/app/[locale]/(unauth)/components/dictionaries/${locale}.json`
      ).then((m) => m.default),
      import(`@/shared/components/dictionaries/${locale}/navbar.json`).then(
        (m) => m.default
      ),
    ]);

  return {
    locale,
    messages: {
      ...common,
      ...comparisonTable,
      ...hero,
      ...ourProcess,
      ...heroSection,
      ...navbar,
    },
  };
});
