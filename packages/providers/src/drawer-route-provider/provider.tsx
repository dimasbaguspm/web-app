import { PropsWithChildren, useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';

import { DrawerRouteContext } from './context';

import type { DrawerParams, DrawerRouteModel, DrawerState, OpenDrawerOptions } from './types';

/**
 * Encodes drawer params to a URL-safe string
 */
function encodeDrawerParams(params: DrawerParams): string {
  if (!params || Object.keys(params).length === 0) return '';
  try {
    return btoa(JSON.stringify(params));
  } catch {
    // Fallback for environments without btoa
    return encodeURIComponent(JSON.stringify(params));
  }
}

/**
 * Decodes drawer params from a URL string
 */
function decodeDrawerParams(encoded: string): DrawerParams {
  if (!encoded) return null;
  try {
    return JSON.parse(atob(encoded));
  } catch {
    try {
      return JSON.parse(decodeURIComponent(encoded));
    } catch {
      // If all parsing fails, return the raw string as a fallback
      return { value: encoded };
    }
  }
}

/**
 * Parses the drawer URL format: "drawerId" or "drawerId~base64Params"
 */
function parseDrawerFromUrl(drawerParam: string | null): {
  drawerId: string | null;
  params: DrawerParams;
} {
  if (!drawerParam) {
    return { drawerId: null, params: null };
  }

  const [drawerId, encodedParams] = drawerParam.split('~');
  const params = encodedParams ? decodeDrawerParams(encodedParams) : null;

  return { drawerId, params };
}

/**
 * Formats drawer state into URL format: "drawerId" or "drawerId~base64Params"
 */
function formatDrawerForUrl(drawerId: string, params?: DrawerParams): string {
  if (!params || Object.keys(params).length === 0) {
    return drawerId;
  }
  const encoded = encodeDrawerParams(params);
  return `${drawerId}~${encoded}`;
}

interface DrawerRouteProviderProps extends PropsWithChildren {
  /**
   * The search param key to use for the drawer state.
   * @default "drawer"
   */
  searchParamKey?: string;
}

export function DrawerRouteProvider({ children, searchParamKey = 'drawer' }: DrawerRouteProviderProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse current drawer state from URL
  const drawerParam = searchParams.get(searchParamKey);
  const { drawerId, params } = parseDrawerFromUrl(drawerParam);
  const isOpen = drawerId !== null;

  // Get the current location state
  const state = location.state as DrawerState;

  const openDrawer = useCallback(
    (newDrawerId: string, newParams?: DrawerParams, opts?: OpenDrawerOptions) => {
      const newSearchParams = new URLSearchParams(searchParams);
      const formattedValue = formatDrawerForUrl(newDrawerId, newParams);
      newSearchParams.set(searchParamKey, formattedValue);

      const newSearch = newSearchParams.toString();
      const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ''}${location.hash}`;

      navigate(newUrl, {
        replace: opts?.replace,
        state: opts?.state,
        preventScrollReset: true,
      });
    },
    [searchParams, searchParamKey, location.pathname, location.hash, navigate],
  );

  const closeDrawer = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const contextValue: DrawerRouteModel = useMemo(
    () => ({
      isOpen,
      drawerId,
      params,
      state,
      openDrawer,
      closeDrawer,
    }),
    [isOpen, drawerId, params, state, openDrawer, closeDrawer],
  );

  return <DrawerRouteContext.Provider value={contextValue}>{children}</DrawerRouteContext.Provider>;
}
