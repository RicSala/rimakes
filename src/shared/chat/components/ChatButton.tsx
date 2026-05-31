'use client';

import { Portal } from '@/shared/components/Portal';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';

type ChatButtonProps = {
  className?: string;
};

const ChatView = dynamic(
  () =>
    import('@/shared/chat/components/ChatView').then((module) => module.ChatView),
  {
    ssr: false,
    loading: () => null,
  }
);

export const ChatButton = ({ className }: ChatButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <Portal container={globalThis?.document?.body} className={className}>
      <Button
        variant='secondary'
        asChild
        className={cn(
          'rounded-full overflow-hidden relative aspect-square p-0 w-10 h-10 bg-indigo-700 hover:bg-indigo-700/80'
        )}
        onClick={handleClick}
      >
        <div className=''>
          <Image
            src='/images/personal/me.jpeg'
            alt='avatar'
            width={40}
            height={40}
            style={{
              opacity: !isOpen ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
            className='absolute inset-0 select-none'
          />
          <div
            className=' bg-indigo-700 rounded-full flex items-center justify-center absolute inset-0'
            style={{
              opacity: isOpen ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
          >
            <ChevronDown className='size-4 text-primary-foreground' />
          </div>
        </div>
      </Button>

      {isOpen && (
        <ChatView
          className={cn(
            'fixed bottom-48 right-4 md:right-8 transition-all duration-300'
          )}
          onClose={handleClose}
        />
      )}
    </Portal>
  );
};
