import type { SlideTheme } from '../SlideStage';

// Theme for code decks: a full-bleed stage (templates own their own layout),
// no Markdoc prose wrapper, and no built-in counter.
export const CODE_THEME: SlideTheme = {
  stage: 'relative min-h-screen w-full',
  content: '',
  hideCounter: true,
};

export type { SlideTheme } from '../SlideStage';

export { SlideFrame, type SlideFrameProps } from './SlideFrame';
export { TitleSlide } from './TitleSlide';
export { SectionSlide } from './SectionSlide';
export { BulletsSlide } from './BulletsSlide';
export { TwoColumnSlide } from './TwoColumnSlide';
export { CodeSlide } from './CodeSlide';
export { ImageSlide } from './ImageSlide';
export { ProseSlide } from './ProseSlide';
export { PromptSlide } from './PromptSlide';
