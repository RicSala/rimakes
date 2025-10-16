'use client';

import { usePathname } from '@/shared/internationalization/navigation';
import { cn } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../../public/images/brand/rimakes-logo.png';

type NavbarProps = {
  className?: string;
};
export function Navbar({ className }: NavbarProps) {
  const pathname = usePathname();
  const t = useTranslations('navbar');
  return (
    <>
      <nav className={cn('w-full', className)}>
        <div className='flex items-center justify-between px-6 py-4 max-w-screen-xl mx-auto'>
          <Link href='/' className='relative'>
            <Image src={logo} alt='logo' width={150} height={100} />
          </Link>
          <ul className='flex items-center gap-4'>
            {MENU_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    'rounded-md px-2 py-1 text-sm font-medium',
                    pathname.match(item.regex) &&
                      'bg-primary text-primary-foreground'
                  )}
                >
                  {t(item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}

const MENU_ITEMS = [
  {
    label: 'myApps',
    href: `${process.env.NEXT_PUBLIC_APP_URL}#projects`,
    regex: '^/my-apps',
  },
  {
    label: 'blog',
    href: '/blog',
    regex: '^/blog',
  },
  {
    label: 'openSource',
    href: `${process.env.NEXT_PUBLIC_APP_URL}#open-source`,
    regex: '^/open-source',
  },
] as const;
