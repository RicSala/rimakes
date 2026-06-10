import type { ReactNode } from 'react';

import { SlideFrame } from './SlideFrame';

type TitleSlideProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  background?: string;
};

/** Opening / closing slide: a centered headline with an optional eyebrow + subtitle. */
export function TitleSlide({
  title,
  subtitle,
  eyebrow,
  background,
}: TitleSlideProps) {
  return (
    <SlideFrame background={background} className='items-center text-center'>
      {eyebrow ? (
        <div className='mb-6 text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground'>
          {eyebrow}
        </div>
      ) : null}
      <h1 className='text-balance text-6xl font-extrabold tracking-tight text-primary sm:text-7xl'>
        {title}
      </h1>
      {subtitle ? (
        <p className='mt-6 max-w-3xl text-balance text-xl text-muted-foreground sm:text-2xl'>
          {subtitle}
        </p>
      ) : null}
    </SlideFrame>
  );
}
