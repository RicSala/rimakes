'use client';

import { createPortal } from 'react-dom';
import { forwardRef, useId, useSyncExternalStore, type ReactNode } from 'react';

const subscribe = () => () => {};

type PortalDivProps = {
  children: ReactNode;
  container?: Element | DocumentFragment | null;
} & React.ComponentProps<'div'>;

export const Portal = forwardRef<HTMLDivElement, PortalDivProps>(
  ({ children, container: containerProp, ...props }, ref) => {
    const id = useId();
    const isClient = useSyncExternalStore(
      subscribe,
      () => true, // client
      () => false // server
    );

    if (!isClient) return null;

    const container = containerProp || (isClient && globalThis?.document?.body);

    return createPortal(
      <div ref={ref} id={`portal-${id}`} {...props}>
        {children}
      </div>,
      container
    );
  }
);
Portal.displayName = 'Portal';
