'use client';

import { Textarea } from '@/shared/components/ui/textarea';
import { cn } from '@/shared/lib/utils';
import { ArrowUp } from 'lucide-react';
import {
  FormEvent,
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
} from 'react';

type MessageInputProps = {
  onSend: (message: string) => void;
  value: string;
  setValue: (value: string) => void;
  className?: string;
  onValueChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
} & React.ComponentProps<'form'>;
const MessageInputWithRef: ForwardRefRenderFunction<
  HTMLTextAreaElement,
  MessageInputProps
> = ({ className, onSend, value, setValue, disabled, ...props }, ref) => {
  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLTextAreaElement> | FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (disabled) return;
      onSend(value);
      setValue('');
    },
    [disabled, onSend, value, setValue]
  );
  return (
    <form
      className={cn('relative font-regular [font-size:16px] mx-0.5', className)}
      {...props}
      onSubmit={onSubmit}
    >
      <Textarea
        className=' rounded-md  px-4 leading-[1.5] resize-none [scrollbar-width:_none] placeholder:text-primary-100 [font-size:16px] flex items-center grow-0 py-2 [field-sizing:content]'
        rows={1}
        placeholder='Send a message, use a tool or ask me to navigate to a specific path...'
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            onSubmit(e);
          }
        }}
        value={value}
        ref={ref}
        autoFocus
      />

      <button
        className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary-100 p-1 text-primary-50 hidden ${
          disabled ? 'opacity-50' : 'opacity-100'
        }`}
        disabled={disabled}
      >
        <ArrowUp
          onClick={() => onSend('')}
          height={36}
          width={36}
          className=''
        />
      </button>
      <kbd
        className={`absolute pointer-events-none translate-y-2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground transition-opacity duration-300  ${
          value.length > 0 ? 'opacity-100' : 'opacity-50'
        }`}
      >
        <span className='text-xs'>Enter ↵ </span>
      </kbd>
    </form>
  );
};

export const MessageInput = forwardRef<HTMLTextAreaElement, MessageInputProps>(
  MessageInputWithRef
);
