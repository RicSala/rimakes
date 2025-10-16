import { Feature } from '@/app/[locale]/(unauth)/work-with-me/components/Hero/Hero';
import { ScheduleButton } from '@/shared/components/ScheduleButton';
import { SectionHeader } from '@/app/[locale]/(unauth)/work-with-me/components/SectionHeader';
import { Check } from 'lucide-react';
export function Pricing() {
  return (
    <div className='flex flex-col items-center gap-16 max-w-full w-full'>
      <SectionHeader
        title='Precio'
        description='Precio fijo, sin sorpresas y con garantía de devolución'
      />

      {/* New Variation 9: Modern Accent */}
      <div className='relative overflow-hidden rounded-xl bg-white p-1 w-full border border-slate-200'>
        <div className='absolute inset-x-0 top-0 h-1 bg-primary'></div>
        <div className='p-6'>
          <div className='space-y-6'>
            <div>
              <div className='flex justify-between'>
                <h2 className='text-xl font-semibold text-slate-700'>
                  Herramienta IA
                </h2>
                <div className='rounded-full bg-rose-50 px-3 py-1'>
                  <span className='text-sm font-medium text-rose-600'>
                    Ahorra 2.000€
                  </span>
                </div>
              </div>
              <div className='mt-4 flex items-baseline gap-2 justify-center'>
                <span className='text-3xl font-semibold text-slate-500 line-through mr-2'>
                  7.300€
                </span>
                <p className='flex items-baseline'>
                  <span className='text-5xl font-bold text-slate-700'>
                    5.300€
                  </span>
                  <span className='ml-2 text-slate-500'>/project</span>
                </p>
              </div>
            </div>
            <ul className='grid gap-3'>
              {[
                'Web application development',
                'Professional UI/UX design',
                'Essential integrations',
                'SEO optimization',
                'Launch support',
              ].map((feature, i) => (
                <li
                  key={i}
                  className='flex items-center rounded-lg border border-slate-100 p-3'
                >
                  <Check className='h-4 w-4 text-primary' />
                  <span className='ml-3 text-slate-600'>{feature}</span>
                </li>
              ))}
            </ul>
            <div className='flex flex-col gap-3'>
              <div className='flex justify-center gap-4 flex-wrap'>
                <Feature text='Precio fijo garantizado' />
                <Feature text='Sin costes ocultos' />
                <Feature text='Formación incluida' />
              </div>
              <ScheduleButton />
              <div className='text-center'>
                <span className='text-sm text-slate-500'>
                  Solo 2 Plazas disponibles
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
