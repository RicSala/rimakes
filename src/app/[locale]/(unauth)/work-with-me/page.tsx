import { Banner } from '@/app/[locale]/(unauth)/work-with-me/components/Banner/Banner';
import { ComparisonTable } from '@/app/[locale]/(unauth)/work-with-me/components/ComparisonTable/ComparisonTable';
import { Hero } from '@/app/[locale]/(unauth)/work-with-me/components/Hero/Hero';
import { OurProcess } from '@/app/[locale]/(unauth)/work-with-me/components/OurProcess/OurProcess';
import { Pricing } from '@/app/[locale]/(unauth)/work-with-me/components/Pricing/Pricing';
import { Specializations } from '@/app/[locale]/(unauth)/work-with-me/components/Specializations/Specializations';
import { Technologies } from '@/app/[locale]/(unauth)/work-with-me/components/Technologies/Technologies';

export default function Home() {
  return (
    <div className='flex flex-col gap-16'>
      <Hero />
      <ComparisonTable />
      <OurProcess />
      <Pricing />
      <Specializations />
      <Technologies />
      <Banner />
    </div>
  );
}
