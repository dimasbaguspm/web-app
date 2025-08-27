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
import { useSummaryFilter } from './hooks/use-summary-filter';

const SummaryPage = () => {
  const { appliedFilters } = useSummaryFilter();

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
  const [summaryCategories, , { isFetching: isFetchingSummaryCategories }] =
    useApiSpenicleSummaryCategoriesQuery({ ...dateFilters, sortOrder: 'desc' });
  const [summaryAccounts, , { isFetching: isFetchingSummaryAccounts }] =
    useApiSpenicleSummaryAccountsQuery({ ...dateFilters, sortOrder: 'desc' });

  const isLoading =
    isFetchingSummaryTotal ||
    isFetchingSummaryCategories ||
    isFetchingSummaryAccounts;

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
                data={summaryCategories!}
                order={categoryExpenseSortOrder}
                onReorderClick={() => {
                  setCategoryExpenseSortOrder((prev) =>
                    prev === 'desc' ? 'asc' : 'desc',
                  );
                }}
              />
              <CategoriesIncomeChart
                data={summaryCategories!}
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
                data={summaryAccounts!}
                order={accountExpenseSortOrder}
                onReorderClick={() => {
                  setAccountExpenseSortOrder((prev) =>
                    prev === 'desc' ? 'asc' : 'desc',
                  );
                }}
              />
              <AccountsIncomeChart
                data={summaryAccounts!}
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
