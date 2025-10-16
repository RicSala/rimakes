import createNextIntlPlugin from 'next-intl/plugin';

export const withNextIntl = createNextIntlPlugin(
  './src/shared/internationalization/i18n/request.ts'
);
