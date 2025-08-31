import {
  useApiSpenicleSummaryAccountsQuery,
  useApiSpenicleSummaryCategoriesQuery,
  useApiSpenicleSummaryTotalQuery,
  useApiSpenicleSummaryTransactionsQuery,
} from '@dimasbaguspm/hooks/use-api';
import { If } from '@dimasbaguspm/utils/if';
import { LoadingIndicator } from '@dimasbaguspm/versaur';

import { useSummaryFilter } from '../summary/hooks/use-summary-filter';

import { OverviewChart } from './components/overview-chart';
import { TopTenExpenseAccounts } from './components/top-ten-expense-accounts';
import { TopTenExpenseCategories } from './components/top-ten-expense-categories';
import { TopTenIncomeAccounts } from './components/top-ten-income-accounts';
import { TopTenIncomeCategories } from './components/top-ten-income-categories';

const SummaryPage = () => {
  const { appliedFilters } = useSummaryFilter();

  const dateFilters = {
    from: appliedFilters.range.startDate.toISOString(),
    to: appliedFilters.range.endDate.toISOString(),
  };

  const [summaryTotal, , { isFetching: isFetchingSummaryTotal }] = useApiSpenicleSummaryTotalQuery({
    ...dateFilters,
    categoryId: appliedFilters.categoryIds,
    accountId: appliedFilters.accountIds,
  });

  const [summaryTransactions, , { isFetching: isFetchingSummaryTransactions }] = useApiSpenicleSummaryTransactionsQuery(
    {
      ...dateFilters,
      frequency: 'daily',
      categoryId: appliedFilters.categoryIds,
      accountId: appliedFilters.accountIds,
    },
  );

  const [summaryExpenseCategories, , { isFetching: isFetchingSummaryExpenseCategories }] =
    useApiSpenicleSummaryCategoriesQuery({
      ...dateFilters,
      id: appliedFilters.categoryIds,
      type: ['expense'],
    });

  const [summaryIncomeCategories, , { isFetching: isFetchingSummaryIncomeCategories }] =
    useApiSpenicleSummaryCategoriesQuery({
      ...dateFilters,
      id: appliedFilters.categoryIds,
      type: ['income'],
    });

  const [summaryExpenseAccounts, , { isFetching: isFetchingSummaryExpenseAccounts }] =
    useApiSpenicleSummaryAccountsQuery({
      ...dateFilters,
      id: appliedFilters.accountIds,
      type: 'expense',
    });

  const [summaryIncomeAccounts, , { isFetching: isFetchingSummaryIncomeAccounts }] = useApiSpenicleSummaryAccountsQuery(
    {
      ...dateFilters,
      id: appliedFilters.accountIds,
      type: 'income',
    },
  );

  const isLoading =
    isFetchingSummaryTotal ||
    isFetchingSummaryTransactions ||
    isFetchingSummaryExpenseCategories ||
    isFetchingSummaryIncomeCategories ||
    isFetchingSummaryExpenseAccounts ||
    isFetchingSummaryIncomeAccounts;

  return (
    <>
      <If condition={isLoading}>
        <LoadingIndicator type="bar" size="sm" />
      </If>

      <If
        condition={[
          !isLoading,
          summaryTotal,
          summaryTransactions,
          summaryExpenseCategories,
          summaryIncomeCategories,
          summaryExpenseAccounts,
          summaryIncomeAccounts,
        ]}
      >
        <div className="space-y-16">
          <OverviewChart data={summaryTotal!} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-16">
            <TopTenExpenseCategories data={summaryExpenseCategories!} />
            <TopTenIncomeCategories data={summaryIncomeCategories!} />
            <TopTenExpenseAccounts data={summaryExpenseAccounts!} />
            <TopTenIncomeAccounts data={summaryIncomeAccounts!} />
          </div>
        </div>
      </If>
    </>
  );
};

export default SummaryPage;
