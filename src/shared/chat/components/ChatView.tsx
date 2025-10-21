'use client';

import { ChatHeader } from '@/shared/chat/components/ChatHeader';
import { MessageInput } from '@/shared/chat/components/ChatMessageInput';
import { ChatMessages } from '@/shared/chat/components/ChatMessages';
import { cn } from '@/shared/lib/utils';
import { DefaultChatTransport, UIDataTypes, UIMessage, UITools } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { useRouter } from '@/shared/internationalization/navigation';
import { useLocale } from 'next-intl';
import { updatePrimaryColorClientTool } from '@/shared/chat/clientTools/updatePrimaryColorClientTool';
import { goToPathClientTool } from '@/shared/chat/clientTools/goToPathClientTool';

export type Message = UIMessage<unknown, UIDataTypes, UITools>;

const initialMessages: UIMessage[] = [
  {
    id: 'welcome-msg',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: `**Hey there!** 👋🏻 \n
I'm Rimakes Ai.
You can ask me about:

- about the current time
- about the weather
- to update the primary font color
- to navigate to a specific path
- to navigate to the latest posts
- bring you to the meeting booking page

This is just a glimpse of what we can do with AI, feel free to contact me if you have any questions or suggestions.
`,
      },
    ],
  },
];

type ChatViewProps = { className?: string; onClose: () => void };
export function ChatView({ className, onClose }: ChatViewProps) {
  const locale = useLocale();
  const router = useRouter();
  const {
    messages: chatMessages,
    sendMessage,
    stop,
    status,
  } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    // TODO: improve typing here
    onToolCall: ({ toolCall }) => {
      if (toolCall.toolName === 'updatePrimaryColor')
        updatePrimaryColorClientTool(toolCall.input);

      if (toolCall.toolName === 'goToPath')
        // @ts-expect-error - router is of type NextRouter
        goToPathClientTool(toolCall.input, locale, router);
    },
    onError: (error) => {
      console.error('error', error);
    },
  });
  const [input, setInput] = useState('');

  return (
    <div
      className={cn(
        'rounded-lg shadow-2xl drop-shadow-2xl w-sm max-w-full bg-indigo-900 overflow-hidden h-[calc(100vh-20rem)] max-h-[min(90vh,800px)] flex flex-col text-primary-foreground',
        className
      )}
      style={{} as React.CSSProperties}
    >
      <ChatHeader onClose={onClose} />
      <ChatMessages messages={chatMessages} className='p-2' />
      <MessageInput
        onSend={(message) => sendMessage({ text: message })}
        value={input}
        setValue={setInput}
        className='p-4 mb-8'
        disabled={status !== 'ready'}
      />
    </div>
  );
}
