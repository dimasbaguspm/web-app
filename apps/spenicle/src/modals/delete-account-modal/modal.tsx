import { useApiSpenicleDeleteAccount } from '@dimasbaguspm/hooks/use-api';
import { useBottomSheetRoute } from '@dimasbaguspm/providers/bottom-sheet-route-provider';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { Button, ButtonGroup, Modal } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface DeleteAccountModalProps {
  accountId: number;
}

export const DeleteAccountModal: FC<DeleteAccountModalProps> = ({ accountId }) => {
  const { closeModal } = useModalRoute();
  const { closeDrawer, isOpen: isDrawerOpen } = useDrawerRoute();
  const { closeBottomSheet, isOpen: isBottomSheetOpen } = useBottomSheetRoute();

  const [deleteAccount, , { isPending }] = useApiSpenicleDeleteAccount();

  const handleDelete = async () => {
    await deleteAccount({
      id: accountId,
    });
    closeModal();

    if (isDrawerOpen) closeDrawer();
    if (isBottomSheetOpen) closeBottomSheet();
  };

  return (
    <>
      <Modal.Header>Delete Account</Modal.Header>
      <Modal.Body>Are you sure you want to delete this account?</Modal.Body>
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
