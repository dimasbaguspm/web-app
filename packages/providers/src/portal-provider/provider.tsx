import { FC, PropsWithChildren, useCallback, useMemo, useState } from 'react';

import { PortalProviderContext } from './context';
import { usePortalResizeObserver } from './use-portal-resize-observer';

export const PortalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [portalState, setPortalState] = useState<Record<string, boolean>>({});
  const [portalNodes, setPortalNodes] = useState<Record<string, HTMLElement | null>>({});

  const isOpen = useCallback(
    (id: string) => {
      return !!portalState?.[id];
    },
    [portalState],
  );

  const handleSetNode = useCallback((id: string, element: HTMLElement | null) => {
    setPortalNodes((prev) => {
      if (prev[id] === element) return prev;
      return { ...prev, [id]: element };
    });

    // If we're attaching a node (non-null), mark the portal as open immediately
    if (element) {
      setPortalState((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
    }
  }, []);

  const handleKeysChanged = useCallback((keys: Set<string>) => {
    setPortalState((prev) => {
      let changed = false;
      const next = { ...prev };
      keys.forEach((k) => {
        if (!next[k]) {
          next[k] = true;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, []);

  usePortalResizeObserver(portalNodes, handleKeysChanged);

  const contextValue = useMemo(
    () => ({ state: portalState, node: portalNodes, setNode: handleSetNode, isOpen }),
    [portalState, portalNodes, handleSetNode],
  );

  return <PortalProviderContext.Provider value={contextValue}>{children}</PortalProviderContext.Provider>;
};
