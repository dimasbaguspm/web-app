import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { BottomSheetRouteContext } from './context';

import type { BottomSheetParams, BottomSheetRouteModel, BottomSheetState, OpenBottomSheetOptions } from './types';

export function BottomSheetRouteProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state as BottomSheetState) ?? null;

  const bottomSheetId = state?.bottomSheetId ?? null;
  const params = state?.params ?? null;
  const isOpen = bottomSheetId != null;

  const openBottomSheet = useCallback(
    (newBottomSheetId: string, newParams?: BottomSheetParams, opts?: OpenBottomSheetOptions) => {
      // When opening bottomsheet, push new history entry with minimal state only
      const newState = {
        ...(opts?.state ?? {}),
        bottomSheetId: newBottomSheetId,
        params: newParams,
      };
      navigate(location.pathname + location.search + location.hash, {
        replace: opts?.replace,
        state: newState,
        preventScrollReset: true,
      });
    },
    [navigate, location.pathname, location.search, location.hash],
  );

  const closeBottomSheet = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const contextValue: BottomSheetRouteModel = useMemo(
    () => ({
      isOpen,
      bottomSheetId,
      params,
      state: location.state as BottomSheetState,
      openBottomSheet,
      closeBottomSheet,
    }),
    [isOpen, bottomSheetId, params, location.state, openBottomSheet, closeBottomSheet],
  );

  return <BottomSheetRouteContext.Provider value={contextValue}>{children}</BottomSheetRouteContext.Provider>;
}
