import type { ReactNode } from 'react';

import { renderMarkdoc } from '@/shared/blog/render';

import { SlideFrame } from './SlideFrame';

type ProseSlideProps = {
  /** Raw Markdoc/Markdown — rendered with the same pipeline as the blog. */
  markdown: string;
  title?: ReactNode;
};

/**
 * Markdown escape-hatch slide. The code-deck stage sets `content: ''`, so this
 * adds its OWN `prose` wrapper to style the rendered Markdoc.
 */
export function ProseSlide({ markdown, title }: ProseSlideProps) {
  return (
    <SlideFrame title={title} align='start'>
      <div className='markdoc prose prose-lg mt-6 max-w-none text-primary prose-headings:text-primary prose-a:text-primary'>
        {renderMarkdoc(markdown)}
      </div>
    </SlideFrame>
  );
}
