import { useApiNotunicDeleteThreadGroup } from '@dimasbaguspm/hooks/use-api';
import { useBottomSheetRoute } from '@dimasbaguspm/providers/bottom-sheet-route-provider';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { Button, ButtonGroup, Modal } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface DeleteThreadGroupModalProps {
  threadGroupId: number;
}

export const DeleteThreadGroupModal: FC<DeleteThreadGroupModalProps> = ({ threadGroupId }) => {
  const { closeModal } = useModalRoute();
  const { closeDrawer, isOpen: isDrawerOpen } = useDrawerRoute();
  const { closeBottomSheet, isOpen: isBottomSheetOpen } = useBottomSheetRoute();

  const [deleteThreadGroup, , { isPending }] = useApiNotunicDeleteThreadGroup();

  const handleDelete = async () => {
    await deleteThreadGroup({
      id: threadGroupId,
    });
    closeModal();

    if (isDrawerOpen) closeDrawer();
    if (isBottomSheetOpen) closeBottomSheet();
  };

  return (
    <>
      <Modal.Header>Confirmation</Modal.Header>
      <Modal.Body>Are you sure you want to delete this thread group?</Modal.Body>
      <Modal.Footer>
        <ButtonGroup>
          <Button variant="ghost" onClick={closeModal} busy={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} busy={isPending}>
            Delete
          </Button>
        </ButtonGroup>
      </Modal.Footer>
    </>
  );
};
