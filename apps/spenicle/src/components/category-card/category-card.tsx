import { CategoryModel } from '@dimasbaguspm/interfaces';
import { formatSpenicleCategory } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { Avatar, Badge, BadgeGroup, Card, CardProps, Icon, Text } from '@dimasbaguspm/versaur';
import { Wallet2Icon } from 'lucide-react';
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
    budgetFrequency,
  } = formatSpenicleCategory(category);

  const handleClick = () => {
    onClick?.(category);
  };

  return (
    <Card
      onClick={handleClick}
      avatar={<Avatar shape="rounded">{initialName}</Avatar>}
      title={
        <div className="flex items-center">
          {name}
          <If condition={hasBudget}>
            <Icon as={Wallet2Icon} size="sm" color="gray" className="ml-2" aria-label="Has budget" />
          </If>
        </div>
      }
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
        <If condition={hasBudget}>
          <Text fontSize="sm" color="gray">
            <If condition={isSpendingBudget}>
              {category.budget?.usage.isLimitExceeded
                ? `Over by ${formatPrice(budgetOverByAmount)}`
                : `${formatPrice(budgetRemainingAmount)} left`}
            </If>
            <If condition={!isSpendingBudget}>{`${formatPrice(budgetRemainingAmount)} allocated`}</If> ·{' '}
            {budgetFrequency} reset
          </Text>
        </If>
      }
      {...rest}
    />
  );
};
