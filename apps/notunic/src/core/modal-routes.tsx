import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { Modal } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { MODAL_ROUTES } from '../constants/modal-routes';
import { DeleteThreadGroupModal } from '../modals/delete-thread-group-modal/modal';
import { DeleteThreadGroupTagModal } from '../modals/delete-thread-group-tag-modal/modal';
import { DeleteThreadModal } from '../modals/delete-thread-modal/modal';
import { LogoutConfirmationModal } from '../modals/logout-confirmation-modal/modal';
import { ProfileSwitcherModal } from '../modals/profile-switcher-modal/modal';

interface ModalParams {
  appId?: string;
  spaceId?: number;
  threadId?: number;
  threadGroupId?: number;
  threadGroupTagId?: number;
  commentId?: number;
  actionId?: number;
  actionLinkId?: number;
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
      {is(MODAL_ROUTES.DELETE_THREAD) && hasParam('threadId') && <DeleteThreadModal threadId={params.threadId!} />}
      {is(MODAL_ROUTES.DELETE_THREAD_GROUP) && hasParam('threadGroupId') && (
        <DeleteThreadGroupModal threadGroupId={params.threadGroupId!} />
      )}
      {is(MODAL_ROUTES.DELETE_THREAD_GROUP_TAG) && hasParam('threadGroupTagId') && (
        <DeleteThreadGroupTagModal threadGroupTagId={params.threadGroupTagId!} />
      )}
      {is(MODAL_ROUTES.PROFILE_SWITCHER) && <ProfileSwitcherModal />}
      {is(MODAL_ROUTES.LOGOUT_CONFIRMATION) && <LogoutConfirmationModal />}
    </Modal>
  );
};
