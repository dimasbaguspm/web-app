import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { Button, ButtonGroup, ButtonIcon, Drawer, Icon } from '@dimasbaguspm/versaur';
import { Edit3Icon, TrashIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { MODAL_ROUTES } from '../../constants/modal-routes';

interface DetailCategoryGroupDrawerProps {
  categoryGroupId: number;
}

export const DetailCategoryGroupDrawer: FC<DetailCategoryGroupDrawerProps> = ({ categoryGroupId }) => {
  const { openDrawer } = useDrawerRoute();
  const { openModal } = useModalRoute();

  const handleEditClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_ACCOUNT_GROUP, { categoryGroupId });
  };

  const handleDeleteClick = () => {
    openModal(MODAL_ROUTES.DELETE_ACCOUNT_GROUP, { categoryGroupId });
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Category Group Details</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <ButtonGroup alignment="between">
          <ButtonGroup>
            <Button variant="outline" onClick={handleEditClick}>
              <Icon as={Edit3Icon} color="inherit" size="sm" />
              Edit
            </Button>
          </ButtonGroup>
          <ButtonIcon
            as={TrashIcon}
            variant="danger-outline"
            aria-label="Delete Category Group"
            onClick={handleDeleteClick}
          />
        </ButtonGroup>
      </Drawer.Body>
    </>
  );
};
