import { useApiSpenicleSummaryCategoriesQuery, useApiSpenicleSummaryTotalQuery } from '@dimasbaguspm/hooks/use-api';
import { If } from '@dimasbaguspm/utils/if';
import { Hr, PageLoader } from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';

import { useSummaryFilter } from '../../hooks/use-summary-filter';

import { CategoryBreakdownCard } from './components';

const SummaryBreakdownPage = () => {
  const { appliedFilters } = useSummaryFilter({ adapter: 'url' });

  const dateFrom = dayjs(appliedFilters.dateFrom);
  const dateTo = dayjs(appliedFilters.dateTo);

  // Current period
  const currentPeriodFilters = {
    from: dateFrom.toISOString(),
    to: dateTo.toISOString(),
  };

  const [currentTotal] = useApiSpenicleSummaryTotalQuery({
    ...currentPeriodFilters,
    categoryId: appliedFilters.categoryId,
    accountId: appliedFilters.accountId,
  });

  const [currentExpenseCategories, , { isLoading: isLoadingExpenseCategories }] = useApiSpenicleSummaryCategoriesQuery({
    ...currentPeriodFilters,
    id: appliedFilters.categoryId,
    type: ['expense'],
  });

  const [currentIncomeCategories, , { isLoading: isLoadingIncomeCategories }] = useApiSpenicleSummaryCategoriesQuery({
    ...currentPeriodFilters,
    id: appliedFilters.categoryId,
    type: ['income'],
  });

  const isLoading = isLoadingExpenseCategories || isLoadingIncomeCategories;

  const totalExpense = Math.abs(currentTotal?.expense ?? 0);
  const totalIncome = Math.abs(currentTotal?.income ?? 0);

  return (
    <>
      <If condition={isLoading}>
        <PageLoader />
      </If>

      <If condition={!isLoading}>
        <div className="space-y-6">
          {/* Expense Breakdown */}
          <CategoryBreakdownCard data={currentExpenseCategories || []} type="expense" total={totalExpense} />

          <Hr hasMargin />
          {/* Income Breakdown */}
          <CategoryBreakdownCard data={currentIncomeCategories || []} type="income" total={totalIncome} />
        </div>
      </If>
    </>
  );
};

export default SummaryBreakdownPage;
