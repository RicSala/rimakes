'use client';

import { Download } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

import { Button } from '@/shared/components/ui/button';

import { PresentationProvider } from './presentation-context';
import type { SlideMeta } from './SlideStage';
import { resolveSlideAppearance } from './slideStyles';
import { SlideTags } from './SlideTags';

type ContinuousDeckProps = {
  slug: string;
  slides: ReactNode[];
  slidesMeta?: SlideMeta[];
  /** When true, fire the browser print dialog automatically once assets load. */
  autoPrint?: boolean;
};

/**
 * A printable, self-paced handout: every public slide stacked in one vertical
 * flow as a content-sized card (NOT a full-viewport stage), so the browser's
 * print engine paginates the document continuously — tall slides flow onto the
 * next page instead of being clipped. Each card carries its slide's token scope
 * (`brand`/`dark`), so backgrounds and prose inherit the live slide's styling;
 * the gap between cards reads as a subtle separator.
 *
 * Opened (hidden, gated) at `/present/<slug>/review/handout`. With `?print=1`
 * it auto-opens the print dialog so a single "Download PDF" button on the review
 * view yields a PDF without the visitor ever seeing the route.
 */
export function ContinuousDeck({
  slug,
  slides,
  slidesMeta,
  autoPrint,
}: ContinuousDeckProps) {
  useEffect(() => {
    if (!autoPrint) return;

    let done = false;
    const fire = () => {
      if (done) return;
      done = true;
      window.print();
    };

    // Don't print a half-loaded page: wait for fonts and any pending images,
    // with a timeout fallback so a stalled asset can't block the dialog forever.
    const pendingImages = Array.from(document.images)
      .filter((img) => !img.complete)
      .map(
        (img) =>
          new Promise<void>((resolve) => {
            img.onload = img.onerror = () => resolve();
          })
      );
    Promise.all([document.fonts.ready, ...pendingImages]).then(fire);
    const timeout = setTimeout(fire, 2500);

    // The handout opens in a script-created tab, so it may close itself.
    window.onafterprint = () => window.close();

    return () => {
      clearTimeout(timeout);
      window.onafterprint = null;
    };
  }, [autoPrint]);

  return (
    <PresentationProvider slug={`review-${slug}`}>
      <div className='handout-root min-h-screen w-full bg-muted/40 py-10 print:bg-transparent print:py-0'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => window.print()}
          className='fixed right-4 top-4 z-50 print:hidden'
        >
          <Download aria-hidden />
          Descargar PDF
        </Button>

        <div className='mx-auto flex max-w-5xl flex-col gap-8 px-4 print:gap-6 print:px-0'>
          {slides.map((slide, index) => {
            const meta = slidesMeta?.[index];
            const { schemeClass, contentClass } = resolveSlideAppearance(meta);
            return (
              <section
                key={index}
                className={`handout-card relative overflow-hidden rounded-xl border border-border bg-background p-10 text-foreground shadow-sm print:overflow-visible print:rounded-none print:shadow-none ${schemeClass}`.trim()}
              >
                {meta?.tags?.length ? <SlideTags labels={meta.tags} /> : null}
                <div className={`mx-auto ${contentClass}`}>{slide}</div>
              </section>
            );
          })}
        </div>
      </div>
    </PresentationProvider>
  );
}
