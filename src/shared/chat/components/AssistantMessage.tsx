import { MemoizedMarkdown } from '@/shared/components/MemoizedMarkdown';
import { Sparkles } from 'lucide-react';

type AssistantMessageProps = {
  text: string;
  id: string;
};
export const AssistantMessage = ({ text, id }: AssistantMessageProps) => {
  return (
    <div className={`flex p-2 mb-4 py-2 gap-2 items-start`}>
      <div className='shrink-0 rounded-full aspect-square h-8 w-8 relative top-1 bg-primary-50/20 border border-current flex items-center justify-center text-indigo-300'>
        <Sparkles className='size-4' />
      </div>
      <div className={`flex flex-col gap-2 grow`}>
        <MemoizedMarkdown content={text} id={id} />
      </div>
    </div>
  );
};
