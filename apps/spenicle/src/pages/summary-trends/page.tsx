import { useApiSpenicleSummaryTransactionsQuery } from '@dimasbaguspm/hooks/use-api';
import { If } from '@dimasbaguspm/utils/if';
import { LoadingIndicator } from '@dimasbaguspm/versaur';

import { useSummaryFilter } from '../summary/hooks/use-summary-filter';

import { DateTransactionsAreaChart } from './components/date-transactions-area-chart';

const SummaryTrendsPage = () => {
  const { appliedFilters } = useSummaryFilter();

  const dateFilters = {
    from: appliedFilters.range.startDate.toISOString(),
    to: appliedFilters.range.endDate.toISOString(),
    categoryIds: appliedFilters.categoryIds,
    accountIds: appliedFilters.accountIds,
  };

  const [transactions, , { isFetching }] =
    useApiSpenicleSummaryTransactionsQuery({
      from: dateFilters.from,
      to: dateFilters.to,
      categoryId: appliedFilters.categoryIds,
      accountId: appliedFilters.accountIds,
      sortBy: 'date',
    });

  return (
    <>
      <If condition={isFetching}>
        <LoadingIndicator type="bar" size="sm" />
      </If>
      <If condition={[!isFetching, transactions?.length]}>
        <DateTransactionsAreaChart data={transactions!} />
      </If>
    </>
  );
};

export default SummaryTrendsPage;
