import { getPathname } from '@/shared/internationalization/navigation';
import { Locale } from 'next-intl';
import { NextRouter } from 'next/router';

export const goToPathClientTool = (
  input: unknown,
  locale: Locale,
  router: NextRouter
) => {
  {
    // @ts-expect-error - toolCall.input is of type unknown
    const path = input.path as string;

    // Check if we're already on the page
    const [pathname, hash] = path.split('#');
    const currentPath = window.location.pathname;

    let localizedPathname: string | undefined;
    if (pathname) {
      try {
        localizedPathname = getPathname({
          // @ts-expect-error - idk, idc
          href: pathname,
          locale: locale,
        });
      } catch (error) {
        console.error('error', error);
      }
    }

    if (hash && (!localizedPathname || localizedPathname === currentPath)) {
      // Same page, just scroll to anchor
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Different page, navigate then scroll
      router.push(path);
      if (hash) {
        console.log('scrolling to hash', hash);
        // Give Next.js time to render the new page
        setTimeout(() => {
          const element = document.getElementById(hash);
          console.log('element', element);
          element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 1000);
      }
    }
  }
};
