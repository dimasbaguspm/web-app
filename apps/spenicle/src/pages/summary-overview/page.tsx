import {
  useApiSpenicleSummaryTotalQuery,
  useApiSpenicleSummaryTransactionsQuery,
} from '@dimasbaguspm/hooks/use-api';
import { If } from '@dimasbaguspm/utils/if';
import { LoadingIndicator } from '@dimasbaguspm/versaur';

import { useSummaryFilter } from '../summary/hooks/use-summary-filter';

import { HighestNetInADay } from './components/highest-net-in-a-day';
import { LargestSpendInADay } from './components/largest-spend-in-a-day';
import { MostActiveDay } from './components/most-active-day';
import { OverviewChart } from './components/overview-chart';

const SummaryPage = () => {
  const { appliedFilters } = useSummaryFilter();

  const dateFilters = {
    from: appliedFilters.range.startDate.toISOString(),
    to: appliedFilters.range.endDate.toISOString(),
  };

  const [summaryTotal, , { isFetching: isFetchingSummaryTotal }] =
    useApiSpenicleSummaryTotalQuery({
      ...dateFilters,
      categoryId: appliedFilters.categoryIds,
      accountId: appliedFilters.accountIds,
    });
  const [summaryTransactions, , { isFetching: isFetchingSummaryTransactions }] =
    useApiSpenicleSummaryTransactionsQuery({
      ...dateFilters,
      categoryId: appliedFilters.categoryIds,
      accountId: appliedFilters.accountIds,
    });

  const isLoading = isFetchingSummaryTotal || isFetchingSummaryTransactions;

  return (
    <>
      <If condition={isLoading}>
        <LoadingIndicator type="bar" size="sm" />
      </If>

      <If condition={!isLoading}>
        <div className="space-y-6">
          <OverviewChart data={summaryTotal!} />

          <div className="grid lg:grid-cols-3 gap-4">
            <LargestSpendInADay data={summaryTransactions!} />

            <MostActiveDay data={summaryTransactions!} />

            <HighestNetInADay data={summaryTransactions!} />
          </div>
        </div>
      </If>
    </>
  );
};

export default SummaryPage;
