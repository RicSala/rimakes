'use client';

import type { ReactNode } from 'react';

import { SlideStage } from './SlideStage';
import { useSyncedSlide } from './useSyncedSlide';

type SlideViewerProps = {
  slug: string;
  slides: ReactNode[];
};

/**
 * Passive viewer surface: follows the presenter, never navigates on its own.
 */
export function SlideViewer({ slug, slides }: SlideViewerProps) {
  const index = useSyncedSlide(slug);
  return <SlideStage slides={slides} index={index} />;
}
