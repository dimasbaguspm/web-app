import { ViewportState } from './types';

// Tailwind CSS v4 breakpoints (in pixels)
const BREAKPOINTS = {
  sm: 640, // 40rem
  md: 768, // 48rem
  lg: 1024, // 64rem
  xl: 1280, // 80rem
  '2xl': 1536, // 96rem
} as const;

/**
 * Get current viewport state with Tailwind CSS v4 breakpoints
 * @returns ViewportState with current viewport information
 */
export const getViewportState = (): ViewportState => {
  // Handle SSR gracefully
  if (typeof window === 'undefined') {
    return {
      width: 0,
      height: 0,
      isMobile: false,
      isSmall: false,
      isMedium: false,
      isLarge: false,
      isExtraLarge: false,
      is2ExtraLarge: false,
      // Legacy properties for backward compatibility
      isTablet: false,
      isDesktop: false,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;

  // Tailwind CSS v4 breakpoint-based responsive flags
  const isMobile = width < BREAKPOINTS.sm;
  const isSmall = width < BREAKPOINTS.md;
  const isMedium = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
  const isLarge = width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl;
  const isExtraLarge = width >= BREAKPOINTS.xl && width < BREAKPOINTS['2xl'];
  const is2ExtraLarge = width >= BREAKPOINTS['2xl'];

  // Legacy properties for backward compatibility
  const isTablet = width >= BREAKPOINTS.sm && width < BREAKPOINTS.lg;
  const isDesktop = width >= BREAKPOINTS.lg;

  return {
    width,
    height,
    isMobile,
    isSmall,
    isMedium,
    isLarge,
    isExtraLarge,
    is2ExtraLarge,
    // Legacy properties
    isTablet,
    isDesktop,
  };
};
