import { CategoryGroupModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { nameToInitials } from '@dimasbaguspm/utils/initial';
import { Avatar, Card, Icon, Text } from '@dimasbaguspm/versaur';
import { UsersIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../../constants/drawer-routes';

interface CategoryGroupCardProps {
  categoryGroup: CategoryGroupModel;
}

export const CategoryGroupCard: FC<CategoryGroupCardProps> = ({ categoryGroup }) => {
  const { openDrawer } = useDrawerRoute();

  const handleOnCardClick = () => {
    openDrawer(DRAWER_ROUTES.DETAIL_CATEGORY_GROUP, { categoryGroupId: categoryGroup.id });
  };

  const categoryCount = categoryGroup.memberIds.length;

  return (
    <Card
      onClick={handleOnCardClick}
      avatar={
        <Avatar shape="rounded" size="lg">
          {nameToInitials(categoryGroup.name)}
        </Avatar>
      }
      title={categoryGroup.name}
      subtitle={
        <Card.List>
          <Card.ListItem>
            <Icon as={UsersIcon} size="sm" color="gray" className="mr-2" />
            <Text fontSize="sm" color="gray">
              {categoryCount} {categoryCount === 1 ? 'category' : 'categories'}
            </Text>
          </Card.ListItem>
        </Card.List>
      }
    />
  );
};
