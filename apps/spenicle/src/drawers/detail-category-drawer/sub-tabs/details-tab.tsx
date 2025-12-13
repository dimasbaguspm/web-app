import { useApiSpenicleSummaryTransactionsQuery } from '@dimasbaguspm/hooks/use-api';
import { CategoryModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { formatSpenicleCategory } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { formatPrice } from '@dimasbaguspm/utils/price';
import {
  AttributeList,
  Badge,
  BadgeGroup,
  Button,
  ButtonGroup,
  ButtonIcon,
  Heading,
  Hr,
  Icon,
  Text,
} from '@dimasbaguspm/versaur';
import { cx } from 'class-variance-authority';
import dayjs from 'dayjs';
import { ChartAreaIcon, EditIcon, TrashIcon } from 'lucide-react';
import { FC } from 'react';

import { TransactionTrends } from '../../../components/transaction-trends';
import { DRAWER_ROUTES } from '../../../constants/drawer-routes';
import { MODAL_ROUTES } from '../../../constants/modal-routes';
import { useTransactionTrendsFilter } from '../../../hooks/use-transaction-trends-filter';

interface DetailsTabProps {
  data: CategoryModel;
}

export const DetailsTab: FC<DetailsTabProps> = ({ data }) => {
  const { openDrawer } = useDrawerRoute();
  const { openModal } = useModalRoute();

  const filters = useTransactionTrendsFilter({ adapter: 'state' });

  const [transactions] = useApiSpenicleSummaryTransactionsQuery({
    categoryId: [data.id],
    from: dayjs().subtract(4, 'month').startOf('month').toISOString(),
    to: dayjs().endOf('month').toISOString(),
    frequency: filters.appliedFilters.frequency,
    sortBy: 'date',
    type: [data.type],
  });

  const {
    variant,
    type,
    note,
    hasGroup,
    groups,
    hasBudget,
    isSpendingBudget,
    budgetUsage,
    budgetPercentUsage,
    budgetPeriod,
    budgetSpentAmount,
    budgetMaxAmount,
    budgetOverByAmount,
    budgetRemainingAmount,
  } = formatSpenicleCategory(data);

  const handleEditClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_CATEGORY, { categoryId: data.id });
  };

  const handleDeleteClick = () => {
    openModal(MODAL_ROUTES.DELETE_CATEGORY, { categoryId: data.id });
  };

  const handleSetBudgetClick = () => {
    openDrawer(DRAWER_ROUTES.NEW_CATEGORY_BUDGET, { categoryId: data.id });
  };

  const handleEditBudgetClick = () => {
    if (!data.budget) return;
    openDrawer(DRAWER_ROUTES.EDIT_CATEGORY_BUDGET, { categoryId: data.id, categoryBudgetId: data.budget.id });
  };

  return (
    <>
      <ButtonGroup className="mb-4">
        <Button variant="outline" onClick={handleEditClick}>
          <Icon as={EditIcon} color="inherit" size="sm" />
          Edit
        </Button>
        <If condition={!hasBudget}>
          <Button variant="outline" onClick={handleSetBudgetClick}>
            <Icon as={ChartAreaIcon} color="inherit" size="sm" />
            Set Budget
          </Button>
        </If>
        <If condition={hasBudget}>
          <Button variant="outline" onClick={handleEditBudgetClick}>
            <Icon as={ChartAreaIcon} color="inherit" size="sm" />
            Edit Budget
          </Button>
        </If>
        <ButtonIcon
          as={TrashIcon}
          onClick={handleDeleteClick}
          className="ml-auto"
          variant="outline"
          aria-label="Delete category"
        />
      </ButtonGroup>

      <BadgeGroup className="mb-4">
        <Badge color={variant}>{type}</Badge>
      </BadgeGroup>

      <If condition={[hasGroup || note]}>
        <AttributeList className="mb-4">
          <If condition={hasGroup}>
            <AttributeList.Item title="Groups">{groups.map(({ name }) => name).join(', ')}</AttributeList.Item>
          </If>
          <If condition={note}>
            <AttributeList.Item title="Notes" span={12}>
              {note}
            </AttributeList.Item>
          </If>
        </AttributeList>
        <Hr hasMargin />
      </If>

      <If condition={['expense', 'income'].includes(data.type)}>
        <TransactionTrends
          transactions={transactions || []}
          metric={data.type === 'transfer' ? 'net' : data.type}
          frequency={filters.appliedFilters.frequency}
          hideStats
        />
      </If>

      <If condition={Boolean(hasBudget)}>
        <Hr hasMargin />
        <div>
          <Heading level={3} hasMargin>
            Budget
          </Heading>
          <div className="bg-white space-y-3">
            <div className="flex items-center justify-between text-neutral-900">
              <div>
                <div className="text-lg font-semibold">{formatPrice(budgetSpentAmount)}</div>
                <div className="text-sm text-neutral-600">of {formatPrice(budgetMaxAmount)} spent</div>
              </div>
              <If condition={isSpendingBudget}>
                <If condition={!budgetUsage?.isLimitExceeded}>
                  <div className="text-sm font-semibold text-secondary">{formatPrice(budgetRemainingAmount)} left</div>
                </If>
                <If condition={budgetUsage?.isLimitExceeded}>
                  <div className="text-sm font-semibold text-primary">{formatPrice(budgetOverByAmount)} over</div>
                </If>
              </If>
              <If condition={!isSpendingBudget}>
                <div className="text-sm font-semibold text-secondary">
                  {formatPrice(budgetRemainingAmount)} allocated
                </div>
              </If>
            </div>

            <div className="w-full h-3 rounded-full bg-neutral-100 overflow-hidden">
              <div
                className={cx(
                  `h-full rounded-full`,
                  isSpendingBudget ? (budgetUsage?.isLimitExceeded ? 'bg-primary' : 'bg-secondary') : 'bg-secondary',
                )}
                style={{ width: `${Math.min(budgetPercentUsage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between">
              <Text fontSize="xs" color="gray">
                {budgetPercentUsage.toFixed(0)}% of {isSpendingBudget ? 'limit used' : 'budget allocated'}
              </Text>
              <Text fontSize="xs" color="gray">
                {budgetPeriod}
              </Text>
            </div>
          </div>
        </div>
      </If>
    </>
  );
};
