import { CategoryModel } from '@dimasbaguspm/interfaces';
import { formatSpenicleCategory } from '@dimasbaguspm/utils/data';
import { nameToInitials } from '@dimasbaguspm/utils/initial';
import { Avatar, Badge, BadgeGroup, Card } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface CategoryCardProps {
  category: CategoryModel;
  onClick?: (category: CategoryModel) => void;
}

export const CategoryCard: FC<CategoryCardProps> = ({ category, onClick }) => {
  const { variant, type } = formatSpenicleCategory(category);
  const handleClick = () => {
    onClick?.(category);
  };

  return (
    <Card
      onClick={handleClick}
      avatar={<Avatar shape="rounded">{nameToInitials(category.name)}</Avatar>}
      title={category.name}
      badge={
        <BadgeGroup>
          <Badge color={variant}>{type}</Badge>
        </BadgeGroup>
      }
    />
  );
};
