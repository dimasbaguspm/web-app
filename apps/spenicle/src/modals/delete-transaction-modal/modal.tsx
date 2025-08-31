import { useApiSpenicleDeleteTransaction } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { Button, ButtonGroup, Modal } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface DeleteTransactionModalProps {
  transactionId: number;
}

export const DeleteTransactionModal: FC<DeleteTransactionModalProps> = ({
  transactionId,
}) => {
  const { closeModal } = useModalRoute();
  const { closeDrawer, isOpen: isDrawerOpen } = useDrawerRoute();

  const [deleteTransaction, , { isPending }] =
    useApiSpenicleDeleteTransaction();

  const handleDelete = async () => {
    await deleteTransaction({
      id: transactionId,
    });
    closeModal();

    if (isDrawerOpen) closeDrawer();
  };

  return (
    <>
      <Modal.Header>Delete Transaction</Modal.Header>
      <Modal.Body>Are you sure you want to delete this transaction?</Modal.Body>
      <Modal.Footer>
        <ButtonGroup>
          <Button variant="ghost" onClick={closeModal} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isPending}>
            Delete
          </Button>
        </ButtonGroup>
      </Modal.Footer>
    </>
  );
};
