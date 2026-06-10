import type { ReactNode } from 'react';

import { SlideFrame } from './SlideFrame';

type BulletsSlideProps = {
  title?: ReactNode;
  eyebrow?: ReactNode;
  items: ReactNode[];
  background?: string;
};

/** A heading plus a list of bullets that stagger in on slide entry. */
export function BulletsSlide({
  title,
  eyebrow,
  items,
  background,
}: BulletsSlideProps) {
  return (
    <SlideFrame
      background={background}
      eyebrow={eyebrow}
      title={title}
      align='start'
    >
      <ul className='mt-8 space-y-4 text-2xl text-primary sm:text-3xl'>
        {items.map((item, i) => (
          <li
            key={i}
            className='flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2'
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
          >
            <span className='mt-3 h-2 w-2 shrink-0 rounded-full bg-primary sm:mt-4' />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </SlideFrame>
  );
}
