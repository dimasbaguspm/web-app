import {
  useApiSpenicleSummaryAccountsQuery,
  useApiSpenicleSummaryCategoriesQuery,
  useApiSpenicleSummaryTotalQuery,
} from '@dimasbaguspm/hooks/use-api';
import { If } from '@dimasbaguspm/utils/if';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { Heading, PageLoader, Text, Tile } from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { useMemo } from 'react';

import { useSummaryFilter } from '../../hooks/use-summary-filter';
import { ComparisonBadge } from '../summary/components/comparison-badge';
import { ComparisonData, ExpenseBreakdownItem } from '../summary/types';

const SummaryBreakdownPage = () => {
  const { appliedFilters } = useSummaryFilter({ adapter: 'url' });

  const dateFrom = dayjs(appliedFilters.dateFrom);
  const dateTo = dayjs(appliedFilters.dateTo);
  const daysDiff = dateTo.diff(dateFrom, 'day') + 1;

  // Current period
  const currentPeriodFilters = {
    from: dateFrom.toISOString(),
    to: dateTo.toISOString(),
  };

  // Previous period
  const previousPeriodFilters = {
    from: dateFrom.subtract(daysDiff, 'day').toISOString(),
    to: dateFrom.subtract(1, 'day').toISOString(),
  };

  const [currentTotal] = useApiSpenicleSummaryTotalQuery({
    ...currentPeriodFilters,
    categoryId: appliedFilters.categoryId,
    accountId: appliedFilters.accountId,
  });

  const [currentExpenseCategories, , { isLoading: isLoadingCurrentCategories }] = useApiSpenicleSummaryCategoriesQuery({
    ...currentPeriodFilters,
    id: appliedFilters.categoryId,
    type: ['expense'],
  });

  const [previousExpenseCategories] = useApiSpenicleSummaryCategoriesQuery({
    ...previousPeriodFilters,
    id: appliedFilters.categoryId,
    type: ['expense'],
  });

  const [currentExpenseAccounts, , { isLoading: isLoadingCurrentAccounts }] = useApiSpenicleSummaryAccountsQuery({
    ...currentPeriodFilters,
    id: appliedFilters.accountId,
    type: 'expense',
  });

  const [previousExpenseAccounts] = useApiSpenicleSummaryAccountsQuery({
    ...previousPeriodFilters,
    id: appliedFilters.accountId,
    type: 'expense',
  });

  const isLoading = isLoadingCurrentCategories || isLoadingCurrentAccounts;

  // Process category breakdown with comparison
  const categoryBreakdown: ExpenseBreakdownItem[] = useMemo(() => {
    if (!currentExpenseCategories || !Array.isArray(currentExpenseCategories)) return [];

    const totalExpense = Math.abs(currentTotal?.expense ?? 0);
    const previousMap = new Map(
      (previousExpenseCategories || []).map((cat) => [cat.categoryId, Math.abs(cat.expense ?? 0)]),
    );

    return currentExpenseCategories
      .map((category) => {
        const currentAmount = Math.abs(category.expense ?? 0);
        const previousAmount = previousMap.get(category.categoryId) ?? 0;
        const percentageChange = previousAmount === 0 ? 0 : ((currentAmount - previousAmount) / previousAmount) * 100;

        const comparison: ComparisonData = {
          current: currentAmount,
          previous: previousAmount,
          percentageChange,
          isIncrease: currentAmount > previousAmount,
        };

        return {
          id: category.categoryId,
          name: category.categoryName,
          amount: currentAmount,
          percentage: totalExpense === 0 ? 0 : (currentAmount / totalExpense) * 100,
          previousAmount,
          change: comparison,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [currentExpenseCategories, previousExpenseCategories, currentTotal]);

  // Process account breakdown with comparison
  const accountBreakdown: ExpenseBreakdownItem[] = useMemo(() => {
    if (!currentExpenseAccounts || !Array.isArray(currentExpenseAccounts)) return [];

    const totalExpense = Math.abs(currentTotal?.expense ?? 0);
    const previousMap = new Map(
      (previousExpenseAccounts || []).map((acc) => [acc.accountId, Math.abs(acc.expense ?? 0)]),
    );

    return currentExpenseAccounts
      .map((account) => {
        const currentAmount = Math.abs(account.expense ?? 0);
        const previousAmount = previousMap.get(account.accountId) ?? 0;
        const percentageChange = previousAmount === 0 ? 0 : ((currentAmount - previousAmount) / previousAmount) * 100;

        const comparison: ComparisonData = {
          current: currentAmount,
          previous: previousAmount,
          percentageChange,
          isIncrease: currentAmount > previousAmount,
        };

        return {
          id: account.accountId,
          name: account.accountName,
          amount: currentAmount,
          percentage: totalExpense === 0 ? 0 : (currentAmount / totalExpense) * 100,
          previousAmount,
          change: comparison,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [currentExpenseAccounts, previousExpenseAccounts, currentTotal]);

  return (
    <>
      <If condition={isLoading}>
        <PageLoader />
      </If>

      <If condition={!isLoading}>
        <div className="space-y-8">
          {/* Expenses by Category */}
          <div>
            <Heading level={3} color="ghost" className="mb-4">
              Expenses by Category
            </Heading>
            <div className="space-y-3">
              {categoryBreakdown.length === 0 ? (
                <Text color="gray" className="text-center py-8">
                  No expense data available for this period
                </Text>
              ) : (
                categoryBreakdown.map((item) => (
                  <Tile key={item.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Text fontWeight="semibold">{item.name}</Text>
                          {item.change && (
                            <ComparisonBadge
                              percentageChange={item.change.percentageChange}
                              isIncrease={item.change.isIncrease}
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Text fontSize="sm" color="gray">
                            {item.percentage.toFixed(1)}% of total
                          </Text>
                          {item.previousAmount !== undefined && item.previousAmount > 0 && (
                            <>
                              <Text fontSize="sm" color="gray">
                                •
                              </Text>
                              <Text fontSize="sm" color="gray">
                                Previous: {formatPrice(item.previousAmount)}
                              </Text>
                            </>
                          )}
                        </div>
                      </div>
                      <Text fontWeight="bold" fontSize="lg">
                        {formatPrice(item.amount)}
                      </Text>
                    </div>
                  </Tile>
                ))
              )}
            </div>
          </div>

          {/* Expenses by Account */}
          <div>
            <Heading level={3} color="ghost" className="mb-4">
              Expenses by Account
            </Heading>
            <div className="space-y-3">
              {accountBreakdown.length === 0 ? (
                <Text color="gray" className="text-center py-8">
                  No expense data available for this period
                </Text>
              ) : (
                accountBreakdown.map((item) => (
                  <Tile key={item.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Text fontWeight="semibold">{item.name}</Text>
                          {item.change && (
                            <ComparisonBadge
                              percentageChange={item.change.percentageChange}
                              isIncrease={item.change.isIncrease}
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Text fontSize="sm" color="gray">
                            {item.percentage.toFixed(1)}% of total
                          </Text>
                          {item.previousAmount !== undefined && item.previousAmount > 0 && (
                            <>
                              <Text fontSize="sm" color="gray">
                                •
                              </Text>
                              <Text fontSize="sm" color="gray">
                                Previous: {formatPrice(item.previousAmount)}
                              </Text>
                            </>
                          )}
                        </div>
                      </div>
                      <Text fontWeight="bold" fontSize="lg">
                        {formatPrice(item.amount)}
                      </Text>
                    </div>
                  </Tile>
                ))
              )}
            </div>
          </div>
        </div>
      </If>
    </>
  );
};

export default SummaryBreakdownPage;
