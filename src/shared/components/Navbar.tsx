'use client';

import { usePathname } from '@/shared/internationalization/navigation';
import { cn } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../../public/images/brand/rimakes-logo.png';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';
import { Button } from '@/shared/components/ui/button';

type NavbarProps = {
  className?: string;
};
export function Navbar({ className }: NavbarProps) {
  return (
    <>
      <nav className={cn('w-full', className)}>
        <div className='flex items-center justify-between px-6 py-4 max-w-screen-xl mx-auto'>
          <Link href='/' className='relative'>
            <Image src={logo} alt='logo' width={150} height={100} />
          </Link>

          {/* Desktop menu */}
          <MenuContent />

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className='md:hidden'>
              <Button variant='outline'>Open</Button>
            </SheetTrigger>
            <SheetTitle className='sr-only'>Menu</SheetTitle>
            <SheetContent>
              <MenuContent className='flex flex-col items-center gap-4 py-18 ' />
            </SheetContent>
          </Sheet>
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
    label: 'openSource',
    href: `${process.env.NEXT_PUBLIC_APP_URL}#open-source`,
    regex: '^/open-source',
  },
  {
    label: 'blog',
    href: '/blog',
    regex: '^/blog',
  },
] as const;

export const MenuContent = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const t = useTranslations('navbar');
  return (
    <ul className={cn('hidden md:flex items-center gap-4', className)}>
      {MENU_ITEMS.map((item) => (
        <li key={item.label}>
          <Link
            href={item.href}
            className={cn(
              'rounded-md px-2 py-1 text-sm font-medium',
              pathname.match(item.regex) && 'bg-primary text-primary-foreground'
            )}
          >
            {t(item.label)}
          </Link>
        </li>
      ))}
    </ul>
  );
};
