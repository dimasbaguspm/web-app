import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { Button, ButtonGroup, Modal } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface DeleteAppProfileAuthModalProps {
  appProfileId: number;
}

export const DeleteAppProfileAuthModal: FC<DeleteAppProfileAuthModalProps> = () => {
  const { closeModal } = useModalRoute();

  // const [deleteAppProfile, , { isPending }] = useApiHiDeleteAppProfileAuth();

  const handleDelete = async () => {
    // await deleteAppProfile({
    //   id: appProfileId,
    // });
    closeModal();
  };

  return (
    <>
      <Modal.Header>Confirmation</Modal.Header>
      <Modal.Body>Are you sure you want to delete PIN for this profile?</Modal.Body>
      <Modal.Footer>
        <ButtonGroup>
          <Button variant="ghost" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </ButtonGroup>
      </Modal.Footer>
    </>
  );
};
