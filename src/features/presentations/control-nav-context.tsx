'use client';

import { createContext, useContext, type ReactNode } from 'react';

/**
 * Presenter navigation exposed to in-slide components (the `{% goto %}` button).
 * Deliberately a SEPARATE context from `PresentationProvider`: the audience
 * viewer also mounts `PresentationProvider` (with the slug, minus the secret), so
 * a component can't tell control from viewer through it. Only `SlideController`
 * provides this one, so an in-slide `{% goto %}` renders as a real jump button on
 * /control and inert everywhere else (the room follows over Pusher instead).
 */
export type ControlNav = {
  /** Resolve a slide's title (its first heading) to its index, or null if none. */
  resolveTitle: (title: string) => number | null;
  /**
   * Jump to a slide by title — reversible: it pushes the current slide onto the
   * return stack (so «⤺ Volver» / `b` snaps back) and broadcasts, so the whole
   * room follows. No-op if the title doesn't resolve.
   */
  jumpToTitle: (title: string) => void;
};

const ControlNavContext = createContext<ControlNav | null>(null);

export function ControlNavProvider({
  value,
  children,
}: {
  value: ControlNav;
  children: ReactNode;
}) {
  return (
    <ControlNavContext.Provider value={value}>
      {children}
    </ControlNavContext.Provider>
  );
}

/** The presenter nav, or null when not under /control (viewer / review / blog). */
export function useControlNav(): ControlNav | null {
  return useContext(ControlNavContext);
}
