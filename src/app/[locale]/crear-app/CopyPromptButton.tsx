'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

// Copies a step's prompt to the clipboard - the guide's whole point is "paste
// this to Claude". It sits inside the collapsed <summary>, so the click must
// not bubble into a details toggle. `print:hidden` keeps it out of the PDF.
export function CopyPromptButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type='button'
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      title='Copiar el prompt al portapapeles'
      className='mapa-btn inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1 text-xs print:hidden'
    >
      {copied ? (
        <Check size={12} strokeWidth={1.6} aria-hidden />
      ) : (
        <Copy size={12} strokeWidth={1.6} aria-hidden />
      )}
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  );
}
