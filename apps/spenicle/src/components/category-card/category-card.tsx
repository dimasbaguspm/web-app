import { CategoryModel } from '@dimasbaguspm/interfaces';
import { formatSpenicleCategory } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { nameToInitials } from '@dimasbaguspm/utils/initial';
import { Avatar, Badge, BadgeGroup, Card, CardProps } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface CategoryCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered'> {
  category: CategoryModel;
  onClick?: (category: CategoryModel) => void;
}

export const CategoryCard: FC<CategoryCardProps> = ({ category, onClick, ...rest }) => {
  const { variant, type, hasGroup, groups } = formatSpenicleCategory(category);
  const handleClick = () => {
    onClick?.(category);
  };

  return (
    <Card
      {...rest}
      onClick={handleClick}
      avatar={<Avatar shape="rounded">{nameToInitials(category.name)}</Avatar>}
      title={category.name}
      badge={
        <BadgeGroup>
          <Badge color={variant}>{type}</Badge>
          <If condition={hasGroup}>
            {groups.map(({ name }) => (
              <Badge key={name} color="accent_2">
                {name}
              </Badge>
            ))}
          </If>
        </BadgeGroup>
      }
    />
  );
};
