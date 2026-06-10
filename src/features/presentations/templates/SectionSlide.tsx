import type { ReactNode } from 'react';

import { SlideFrame } from './SlideFrame';

type SectionSlideProps = {
  label: ReactNode;
  /** Optional chapter marker, e.g. "01". */
  index?: ReactNode;
  background?: string;
};

/** Chapter divider: a large left-aligned label with an optional index marker. */
export function SectionSlide({ label, index, background }: SectionSlideProps) {
  return (
    <SlideFrame background={background} align='start'>
      {index ? (
        <div className='font-mono text-2xl font-semibold text-muted-foreground'>
          {index}
        </div>
      ) : null}
      <h2 className='mt-2 text-balance text-5xl font-bold tracking-tight text-primary sm:text-6xl'>
        {label}
      </h2>
    </SlideFrame>
  );
}
