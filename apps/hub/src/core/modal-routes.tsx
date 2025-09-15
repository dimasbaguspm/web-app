import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { Modal } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { MODAL_ROUTES } from '../constants/modal-routes';
import { DeleteAppProfileAuthModal } from '../modals/delete-app-profile-auth-modal/modal';
import { DeleteAppProfileModal } from '../modals/delete-app-profile-modal/modal';
import { LogoutConfirmationModal } from '../modals/logout-confirmation-modal/modal';

interface ModalParams {
  appId?: string;
  appProfileId?: number;
  payloadId?: string;
  tabId?: string;
  sessionCheck?: number;
}

interface ModalState {
  payload?: Record<string, string>;
  returnToDrawer?: string;
  returnToDrawerId?: Record<string, string> | null;
}

export const ModalRoutes: FC = () => {
  const { isOpen, modalId, params, closeModal } = useModalRoute<ModalParams, ModalState>();

  const is = (id: string) => modalId === id;
  const hasParam = (param: keyof typeof params) => (params && typeof params === 'object' ? param in params : false);
  // const hasState = (stateKey: keyof typeof state) => (state && typeof state === 'object' ? stateKey in state : false);

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size={'lg'}>
      {is(MODAL_ROUTES.LOGOUT_CONFIRMATION) && <LogoutConfirmationModal />}
      {is(MODAL_ROUTES.DELETE_APP_PROFILE) && hasParam('appProfileId') && (
        <DeleteAppProfileModal appProfileId={params.appProfileId!} />
      )}
      {is(MODAL_ROUTES.DELETE_APP_PROFILE_AUTH) && hasParam('appProfileId') && (
        <DeleteAppProfileAuthModal appProfileId={params.appProfileId!} />
      )}
    </Modal>
  );
};
