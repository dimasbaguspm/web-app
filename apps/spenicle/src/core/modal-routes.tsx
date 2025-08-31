import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { Modal } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { MODAL_ROUTES } from '../constants/modal-routes';
import { DeleteAccountModal } from '../modals/delete-account-modal/modal';
import { DeleteCategoryModal } from '../modals/delete-category-modal/modal';
import { DeleteTransactionModal } from '../modals/delete-transaction-modal/modal';

interface ModalParams {
  appId?: string;
  accountId?: number;
  categoryId?: number;
  transactionId?: number;
  payloadId?: string;
  tabId?: string;
}

interface ModalState {
  payload?: Record<string, string>;
  returnToDrawer?: string;
  returnToDrawerId?: Record<string, string> | null;
}

export const ModalRoutes: FC = () => {
  const { isOpen, modalId, params, closeModal } = useModalRoute<
    ModalParams,
    ModalState
  >();

  const is = (id: string) => modalId === id;
  const hasParam = (param: keyof typeof params) => param in params;
  //   const hasState = (stateKey: keyof typeof state) => stateKey in state;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size={'lg'}>
      {is(MODAL_ROUTES.DELETE_TRANSACTION) && hasParam('transactionId') && (
        <DeleteTransactionModal transactionId={params.transactionId!} />
      )}
      {is(MODAL_ROUTES.DELETE_ACCOUNT) && hasParam('accountId') && (
        <DeleteAccountModal accountId={params.accountId!} />
      )}
      {is(MODAL_ROUTES.DELETE_CATEGORY) && hasParam('categoryId') && (
        <DeleteCategoryModal categoryId={params.categoryId!} />
      )}
    </Modal>
  );
};
