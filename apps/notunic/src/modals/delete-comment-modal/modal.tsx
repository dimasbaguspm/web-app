import { useApiNotunicDeleteComment } from '@dimasbaguspm/hooks/use-api';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { Button, ButtonGroup, Modal } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface DeleteCommentModalProps {
  commentId: number;
}

export const DeleteCommentModal: FC<DeleteCommentModalProps> = ({ commentId }) => {
  const { closeModal } = useModalRoute();

  const [deleteComment, , { isPending }] = useApiNotunicDeleteComment();

  const handleDelete = async () => {
    await deleteComment({
      id: commentId,
    });
    closeModal();
  };

  return (
    <>
      <Modal.Header>Confirmation</Modal.Header>
      <Modal.Body>Are you sure you want to delete this comment?</Modal.Body>
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
