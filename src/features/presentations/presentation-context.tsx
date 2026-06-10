'use client';

import { createContext, useContext, type ReactNode } from 'react';

type PresentationContextValue = {
  slug: string;
  /**
   * Present only on the secret-gated /control screen, so a component can tell it
   * is rendering for the presenter (and may publish via the API). Viewers get no
   * secret, so the same component renders display-only.
   */
  secret?: string;
};

const PresentationContext = createContext<PresentationContextValue>({ slug: '' });

/**
 * Makes the deck slug (and, on /control, the publish secret) available to any
 * component rendered inside a slide — e.g. the `{% timer %}` component, which
 * needs the slug to subscribe and the secret to drive the timer.
 */
export function PresentationProvider({
  slug,
  secret,
  children,
}: PresentationContextValue & { children: ReactNode }) {
  return (
    <PresentationContext.Provider value={{ slug, secret }}>
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentation(): PresentationContextValue {
  return useContext(PresentationContext);
}
