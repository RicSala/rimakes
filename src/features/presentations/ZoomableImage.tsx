'use client';

import { useEffect, useState } from 'react';

import { Portal } from '@/shared/components/Portal';

type ZoomableImageProps = {
  src: string;
  alt?: string;
  title?: string;
};

/**
 * Render target for the built-in `image` node (see `markdoc-nodes.ts`): a normal
 * inline image that opens a full-screen lightbox on click. Useful on slides where
 * a screenshot is too small to read from the back of the room.
 *
 * While open it traps the keyboard in the **capture phase** with
 * `stopImmediatePropagation`, so the presenter's nav keys (Space / arrows, handled
 * by `SlideController`'s window-level listener) can't move the deck underneath the
 * zoom. `Escape` or a click closes it.
 */
export function ZoomableImage({ src, alt, title }: ZoomableImageProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      // Modal: swallow every key so slide navigation can't fire underneath.
      event.stopImmediatePropagation();
      event.preventDefault();
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey, true);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      {/* A plain <img> (not role=button) stays valid when the overview grid
          re-renders the slide inside a <button>. next/image is intentionally
          avoided: CMS images have unknown dimensions and no loader config, and
          this matches Markdoc's default image rendering. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? ''}
        title={title}
        onClick={() => setOpen(true)}
        className='cursor-zoom-in transition hover:brightness-95'
      />

      {open ? (
        <Portal>
          <div
            role='dialog'
            aria-modal='true'
            aria-label={alt || title || 'Image preview'}
            onClick={() => setOpen(false)}
            className='fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/85 p-6 backdrop-blur-sm duration-200 animate-in fade-in'
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt ?? ''}
              className='max-h-full max-w-full rounded-lg object-contain shadow-2xl duration-200 animate-in zoom-in-95'
            />
            <span className='pointer-events-none absolute right-5 top-5 text-sm text-white/70'>
              Esc ✕
            </span>
          </div>
        </Portal>
      ) : null}
    </>
  );
}
