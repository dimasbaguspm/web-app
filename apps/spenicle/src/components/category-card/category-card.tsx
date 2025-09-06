import { CategoryModel } from '@dimasbaguspm/interfaces';
import { formatSpenicleCategory } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { Avatar, Badge, BadgeGroup, Card, CardProps } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface CategoryCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  category: CategoryModel;
  onClick?: (category: CategoryModel) => void;
}

export const CategoryCard: FC<CategoryCardProps> = ({ category, onClick, ...rest }) => {
  const { variant, name, initialName, type, hasGroup, groups } = formatSpenicleCategory(category);
  const handleClick = () => {
    onClick?.(category);
  };

  return (
    <Card
      onClick={handleClick}
      avatar={<Avatar shape="rounded">{initialName}</Avatar>}
      title={name}
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
      {...rest}
    />
  );
};
