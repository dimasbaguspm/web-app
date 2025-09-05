import { CategoryGroupModel } from '@dimasbaguspm/interfaces';
import { nameToInitials } from '@dimasbaguspm/utils/initial';
import { Avatar, Card, CardProps, Icon, Text } from '@dimasbaguspm/versaur';
import { UsersIcon } from 'lucide-react';
import { FC } from 'react';

interface CategoryGroupCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered'> {
  categoryGroup: CategoryGroupModel;
  onClick?: (categoryGroup: CategoryGroupModel) => void;
}

export const CategoryGroupCard: FC<CategoryGroupCardProps> = ({ categoryGroup, onClick, ...props }) => {
  const categoryCount = categoryGroup.memberIds.length;

  return (
    <Card
      {...props}
      onClick={() => onClick?.(categoryGroup)}
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
