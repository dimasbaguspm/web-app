import { useEffect, useRef } from 'react';

type NodeMap = Record<string, HTMLElement | null>;

/**
 * Hook to observe a map of nodes (key => HTMLElement | null) using a single ResizeObserver.
 * Calls the provided callback with a set of keys that changed.
 */
export const usePortalResizeObserver = (
  portalNodes: NodeMap,
  onKeysChanged: (keys: Set<string>) => void,
  options?: { signal?: AbortSignal },
) => {
  const internalControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!options?.signal && !internalControllerRef.current) {
      internalControllerRef.current = new AbortController();
    }
    const usedSignal = options?.signal ?? internalControllerRef.current?.signal;

    // Local per-run state. These will be eligible for GC when the effect
    // cleans up.
    const mapping = new Map<HTMLElement, string>();
    const pending = new Set<string>();
    let raf: number | null = null;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement;
        const key = mapping.get(target);
        if (key) pending.add(key);
      }

      if (raf == null) {
        raf = window.requestAnimationFrame(() => {
          const keys = new Set(pending);
          pending.clear();
          raf = null;
          if (keys.size) onKeysChanged(keys);
        });
      }
    });

    // Observe current nodes
    const observedNodes = new Set<HTMLElement>();
    for (const key of Object.keys(portalNodes)) {
      const node = portalNodes[key];
      if (!node) continue;
      mapping.set(node, key);
      try {
        observer.observe(node);
        observedNodes.add(node);
      } catch {
        // ignore unsupported or detached nodes
      }
    }

    const onAbort = () => {
      try {
        observer.disconnect();
      } catch {
        // ignore
      }
      mapping.clear();
      pending.clear();
      if (raf != null) {
        window.cancelAnimationFrame(raf);
        raf = null;
      }
      observedNodes.clear();
    };

    if (usedSignal) {
      if (usedSignal.aborted) onAbort();
      else usedSignal.addEventListener('abort', onAbort);
    }

    return () => {
      if (usedSignal) usedSignal.removeEventListener('abort', onAbort);
      try {
        observer.disconnect();
      } catch {
        // ignore
      }
      if (raf != null) {
        window.cancelAnimationFrame(raf);
        raf = null;
      }
      mapping.clear();
      pending.clear();
      observedNodes.clear();
    };
  }, [portalNodes, onKeysChanged, options?.signal]);

  // Return controller if created internally so caller can cancel if desired.
  return internalControllerRef.current ?? undefined;
};

export default usePortalResizeObserver;
