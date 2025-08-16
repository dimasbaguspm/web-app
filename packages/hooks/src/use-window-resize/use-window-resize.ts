import { useEffect, useRef, useState } from 'react';

import { getViewportState } from './helpers';
import { ViewportState } from './types';

/**
 * Responsive viewport hook with Tailwind CSS v4 breakpoints and mobile-first design principles
 * Optimized for modal positioning and responsive layouts with debounced updates
 *
 * @param debounceMs - Debounce delay for resize events (default: 150ms)
 * @returns ViewportState with current viewport information aligned to Tailwind CSS v4 breakpoints
 */
export function useWindowResize(debounceMs = 150): ViewportState {
  const [viewport, setViewport] = useState<ViewportState>(getViewportState);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const abortController = new AbortController();

    const updateViewport = () => {
      // Clear existing timeout to debounce rapid resize events
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setViewport(getViewportState());
      }, debounceMs);
    };

    // Listen to resize events with AbortController
    window.addEventListener('resize', updateViewport, {
      signal: abortController.signal,
      passive: true, // Improve performance for scroll events
    });

    // Initial update (no debounce needed)
    setViewport(getViewportState());

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      abortController.abort();
    };
  }, [debounceMs]);

  return viewport;
}
