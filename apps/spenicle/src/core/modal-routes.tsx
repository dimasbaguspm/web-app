import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { Modal } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { MODAL_ROUTES } from '../constants/modal-routes';
import { DeleteAccountGroupModal } from '../modals/delete-account-group-modal/modal';
import { DeleteAccountModal } from '../modals/delete-account-modal/modal';
import { DeleteCategoryGroupModal } from '../modals/delete-category-group-modal/modal';
import { DeleteCategoryModal } from '../modals/delete-category-modal/modal';
import { DeleteScheduledPaymentModal } from '../modals/delete-scheduled-payment-modal/modal';
import { DeleteTransactionModal } from '../modals/delete-transaction-modal/modal';
import { LogoutConfirmationModal } from '../modals/logout-confirmation-modal/modal';
import { ProfileSwitcherModal } from '../modals/profile-switcher-modal/modal';

interface ModalParams {
  appId?: string;
  accountId?: number;
  accountGroupId?: number;
  categoryId?: number;
  categoryGroupId?: number;
  transactionId?: number;
  scheduledPaymentId?: number;
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
      {is(MODAL_ROUTES.PROFILE_SWITCHER) && <ProfileSwitcherModal />}
      {is(MODAL_ROUTES.LOGOUT_CONFIRMATION) && <LogoutConfirmationModal />}
      {is(MODAL_ROUTES.DELETE_TRANSACTION) && hasParam('transactionId') && (
        <DeleteTransactionModal transactionId={params.transactionId!} />
      )}
      {is(MODAL_ROUTES.DELETE_ACCOUNT) && hasParam('accountId') && <DeleteAccountModal accountId={params.accountId!} />}
      {is(MODAL_ROUTES.DELETE_CATEGORY) && hasParam('categoryId') && (
        <DeleteCategoryModal categoryId={params.categoryId!} />
      )}
      {is(MODAL_ROUTES.DELETE_ACCOUNT_GROUP) && hasParam('accountGroupId') && (
        <DeleteAccountGroupModal accountGroupId={params.accountGroupId!} />
      )}
      {is(MODAL_ROUTES.DELETE_CATEGORY_GROUP) && hasParam('categoryGroupId') && (
        <DeleteCategoryGroupModal categoryGroupId={params.categoryGroupId!} />
      )}
      {is(MODAL_ROUTES.DELETE_SCHEDULED_PAYMENT) && hasParam('scheduledPaymentId') && (
        <DeleteScheduledPaymentModal scheduledPaymentId={params.scheduledPaymentId!} />
      )}
    </Modal>
  );
};
