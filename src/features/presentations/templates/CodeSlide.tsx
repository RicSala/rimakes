import type { ReactNode } from 'react';

import { MarkdocCodeBlock } from '@/shared/blog/components/MarkdocCodeBlock';

import { SlideFrame } from './SlideFrame';

type CodeSlideProps = {
  title?: ReactNode;
  code: string;
  language?: string;
  caption?: ReactNode;
};

/**
 * A code-focused slide. `MarkdocCodeBlock` is an async server component that
 * highlights with Shiki at render time; the RSC renderer resolves it while
 * producing the payload, so this stays a plain (non-async) layout component.
 */
export function CodeSlide({ title, code, language, caption }: CodeSlideProps) {
  return (
    <SlideFrame title={title} align='start'>
      <div className='mt-6 w-full [&_pre]:text-base'>
        <MarkdocCodeBlock code={code} language={language} />
      </div>
      {caption ? (
        <p className='mt-2 text-lg text-muted-foreground'>{caption}</p>
      ) : null}
    </SlideFrame>
  );
}
