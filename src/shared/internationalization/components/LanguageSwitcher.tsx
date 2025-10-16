'use client';

import { useParams } from 'next/navigation';
import { Locale, useLocale, useTranslations } from 'next-intl';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { routing } from '@/shared/internationalization/i18n/config';
import {
  useRouter,
  usePathname,
} from '@/shared/internationalization/navigation';

export const LanguageSwitcher = ({
  defaultValue = 'en',
  onChange,
}: {
  defaultValue?: Locale;
  onChange?: (locale: Locale) => void;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations('localeSwitcher');

  function onSelectChange(locale: Locale) {
    // REVIEW: why putting this _after_ was causing problems?
    onChange?.(locale);
    // @ts-expect-error -- TypeScript will validate that only known `params`
    router.replace({ pathname, params: params as never }, { locale });
  }

  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={onSelectChange}
      value={locale}
    >
      <SelectTrigger className='w-[200px] max-w-full'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((cur) => (
          <SelectItem key={cur} value={cur}>
            {t(cur)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
