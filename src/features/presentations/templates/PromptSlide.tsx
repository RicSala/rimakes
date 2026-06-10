import type { ReactNode } from 'react';

import { Prompt } from '@/shared/components/Prompt';

import { SlideFrame } from './SlideFrame';

type PromptSlideProps = {
  /** Optional slide heading above the prompt block. */
  title?: ReactNode;
  /** Label shown on the prompt block's header bar. */
  promptTitle?: string;
  children: ReactNode;
};

/** Wraps the `Prompt` client island (collapsible, copyable) on a slide. */
export function PromptSlide({ title, promptTitle, children }: PromptSlideProps) {
  return (
    <SlideFrame title={title} align='start'>
      <div className='mt-6 w-full max-w-3xl text-lg'>
        <Prompt title={promptTitle}>{children}</Prompt>
      </div>
    </SlideFrame>
  );
}
