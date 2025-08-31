import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { ModalRouteContext } from './context';

import type {
  ModalParams,
  ModalRouteModel,
  ModalState,
  OpenModalOptions,
} from './types';

export function ModalRouteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state as ModalState) ?? null;

  const modalId = state?.modalId ?? null;
  const params = state?.params ?? null;
  const isOpen = modalId != null;

  const openModal = useCallback(
    (newModalId: string, newParams?: ModalParams, opts?: OpenModalOptions) => {
      // When opening modal, push new history entry with minimal state only
      const newState = {
        ...(opts?.state ?? {}),
        modalId: newModalId,
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

  const closeModal = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const contextValue: ModalRouteModel = useMemo(
    () => ({
      isOpen,
      modalId,
      params,
      state: location.state as ModalState,
      openModal,
      closeModal,
    }),
    [isOpen, modalId, params, location.state, openModal, closeModal],
  );

  return (
    <ModalRouteContext.Provider value={contextValue}>
      {children}
    </ModalRouteContext.Provider>
  );
}
