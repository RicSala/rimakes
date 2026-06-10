import type { ReactNode } from 'react';

/**
 * Side-by-side layout for comparisons (e.g. models). Lays its `{% column %}`
 * children out as equal-width cards on a slide, stacking on narrow screens.
 * Pair with `{% slide width="wide" /%}` when you have 3+ columns so they breathe.
 */
export function Columns({ children }: { children?: ReactNode }) {
  return (
    <div className='not-prose my-6 flex flex-col gap-4 sm:flex-row sm:items-stretch'>
      {children}
    </div>
  );
}

type ColumnProps = {
  title?: string;
  subtitle?: string;
  badge?: string;
  highlight?: boolean;
  children?: ReactNode;
};

/**
 * One comparison card. `title`/`subtitle` head the card, `badge` is a small pill
 * (e.g. "Recomendado"), and `highlight` rings it to mark the pick. Colors come
 * from design tokens, so cards re-theme with the slide's `bg` scheme.
 */
export function Column({
  title,
  subtitle,
  badge,
  highlight,
  children,
}: ColumnProps) {
  const hasHeader = Boolean(title || subtitle || badge);
  return (
    <div
      className={`flex min-w-0 flex-1 basis-0 flex-col rounded-xl border p-5 shadow-sm ${
        highlight
          ? 'border-primary bg-primary/5 ring-1 ring-primary'
          : 'border-border bg-card'
      }`}
    >
      {badge ? (
        <span className='mb-3 inline-flex w-fit items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground'>
          {badge}
        </span>
      ) : null}
      {title ? (
        <div className='text-xl font-bold text-card-foreground'>{title}</div>
      ) : null}
      {subtitle ? (
        <div className='mt-0.5 text-sm text-muted-foreground'>{subtitle}</div>
      ) : null}
      <div
        className={`${hasHeader ? 'mt-3' : ''} space-y-2 text-[0.95rem] leading-relaxed text-card-foreground [&_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_h3]:font-semibold [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5`}
      >
        {children}
      </div>
    </div>
  );
}
