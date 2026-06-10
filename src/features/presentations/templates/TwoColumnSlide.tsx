import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

import { SlideFrame } from './SlideFrame';

type Ratio = '1-1' | '2-1' | '1-2';

const COLS: Record<Ratio, string> = {
  '1-1': 'sm:grid-cols-2',
  '2-1': 'sm:grid-cols-3 sm:[&>*:first-child]:col-span-2',
  '1-2': 'sm:grid-cols-3 sm:[&>*:last-child]:col-span-2',
};

type TwoColumnSlideProps = {
  title?: ReactNode;
  left: ReactNode;
  right: ReactNode;
  ratio?: Ratio;
  background?: string;
};

/** Two side-by-side columns with a selectable width ratio. */
export function TwoColumnSlide({
  title,
  left,
  right,
  ratio = '1-1',
  background,
}: TwoColumnSlideProps) {
  return (
    <SlideFrame background={background} title={title} align='start'>
      <div
        className={cn(
          'mt-8 grid grid-cols-1 gap-10 text-xl text-primary',
          COLS[ratio]
        )}
      >
        <div>{left}</div>
        <div>{right}</div>
      </div>
    </SlideFrame>
  );
}
