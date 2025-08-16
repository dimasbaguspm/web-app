/**
 * Viewport state for responsive design following Tailwind CSS v4 breakpoints and mobile-first principles
 */
export interface ViewportState {
  /** Current window width */
  width: number;
  /** Current window height */
  height: number;
  /** Small devices (width < 640px) - mobile phones */
  isMobile: boolean;
  /** Small tablets (width >= 640px and < 768px) - corresponds to Tailwind 'sm' */
  isSmall: boolean;
  /** Medium devices (width >= 768px and < 1024px) - tablets, corresponds to Tailwind 'md' */
  isMedium: boolean;
  /** Large devices (width >= 1024px and < 1280px) - small desktops, corresponds to Tailwind 'lg' */
  isLarge: boolean;
  /** Extra large devices (width >= 1280px and < 1536px) - large desktops, corresponds to Tailwind 'xl' */
  isExtraLarge: boolean;
  /** 2X large devices (width >= 1536px) - ultra-wide desktops, corresponds to Tailwind '2xl' */
  is2ExtraLarge: boolean;
  /** Legacy: Tablet devices (width >= 640px and < 1024px) - kept for backward compatibility */
  isTablet: boolean;
  /** Legacy: Desktop devices (width >= 1024px) - kept for backward compatibility */
  isDesktop: boolean;
}
