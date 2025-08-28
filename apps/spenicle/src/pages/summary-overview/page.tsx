import {
  useApiSpenicleSummaryAccountsQuery,
  useApiSpenicleSummaryCategoriesQuery,
  useApiSpenicleSummaryTotalQuery,
} from '@dimasbaguspm/hooks/use-api';
import { If } from '@dimasbaguspm/utils/if';
import { LoadingIndicator, PageContent } from '@dimasbaguspm/versaur';

import { AccountsExpenseChart } from './components/accounts-expense-chart';
import { AccountsIncomeChart } from './components/accounts-income-chart';
import { ActionControl } from './components/action-control';
import { CategoriesExpenseChart } from './components/categories-expense-chart';
import { CategoriesIncomeChart } from './components/categories-income-chart';
import { FilterControl } from './components/filter-control';
import { OverviewChart } from './components/overview-chart';
import { useSortOrder } from './hooks/use-sort-order';
import { useSummaryOverviewFilter } from './hooks/use-summary-overview-filter';

const SummaryPage = () => {
  const { appliedFilters } = useSummaryOverviewFilter();

  const [categoryExpenseSortOrder, setCategoryExpenseSortOrder] =
    useSortOrder();
  const [categoryIncomeSortOrder, setCategoryIncomeSortOrder] = useSortOrder();
  const [accountExpenseSortOrder, setAccountExpenseSortOrder] = useSortOrder();
  const [accountIncomeSortOrder, setAccountIncomeSortOrder] = useSortOrder();

  const dateFilters = {
    from: appliedFilters.range.startDate.toISOString(),
    to: appliedFilters.range.endDate.toISOString(),
  };

  const [summaryTotal, , { isFetching: isFetchingSummaryTotal }] =
    useApiSpenicleSummaryTotalQuery(dateFilters);
  const [
    summaryExpenseCategories,
    ,
    { isFetching: isFetchingSummaryExpenseCategories },
  ] = useApiSpenicleSummaryCategoriesQuery({
    ...dateFilters,
    sortOrder: 'desc',
    type: ['expense'],
  });
  const [
    summaryIncomeCategories,
    ,
    { isFetching: isFetchingSummaryIncomeCategories },
  ] = useApiSpenicleSummaryCategoriesQuery({
    ...dateFilters,
    sortOrder: 'desc',
    type: ['income'],
  });

  const [
    summaryExpenseAccounts,
    ,
    { isFetching: isFetchingSummaryExpenseAccounts },
  ] = useApiSpenicleSummaryAccountsQuery({
    ...dateFilters,
    sortOrder: 'desc',
    type: 'expense',
  });
  const [
    summaryIncomeAccounts,
    ,
    { isFetching: isFetchingSummaryIncomeAccounts },
  ] = useApiSpenicleSummaryAccountsQuery({
    ...dateFilters,
    sortOrder: 'desc',
    type: 'income',
  });

  const isLoading =
    isFetchingSummaryTotal ||
    isFetchingSummaryExpenseCategories ||
    isFetchingSummaryIncomeCategories ||
    isFetchingSummaryExpenseAccounts ||
    isFetchingSummaryIncomeAccounts;

  return (
    <>
      <PageContent>
        <ActionControl />
        <FilterControl />

        <If condition={isLoading}>
          <LoadingIndicator type="bar" size="sm" />
        </If>

        <If condition={!isLoading}>
          <div className="space-y-6">
            <OverviewChart data={summaryTotal!} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CategoriesExpenseChart
                data={summaryExpenseCategories!}
                order={categoryExpenseSortOrder}
                onReorderClick={() => {
                  setCategoryExpenseSortOrder((prev) =>
                    prev === 'desc' ? 'asc' : 'desc',
                  );
                }}
              />
              <CategoriesIncomeChart
                data={summaryIncomeCategories!}
                order={categoryIncomeSortOrder}
                onReorderClick={() => {
                  setCategoryIncomeSortOrder((prev) =>
                    prev === 'desc' ? 'asc' : 'desc',
                  );
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AccountsExpenseChart
                data={summaryExpenseAccounts!}
                order={accountExpenseSortOrder}
                onReorderClick={() => {
                  setAccountExpenseSortOrder((prev) =>
                    prev === 'desc' ? 'asc' : 'desc',
                  );
                }}
              />
              <AccountsIncomeChart
                data={summaryIncomeAccounts!}
                order={accountIncomeSortOrder}
                onReorderClick={() => {
                  setAccountIncomeSortOrder((prev) =>
                    prev === 'desc' ? 'asc' : 'desc',
                  );
                }}
              />
            </div>
          </div>
        </If>
      </PageContent>
    </>
  );
};

export default SummaryPage;
