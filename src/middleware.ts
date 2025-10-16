import { customIntlMiddleware } from '@/shared/internationalization/intlMiddleware';
import { composeMiddleware } from '@/shared/middleware/chain';

export default composeMiddleware([customIntlMiddleware]);

export const config = {
  // Skip all paths that should not be internationalized
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};
