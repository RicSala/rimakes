'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/lib/utils';
import { ChevronLeftIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type ChatHeaderProps = { className?: string; onClose: () => void };
export function ChatHeader({ className, onClose }: ChatHeaderProps) {
  const [hasOpened, setHasOpened] = useState(false);

  return (
    <div
      className={cn(
        'flex items-center justify-between border-b border-indigo-500 p-2 px-6 text-primary-foreground gap-4',
        className
      )}
    >
      <Button
        variant='ghost'
        size='icon'
        onClick={onClose}
        className='hover:bg-transparent hover:text-primary-foreground hover:cursor-pointer'
      >
        <ChevronLeftIcon className='size-4' />
      </Button>
      <div className='flex items-center gap-2 relative h-10'>
        <Image
          src='/images/personal/me.jpeg'
          alt='avatar'
          className='rounded-md object-contain aspect-square h-8 w-8'
          width={32}
          height={32}
        />
        <div className='flex flex-col items-start'>
          <p className='text-sm font-medium'>rimakes Ai</p>
          <p className='text-xs text-primary-foreground/50'>Assistant</p>
        </div>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'ml-auto text-primary-foreground text-xs border border-indigo-500 rounded-md p-1 hover:bg-indigo-500 hover:text-primary-foreground hover:cursor-pointer transition-all duration-300 ',
              !hasOpened ? 'animate-pulse' : 'opacity-50'
            )}
            onMouseEnter={() => setHasOpened(true)}
          >
            Tools
          </div>
        </TooltipTrigger>
        <TooltipContent collisionPadding={10}>
          <h4 className='text-sm font-medium'>I can do things! 🤖</h4>
          <div className='text-xs text-primary-foreground flex flex-col gap-2'>
            Try asking me...
            <ul className='list-disc list-inside'>
              <li>about the current time</li>
              <li>about the weather</li>
              <li>to update the primary font color</li>
              <li>to navigate to a specific path on the website</li>
              <li>to navigate to the latest posts</li>
            </ul>
            I have some tools under my belt!
          </div>
        </TooltipContent>
      </Tooltip>
      <Button
        variant='ghost'
        size='icon'
        onClick={onClose}
        className='hover:bg-transparent hover:text-primary-foreground hover:cursor-pointer'
      >
        <XIcon className='size-4' />
      </Button>
    </div>
  );
}
