import { CategoryGroupModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { nameToInitials } from '@dimasbaguspm/utils/initial';
import { Avatar, Button, ButtonIcon, Card, Icon, Text } from '@dimasbaguspm/versaur';
import { EditIcon, TrashIcon, UsersIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../../constants/drawer-routes';

interface CategoryGroupCardProps {
  categoryGroup: CategoryGroupModel;
  categoryCount?: number;
  onDelete?: (categoryGroup: CategoryGroupModel) => void;
}

export const CategoryGroupCard: FC<CategoryGroupCardProps> = ({ categoryGroup, categoryCount = 0, onDelete }) => {
  const { openDrawer } = useDrawerRoute();

  const handleEdit = () => {
    openDrawer(DRAWER_ROUTES.EDIT_CATEGORY_GROUP, { categoryGroupId: categoryGroup.id });
  };

  const handleManageMembers = () => {
    //
  };

  const handleDelete = () => {
    onDelete?.(categoryGroup);
  };

  return (
    <Card
      avatar={<Avatar shape="rounded">{nameToInitials(categoryGroup.name)}</Avatar>}
      title={categoryGroup.name}
      subtitle={
        <div className="flex items-center gap-2">
          <Icon as={UsersIcon} size="sm" color="gray" />
          <Text fontSize="sm" color="gray">
            {categoryCount} {categoryCount === 1 ? 'category' : 'categories'}
          </Text>
        </div>
      }
      actions={
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleManageMembers}>
            <Icon as={UsersIcon} size="sm" color="inherit" />
            Members
          </Button>
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <Icon as={EditIcon} size="sm" color="inherit" />
            Edit
          </Button>
          <ButtonIcon
            as={TrashIcon}
            variant="danger-outline"
            size="sm"
            onClick={handleDelete}
            aria-label="Delete category group"
          />
        </div>
      }
    />
  );
};
