import { CategoryModel } from '@dimasbaguspm/interfaces';
import { nameToInitials } from '@dimasbaguspm/utils/initial';
import { Avatar, Card } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface CategoryCardProps {
  category: CategoryModel;
  onClick?: (category: CategoryModel) => void;
}

export const CategoryCard: FC<CategoryCardProps> = ({ category, onClick }) => {
  const handleClick = () => {
    onClick?.(category);
  };

  return (
    <Card
      onClick={handleClick}
      avatar={<Avatar shape="square">{nameToInitials(category.name)}</Avatar>}
      title={category.name}
    />
  );
};
