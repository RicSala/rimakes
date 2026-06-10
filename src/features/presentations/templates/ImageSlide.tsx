import Image, { type StaticImageData } from 'next/image';
import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

import { SlideFrame } from './SlideFrame';

type ImageSlideProps = {
  /** A path under /public ("/images/foo.png") or a statically-imported image. */
  src: string | StaticImageData;
  alt: string;
  title?: ReactNode;
  caption?: ReactNode;
  /** 'contain' (default) shows the whole image; 'cover' fills and crops. */
  fit?: 'contain' | 'cover';
  /** Edge-to-edge: the image fills the entire slide, caption overlaid. */
  bleed?: boolean;
  background?: string;
};

/**
 * An image-centric slide. Uses `next/image` with `fill`, so a `/public` path
 * and a statically-imported asset behave identically — the container defines
 * the area and `fit` controls cropping.
 */
export function ImageSlide({
  src,
  alt,
  title,
  caption,
  fit = 'contain',
  bleed = false,
  background,
}: ImageSlideProps) {
  const objectFit = fit === 'cover' ? 'object-cover' : 'object-contain';

  if (bleed) {
    return (
      <div
        className={cn('relative min-h-screen w-full overflow-hidden', background)}
      >
        <Image src={src} alt={alt} fill priority sizes='100vw' className={objectFit} />
        {title || caption ? (
          <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-10 text-white animate-in fade-in duration-500'>
            {title ? (
              <h2 className='text-3xl font-bold sm:text-4xl'>{title}</h2>
            ) : null}
            {caption ? (
              <p className='mt-2 text-lg text-white/80'>{caption}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <SlideFrame
      title={title}
      background={background}
      className='items-center text-center'
    >
      <div className='relative mt-6 h-[60vh] w-full'>
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes='(min-width: 1024px) 60vw, 90vw'
          className={cn('rounded-xl', objectFit)}
        />
      </div>
      {caption ? (
        <p className='mt-4 text-lg text-muted-foreground'>{caption}</p>
      ) : null}
    </SlideFrame>
  );
}
