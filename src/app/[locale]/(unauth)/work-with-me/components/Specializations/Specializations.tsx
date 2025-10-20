import { SectionHeader } from '@/app/[locale]/(unauth)/work-with-me/components/SectionHeader';

export function Specializations() {
  return (
    <>
      <SectionHeader title='Specializations' description='Specializations' />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        we focus on AI apps.
      </div>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const specializations = {
  'image-generation-apps': {
    title: 'Image Generation Apps',
    description: 'We focus on AI image generation apps',
  },
  'text-generation-apps': {
    title: 'Text Generation Apps',
    description: 'We focus on AI text generation apps',
  },
  'ia-chrome-extensions': {
    title: 'IA Chrome Extensions',
    description: 'We focus on AI chrome extensions',
  },
  'ia-consulting': {
    title: 'IA Consulting',
    description: 'We focus on AI consulting',
  },
  'custom-gpts': {
    title: 'Custom GPTs',
    description: 'We focus on custom GPTs',
  },
  'ai-tools': {
    title: 'AI Tools',
    description: 'We focus on AI tools',
  },
};
