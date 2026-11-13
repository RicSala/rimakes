import { customIntlMiddleware } from '@/shared/internationalization/intlMiddleware';
import { composeMiddleware } from '@/shared/middleware/chain';

export default composeMiddleware([customIntlMiddleware]);

export const config = {
  // Skip all paths that should not be internationalized.
  // Open Graph images too: Next builds their URL with the locale (/es/…), and
  // the i18n middleware would redirect it, adding a hop for link-preview bots.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*opengraph-image|.*\\..*).*)',
  ],
};
