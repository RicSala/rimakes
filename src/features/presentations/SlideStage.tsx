import type { ReactNode } from 'react';

import { SlideTags } from './SlideTags';
import {
  CONTENT_COLOR_LIGHT,
  CONTENT_STRUCTURE,
  CONTENT_WIDTH,
  resolveSlideAppearance,
  SCHEME_CLASS,
} from './slideStyles';

// Re-exported so existing importers (e.g. overview thumbnails) keep working
// after the per-slide style constants moved to `slideStyles`.
export { SCHEME_CLASS };

export type SlideTheme = {
  /** Classes on the full-screen stage wrapper. */
  stage?: string;
  /** Classes on the inner content container. Pass '' for a full-bleed surface. */
  content?: string;
  /** Hide the bottom-right "n / total" counter. */
  hideCounter?: boolean;
};

/**
 * Per-slide chrome for Keystatic decks, parsed from a leading `{% slide %}`
 * directive (see `extractSlideMeta`). Applied at the stage level because it
 * recolors the whole surface / pins overlays to the content edge — things
 * content-level markup inside the centered column can't reach.
 */
export type SlideMeta = {
  /** Background scheme key, e.g. 'brand' (indigo) or 'dark'. */
  bg?: string;
  /** Corner labels, e.g. ['Advanced', 'theory']. */
  tags?: string[];
  /** Content width preset, e.g. 'wide' / 'full' (for comparisons / tables). */
  width?: string;
  /**
   * Marks a slide the audience may navigate to on their own (e.g. material
   * already covered). The viewer can step ←/→ among `public` slides; the
   * presenter's live moves still override (everyone mirrors the projected slide).
   */
  public?: boolean;
};

// Code-deck fallback (used only if a theme omits `stage`).
const DEFAULT_STAGE =
  'relative flex min-h-screen w-full items-center justify-center px-6 py-20 sm:px-12';

// Keystatic path: a full-bleed stage paints `bg-background` (which a theme scope
// can re-point), and a centered, border-less content wrapper caps the width so
// the chrome doesn't drift to the screen corner on big displays.
const KEYSTATIC_STAGE = 'relative min-h-screen w-full bg-background text-foreground';
const KEYSTATIC_FRAME =
  'relative mx-auto flex min-h-screen w-full flex-col items-center justify-center px-6 py-20 sm:px-12';

const DEFAULT_CONTENT = `${CONTENT_STRUCTURE} ${CONTENT_WIDTH.normal} ${CONTENT_COLOR_LIGHT}`;

type SlideStageProps = {
  slides: ReactNode[];
  index: number;
  overlay?: ReactNode;
  theme?: SlideTheme;
  slidesMeta?: SlideMeta[];
  /** Hide the on-slide "n / total" counter (e.g. on the audience surface). */
  hideCounter?: boolean;
};

export function SlideStage({
  slides,
  index,
  overlay,
  theme,
  slidesMeta,
  hideCounter,
}: SlideStageProps) {
  const lastIndex = Math.max(slides.length - 1, 0);
  const current = Math.min(Math.max(index, 0), lastIndex);

  // key={current} remounts on each advance so the entrance animation replays.
  const animatedContent = (extraClass: string) => (
    <div
      key={current}
      className={`${extraClass} animate-in fade-in slide-in-from-bottom-2 duration-500`}
    >
      {slides[current]}
    </div>
  );

  // Counter reads `text-muted-foreground`, so it adapts with the theme scope.
  const counter = hideCounter || theme?.hideCounter ? null : (
    <div className='pointer-events-none absolute bottom-6 right-6 text-sm tabular-nums text-muted-foreground'>
      {current + 1} / {slides.length}
    </div>
  );

  // Code decks own their full-bleed layout — render bare, no wrapper/chrome.
  if (theme) {
    return (
      <div className={theme.stage ?? DEFAULT_STAGE}>
        {animatedContent(theme.content ?? DEFAULT_CONTENT)}
        {counter}
        {overlay}
      </div>
    );
  }

  // Keystatic decks: a theme scope re-points the design tokens for the whole
  // subtree, so the background, prose (via prose-invert), and any components
  // (Callout, Prompt, code) re-theme coherently off the same tokens.
  const meta = slidesMeta?.[current];
  const { schemeClass, contentClass, frameWidth } = resolveSlideAppearance(meta);

  return (
    <div className={`${KEYSTATIC_STAGE} ${schemeClass}`.trim()}>
      <div className={`${KEYSTATIC_FRAME} ${frameWidth}`}>
        {meta?.tags?.length ? <SlideTags labels={meta.tags} /> : null}
        {animatedContent(contentClass)}
        {counter}
      </div>
      {overlay}
    </div>
  );
}
