import { notFound } from 'next/navigation';

import KeystaticApp from './keystatic';

// The Keystatic admin UI only works with local storage during `next dev`
// (it writes to the local filesystem / Git). Gate it off in production.
export default function KeystaticLayout() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return <KeystaticApp />;
}
