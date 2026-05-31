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
  'bg-muted rounded-md border border-border not-prose p-4 px-6 space-y-2',
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

const calloutDescriptionVariants = cva('text-sm text-muted-foreground', {
  variants: {
    variant: {
      default: '',
      info: 'text-blue-800',
      warning: 'text-yellow-800',
      error: 'text-red-800',
      success: 'text-green-800',
    },
  },
});
