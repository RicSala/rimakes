'use client';

import { FileDown } from 'lucide-react';

// Opens the browser print dialog → "Guardar como PDF". Same class/behaviour as
// the button on /mapa-contexto. `print:hidden` keeps it out of the exported PDF.
export function PrintButton() {
  return (
    <button
      type='button'
      onClick={() => window.print()}
      title='Abre el diálogo de impresión — elige «Guardar como PDF»'
      className='mapa-btn mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm print:hidden'
    >
      <FileDown size={14} strokeWidth={1.6} aria-hidden />
      Descargar PDF
    </button>
  );
}
