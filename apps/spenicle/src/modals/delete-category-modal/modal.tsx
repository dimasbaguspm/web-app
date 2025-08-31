import { useApiSpenicleDeleteCategory } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { Button, ButtonGroup, Modal } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface DeleteCategoryModalProps {
  categoryId: number;
}

export const DeleteCategoryModal: FC<DeleteCategoryModalProps> = ({ categoryId }) => {
  const { closeModal } = useModalRoute();
  const { closeDrawer, isOpen: isDrawerOpen } = useDrawerRoute();

  const [deleteCategory, , { isPending }] = useApiSpenicleDeleteCategory();

  const handleDelete = async () => {
    await deleteCategory({
      id: categoryId,
    });
    closeModal();

    if (isDrawerOpen) closeDrawer();
  };

  return (
    <>
      <Modal.Header>Delete Category</Modal.Header>
      <Modal.Body>Are you sure you want to delete this category?</Modal.Body>
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
