import type { SlideMeta } from './SlideStage';

// `bg` directive value → a token-scope class. The class redefines the design
// tokens for the slide subtree, so background, prose, AND components adapt.
// Exported so the overview thumbnails and the continuous handout can tint
// themselves with the same scope.
export const SCHEME_CLASS: Record<string, string> = {
  brand: 'slide-theme-brand',
  dark: 'dark',
  // A subtle warm "parchment" tint for the build (paso a paso) slides, so the
  // step-by-step reads as visually distinct from the white theory slides. Unlike
  // brand/dark it's a LIGHT background (see DARK_SCHEMES).
  sepia: 'slide-theme-sepia',
  // A deep emerald for the workshop's closing slide — a celebratory color not
  // used by any module divider (indigo) or archive (dark). Dark background,
  // light text (see DARK_SCHEMES).
  emerald: 'slide-theme-emerald',
};

// Schemes whose background is DARK, so the prose/content must invert to light
// text. Light-background schemes (sepia) are absent here and keep the default
// dark prose — otherwise their text would turn white on a light surface.
export const DARK_SCHEMES = new Set(['brand', 'dark', 'emerald']);

// A `## subtitle` placed right under the `# title` (an `h1 + h2`) is styled as a
// subtitle: pulled up close to the title (negative margin beats prose's big h2
// top margin), smaller, lighter and slightly muted — a middle ground between the
// title and body text. General `h2`s used as mid-slide section headers keep the
// default `prose-h2` size, so only the title/subtitle pairing changes.
export const CONTENT_STRUCTURE =
  'markdoc prose prose-lg w-full prose-h1:text-4xl prose-h1:font-bold prose-h2:text-3xl prose-h2:font-bold [&_h1+h2]:-mt-5 [&_h1+h2]:text-2xl [&_h1+h2]:font-medium [&_h1+h2]:opacity-70';
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
  // Only dark-background schemes invert the prose; a light scheme (sepia) keeps
  // dark text even though it has a scope class.
  const invert = meta?.bg ? DARK_SCHEMES.has(meta.bg) : false;
  const widthKey = meta?.width && CONTENT_WIDTH[meta.width] ? meta.width : 'normal';
  const contentClass = `${CONTENT_STRUCTURE} ${CONTENT_WIDTH[widthKey]} ${
    invert ? 'prose-invert' : CONTENT_COLOR_LIGHT
  }`;
  return {
    schemeClass,
    widthKey,
    contentClass,
    frameWidth: FRAME_WIDTH[widthKey],
  };
}
