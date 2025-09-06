import { useApiSpenicleDeleteScheduledTransaction } from '@dimasbaguspm/hooks/use-api';
import { useBottomSheetRoute } from '@dimasbaguspm/providers/bottom-sheet-route-provider';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { Button, ButtonGroup, Modal } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface DeleteScheduledPaymentModalProps {
  scheduledPaymentId: number;
}

export const DeleteScheduledPaymentModal: FC<DeleteScheduledPaymentModalProps> = ({ scheduledPaymentId }) => {
  const { closeModal } = useModalRoute();
  const { closeDrawer, isOpen: isDrawerOpen } = useDrawerRoute();
  const { closeBottomSheet, isOpen: isBottomSheetOpen } = useBottomSheetRoute();

  const [deleteScheduledPayment, , { isPending }] = useApiSpenicleDeleteScheduledTransaction();

  const handleDelete = async () => {
    await deleteScheduledPayment({
      id: scheduledPaymentId,
    });
    closeModal();

    if (isDrawerOpen) closeDrawer();
    if (isBottomSheetOpen) closeBottomSheet();
  };

  return (
    <>
      <Modal.Header>Confirmation</Modal.Header>
      <Modal.Body>Are you sure you want to delete this scheduled payment?</Modal.Body>
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
