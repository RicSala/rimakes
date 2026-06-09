'use client';

import { useRef, useState, type ReactNode } from 'react';

/**
 * A shareable prompt block: shows a couple of lines collapsed, expands to the
 * full text, and copies the prompt to the clipboard. Authored as a Markdoc tag:
 *
 *   {% prompt title="Example prompt" %}
 *   ...the prompt text...
 *   {% /prompt %}
 */
export function Prompt({
  title,
  children,
}: {
  title?: string;
  children?: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    const text = bodyRef.current?.innerText?.trim() ?? '';
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — silently ignore.
    }
  };

  return (
    <div className='not-prose my-4 overflow-hidden rounded-xl border border-border bg-muted/40'>
      <div className='flex items-center justify-between gap-2 border-b border-border px-4 py-2'>
        <span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
          {title ?? 'Prompt'}
        </span>
        <div className='flex items-center gap-1'>
          <button
            type='button'
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className='rounded px-2 py-1 text-xs font-medium text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground'
          >
            {expanded ? 'Collapse' : 'Expand'}
          </button>
          <button
            type='button'
            onClick={handleCopy}
            className='rounded border border-border px-2 py-1 text-xs font-medium transition hover:bg-foreground/5'
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>
      </div>

      <div className='relative'>
        <div
          ref={bodyRef}
          className={`px-4 py-3 font-mono text-sm leading-relaxed [&_p]:m-0 ${
            expanded ? '' : 'max-h-12 overflow-hidden'
          }`}
        >
          {children}
        </div>
        {expanded ? null : (
          <button
            type='button'
            onClick={() => setExpanded(true)}
            aria-label='Expand prompt'
            className='absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-muted to-transparent'
          />
        )}
      </div>
    </div>
  );
}
