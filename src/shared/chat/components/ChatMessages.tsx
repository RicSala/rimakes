'use client';

import { AiTools } from '@/app/api/chat/tools';
import { AssistantMessage } from '@/shared/chat/components/AssistantMessage';
import { Message } from '@/shared/chat/components/ChatView';
import { ToolCallDisplay } from '@/shared/chat/components/ToolCallDisplay';
import { toolDisplayConfig } from '@/shared/chat/components/toolDisplayConfig';
import { UserMessage } from '@/shared/chat/components/UserMessage';
import { cn } from '@/shared/lib/utils';
import { ToolUIPart } from 'ai';
import { useEffect, useRef } from 'react';

type ChatMessagesProps = {
  messages: Message[];
  className?: string;
};
export function ChatMessages({ messages, className }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  return (
    <div
      className={cn(
        'flex flex-col overflow-y-auto flex-grow [scrollbar-width:_none] gap-2',
        className
      )}
    >
      {messages.map((message) => (
        <div key={message.id} className='flex flex-col gap-2'>
          {message.parts.map((part, index) =>
            part.type === 'text' ? (
              message?.role === 'assistant' ? (
                <AssistantMessage
                  text={part.text}
                  id={message.id}
                  key={index}
                />
              ) : (
                <UserMessage text={part.text} key={index} />
              )
            ) : part.type.startsWith('tool-') ? (
              <ToolCallDisplay
                toolPart={part as ToolUIPart<AiTools>}
                toolDisplayConfig={toolDisplayConfig}
                key={index}
              />
            ) : null
          )}
        </div>
      ))}
      <span ref={messagesEndRef} />
    </div>
  );
}
