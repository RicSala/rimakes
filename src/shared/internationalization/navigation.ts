import { routing } from '@/shared/internationalization/i18n/config';
import { createNavigation } from 'next-intl/navigation';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
