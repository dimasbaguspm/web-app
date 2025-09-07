import {
  useApiSpenicleSummaryAccountsQuery,
  useApiSpenicleSummaryCategoriesQuery,
  useApiSpenicleSummaryTotalQuery,
  useApiSpenicleSummaryTransactionsQuery,
} from '@dimasbaguspm/hooks/use-api';
import { If } from '@dimasbaguspm/utils/if';
import { PageLoader } from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';

import { useSummaryFilter } from '../../hooks/use-summary-filter';

import { OverviewChart } from './components/overview-chart';
import { TopTenExpenseAccounts } from './components/top-ten-expense-accounts';
import { TopTenExpenseCategories } from './components/top-ten-expense-categories';
import { TopTenIncomeAccounts } from './components/top-ten-income-accounts';
import { TopTenIncomeCategories } from './components/top-ten-income-categories';

const SummaryPage = () => {
  const { appliedFilters } = useSummaryFilter({ adapter: 'url' });

  const dateFilters = {
    from: dayjs(appliedFilters.dateFrom).toISOString(),
    to: dayjs(appliedFilters.dateTo).toISOString(),
  };

  const [summaryTotal, , { isLoading: isFetchingSummaryTotal }] = useApiSpenicleSummaryTotalQuery({
    ...dateFilters,
    categoryId: appliedFilters.categoryId,
    accountId: appliedFilters.accountId,
  });

  const [summaryTransactions, , { isLoading: isFetchingSummaryTransactions }] = useApiSpenicleSummaryTransactionsQuery({
    ...dateFilters,
    frequency: 'daily',
    categoryId: appliedFilters.categoryId,
    accountId: appliedFilters.accountId,
  });

  const [summaryExpenseCategories, , { isLoading: isFetchingSummaryExpenseCategories }] =
    useApiSpenicleSummaryCategoriesQuery({
      ...dateFilters,
      id: appliedFilters.categoryId,
      type: ['expense'],
    });

  const [summaryIncomeCategories, , { isLoading: isFetchingSummaryIncomeCategories }] =
    useApiSpenicleSummaryCategoriesQuery({
      ...dateFilters,
      id: appliedFilters.categoryId,
      type: ['income'],
    });

  const [summaryExpenseAccounts, , { isLoading: isFetchingSummaryExpenseAccounts }] =
    useApiSpenicleSummaryAccountsQuery({
      ...dateFilters,
      id: appliedFilters.accountId,
      type: 'expense',
    });

  const [summaryIncomeAccounts, , { isLoading: isFetchingSummaryIncomeAccounts }] = useApiSpenicleSummaryAccountsQuery({
    ...dateFilters,
    id: appliedFilters.accountId,
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
