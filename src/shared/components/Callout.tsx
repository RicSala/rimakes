import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

type CalloutProps = {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description?: any;
  children?: ReactNode;
  emoji: string;
  className?: string;
  descriptionClassName?: string;
  emojiClassName?: string;
};
export function Callout({
  title,
  description,
  emoji,
  className,
  children,
  variant = 'default',
  descriptionClassName,
  emojiClassName,
}: CalloutProps & VariantProps<typeof calloutContainerVariants>) {
  return (
    <div className={cn(calloutContainerVariants({ variant }), className)}>
      <div className='flex items-center gap-2'>
        <span className={cn('text-3xl', emojiClassName)}>{emoji}</span>
        <h3 className='text-lg font-bold'>{title}</h3>
      </div>
      <div
        className={cn(
          calloutDescriptionVariants({
            variant,
            className: descriptionClassName,
          })
        )}
      >
        {children ?? description}
      </div>
    </div>
  );
}

const calloutContainerVariants = cva(
  'bg-muted rounded-md border border-border not-prose my-4 p-4 px-6 space-y-2',
  {
    variants: {
      variant: {
        default: '',
        info: 'bg-blue-50 border-blue-200 text-blue-900',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
        error: 'bg-red-50 border-red-200 text-red-900',
        success: 'bg-green-50 border-green-200 text-green-900',
      },
    },
  }
);

// Tailwind preflight strips paragraph margins and list markers, and the callout
// card is `not-prose`, so a multi-paragraph or bulleted body renders cramped and
// unmarked. Re-add just the block styles that make the Markdown body read as
// polished prose — deliberately NOT pulling in the typography plugin, whose own
// colors would fight the callout's intentional per-variant color.
const calloutBodyProse = cn(
  'space-y-3',
  '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1',
  '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1',
  '[&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2',
  '[&_code]:rounded [&_code]:bg-black/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]'
);

const calloutDescriptionVariants = cva(
  cn('text-sm text-muted-foreground', calloutBodyProse),
  {
    variants: {
      variant: {
        default: '',
        info: 'text-blue-800',
        warning: 'text-yellow-800',
        error: 'text-red-800',
        success: 'text-green-800',
      },
    },
  }
);
