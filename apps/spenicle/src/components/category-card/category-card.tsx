import { CategoryModel } from '@dimasbaguspm/interfaces';
import { formatSpenicleCategory } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { Avatar, Badge, BadgeGroup, Card, CardProps } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface CategoryCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  category: CategoryModel;
  onClick?: (category: CategoryModel) => void;
  hideGroup?: boolean;
}

export const CategoryCard: FC<CategoryCardProps> = ({ category, onClick, hideGroup, ...rest }) => {
  const {
    variant,
    name,
    initialName,
    type,
    hasGroup,
    groups,
    budgetRemainingAmount,
    budgetOverByAmount,
    hasBudget,
    isSpendingBudget,
  } = formatSpenicleCategory(category);

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
          <If condition={[hasGroup, !hideGroup]}>
            {groups.map(({ name }) => (
              <Badge key={name} color="accent_3">
                {name}
              </Badge>
            ))}
          </If>
        </BadgeGroup>
      }
      supplementaryInfo={
        hasBudget
          ? isSpendingBudget
            ? category?.budget?.usage.isLimitExceeded
              ? `Over by ${formatPrice(budgetOverByAmount)}`
              : `${formatPrice(budgetRemainingAmount)} left`
            : `${formatPrice(budgetRemainingAmount)} allocated`
          : null
      }
      {...rest}
    />
  );
};
