import { marked } from 'marked';
import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return (
      <ReactMarkdown
        components={{
          // Unordered lists
          ul: ({ children }) => (
            <ul className='list-disc list-inside my-2 space-y-1'>{children}</ul>
          ),
          // Ordered lists
          ol: ({ children }) => (
            <ol className='list-decimal list-inside my-2 space-y-1'>
              {children}
            </ol>
          ),
          // List items
          li: ({ children }) => <li className='ml-4'>{children}</li>,
          // Paragraphs
          p: ({ children }) => <p className='my-2'>{children}</p>,
          // Code blocks
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className='bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm'>
                {children}
              </code>
            ) : (
              <code className={className}>{children}</code>
            );
          },
          // Strong/Bold
          strong: ({ children }) => (
            <strong className='font-semibold'>{children}</strong>
          ),
          // Emphasis/Italic
          em: ({ children }) => <em className='italic'>{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false;
    return true;
  }
);

MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock';

export const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} />
    ));
  }
);

MemoizedMarkdown.displayName = 'MemoizedMarkdown';
