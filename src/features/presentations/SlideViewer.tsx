'use client';

import type { ReactNode } from 'react';

import { PresentationProvider } from './presentation-context';
import { SlideStage, type SlideMeta, type SlideTheme } from './SlideStage';
import { useSyncedSlide } from './useSyncedSlide';

type SlideViewerProps = {
  slug: string;
  slides: ReactNode[];
  theme?: SlideTheme;
  slidesMeta?: SlideMeta[];
};

/**
 * Passive viewer surface: follows the presenter, never navigates on its own.
 */
export function SlideViewer({
  slug,
  slides,
  theme,
  slidesMeta,
}: SlideViewerProps) {
  const index = useSyncedSlide(slug);
  return (
    <PresentationProvider slug={slug}>
      <SlideStage
        slides={slides}
        index={index}
        theme={theme}
        slidesMeta={slidesMeta}
        hideCounter
      />
    </PresentationProvider>
  );
}
