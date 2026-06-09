import type { ReactNode } from 'react';

type SlideStageProps = {
  slides: ReactNode[];
  index: number;
  overlay?: ReactNode;
};

const PROSE_CLASSES =
  'markdoc prose prose-lg text-primary prose-a:text-primary prose-headings:text-primary prose-h1:text-4xl prose-h1:font-bold prose-h2:text-3xl prose-h2:font-bold';

export function SlideStage({ slides, index, overlay }: SlideStageProps) {
  const lastIndex = Math.max(slides.length - 1, 0);
  const current = Math.min(Math.max(index, 0), lastIndex);

  return (
    <div className='relative flex min-h-screen w-full items-center justify-center px-6 py-20 sm:px-12'>
      <div className={`${PROSE_CLASSES} w-full max-w-3xl`}>{slides[current]}</div>

      <div className='pointer-events-none absolute bottom-5 right-6 text-sm tabular-nums text-muted-foreground'>
        {current + 1} / {slides.length}
      </div>

      {overlay}
    </div>
  );
}
