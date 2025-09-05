import {
  useApiSpenicleSummaryAccountsQuery,
  useApiSpenicleSummaryCategoriesQuery,
  useApiSpenicleSummaryTotalQuery,
  useApiSpenicleSummaryTransactionsQuery,
} from '@dimasbaguspm/hooks/use-api';
import { If } from '@dimasbaguspm/utils/if';
import { PageLoader } from '@dimasbaguspm/versaur';

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

  const [summaryTotal, , { isLoading: isFetchingSummaryTotal }] = useApiSpenicleSummaryTotalQuery({
    ...dateFilters,
    categoryId: appliedFilters.categoryIds,
    accountId: appliedFilters.accountIds,
  });

  const [summaryTransactions, , { isLoading: isFetchingSummaryTransactions }] = useApiSpenicleSummaryTransactionsQuery({
    ...dateFilters,
    frequency: 'daily',
    categoryId: appliedFilters.categoryIds,
    accountId: appliedFilters.accountIds,
  });

  const [summaryExpenseCategories, , { isLoading: isFetchingSummaryExpenseCategories }] =
    useApiSpenicleSummaryCategoriesQuery({
      ...dateFilters,
      id: appliedFilters.categoryIds,
      type: ['expense'],
    });

  const [summaryIncomeCategories, , { isLoading: isFetchingSummaryIncomeCategories }] =
    useApiSpenicleSummaryCategoriesQuery({
      ...dateFilters,
      id: appliedFilters.categoryIds,
      type: ['income'],
    });

  const [summaryExpenseAccounts, , { isLoading: isFetchingSummaryExpenseAccounts }] =
    useApiSpenicleSummaryAccountsQuery({
      ...dateFilters,
      id: appliedFilters.accountIds,
      type: 'expense',
    });

  const [summaryIncomeAccounts, , { isLoading: isFetchingSummaryIncomeAccounts }] = useApiSpenicleSummaryAccountsQuery({
    ...dateFilters,
    id: appliedFilters.accountIds,
    type: 'income',
  });

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
        <PageLoader />
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
        <div className="space-y-6">
          <OverviewChart data={summaryTotal!} />

          <div>
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
