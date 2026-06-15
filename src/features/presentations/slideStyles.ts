import type { SlideMeta } from './SlideStage';

// `bg` directive value → a token-scope class. The class redefines the design
// tokens for the slide subtree, so background, prose, AND components adapt.
// Exported so the overview thumbnails and the continuous handout can tint
// themselves with the same scope.
export const SCHEME_CLASS: Record<string, string> = {
  brand: 'slide-theme-brand',
  dark: 'dark',
};

export const CONTENT_STRUCTURE =
  'markdoc prose prose-lg w-full prose-h1:text-4xl prose-h1:font-bold prose-h2:text-3xl prose-h2:font-bold';
export const CONTENT_COLOR_LIGHT =
  'text-primary prose-a:text-primary prose-headings:text-primary';

// Per-slide `width`: the frame caps the chrome, the content caps the column. Both
// widen together so comparisons/tables (`{% slide width="wide" /%}`) get room
// while normal prose keeps a readable line length.
export const FRAME_WIDTH: Record<string, string> = {
  normal: 'max-w-4xl',
  wide: 'max-w-6xl',
  full: 'max-w-7xl',
};
export const CONTENT_WIDTH: Record<string, string> = {
  normal: 'max-w-3xl',
  wide: 'max-w-5xl',
  full: 'max-w-6xl',
};

/**
 * Resolve the appearance of a Keystatic slide from its `{% slide %}` metadata:
 * the token-scope class (`brand`/`dark`), the active width preset, and the
 * derived content/frame width classes. Shared by `SlideStage` (the live/synced
 * surface) and `ContinuousDeck` (the printable handout) so both stay in sync.
 */
export function resolveSlideAppearance(meta?: SlideMeta) {
  const schemeClass = meta?.bg ? SCHEME_CLASS[meta.bg] ?? '' : '';
  const widthKey = meta?.width && CONTENT_WIDTH[meta.width] ? meta.width : 'normal';
  const contentClass = `${CONTENT_STRUCTURE} ${CONTENT_WIDTH[widthKey]} ${
    schemeClass ? 'prose-invert' : CONTENT_COLOR_LIGHT
  }`;
  return {
    schemeClass,
    widthKey,
    contentClass,
    frameWidth: FRAME_WIDTH[widthKey],
  };
}
