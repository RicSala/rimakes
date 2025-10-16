'use client';

import { useState } from 'react';
import { Clock, PiggyBank, Brain, Shield, DollarSign } from 'lucide-react';
import { SectionHeader } from '../SectionHeader';
import { ScheduleButton } from '@/shared/components/ScheduleButton';
import { useTranslations } from 'next-intl';

const comparisonData = [
  {
    icon: <Clock className='w-4 h-4 text-primary/40' />,
    feature: 'time',
  },
  {
    icon: <Shield className='w-4 h-4 text-primary/40' />,
    feature: 'guarantee',
  },
  {
    icon: <PiggyBank className='w-4 h-4 text-primary/40' />,
    feature: 'price',
  },
  {
    icon: <Brain className='w-4 h-4 text-primary/40' />,
    feature: 'ia-experience',
  },
  {
    icon: <DollarSign className='w-4 h-4 text-primary/40' />,
    feature: 'price-model',
  },
];

export const ComparisonTable = () => {
  const [activeTab, setActiveTab] = useState('rimakes');
  const t = useTranslations('comparison-table');

  return (
    <div className='max-w-4xl mx-auto p-4 sm:p-6 w-full'>
      <SectionHeader
        title={t('title')}
        description={t('description')}
        className='mb-8'
      />

      <div className='hidden sm:block w-full'>
        <table className='w-full border-collapse'>
          <thead>
            <tr>
              <th className='w-1/3 py-3 px-4 text-left'>
                {t('header-characteristics')}
              </th>
              <th className='w-1/3 py-3 px-4 text-center bg-blue-50'>
                {t('header-rimakes')}
              </th>
              <th className='w-1/3 py-3 px-4 text-center'>
                {t('header-traditional')}
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className='py-4 px-4 flex items-center'>
                  {item.icon}
                  {/* @ts-expect-error - tbd */}
                  <span className='ml-2 font-medium'>{t(item.feature)}</span>
                </td>
                <td className='py-4 px-4 text-center bg-blue-50 font-semibold text-blue-600'>
                  {/* @ts-expect-error - tbd */}
                  {t(`rimakes-${item.feature}`)}
                </td>
                <td className='py-4 px-4 text-center'>
                  {/* @ts-expect-error - tbd */}
                  {t(`traditional-${item.feature}`)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='sm:hidden'>
        <div className='flex border-b mb-4'>
          <button
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === 'rimakes'
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'bg-gray-100'
            }`}
            onClick={() => setActiveTab('rimakes')}
          >
            rimakes.
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === 'traditional'
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'bg-gray-100'
            }`}
            onClick={() => setActiveTab('traditional')}
          >
            Agencia Tradicional
          </button>
        </div>
        {comparisonData.map((item, index) => (
          <div key={index} className='mb-4 p-4 bg-white rounded-lg shadow'>
            <div className='flex items-center mb-2'>
              {item.icon}
              {/* @ts-expect-error - tbd */}
              <span className='ml-2 font-medium'>{t(item.feature)}</span>
            </div>
            <div className='mt-2'>
              <span className='font-semibold text-blue-600'>
                {activeTab === 'rimakes'
                  ? // @ts-expect-error - tbd
                    t(`rimakes-${item.feature}`)
                  : // @ts-expect-error - tbd
                    t(`traditional-${item.feature}`)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-8 sm:mt-10 text-center'>
        <ScheduleButton />
      </div>
    </div>
  );
};
