import { useApiSpenicleSummaryTransactionsQuery } from '@dimasbaguspm/hooks/use-api';
import { If } from '@dimasbaguspm/utils/if';
import { PageLoader } from '@dimasbaguspm/versaur';

import { useSummaryFilter } from '../../hooks/use-summary-filter';

import { AverageAmount } from './components/average-amount';
import { AverageLoggedTransaction } from './components/average-logged-transaction';
import { DateTransactionsAreaChart } from './components/date-transactions-area-chart';
import { GrowthRate } from './components/growth-rate';
import { HighestNet } from './components/highest-net';
import { HighestSpend } from './components/highest-spend-in-a-day';
import { TotalTransactions } from './components/total-transactions';

const SummaryTrendsPage = () => {
  const { appliedFilters } = useSummaryFilter();

  const dateFilters = {
    from: appliedFilters.dateFrom,
    to: appliedFilters.dateTo,
    categoryIds: appliedFilters.categoryIds,
    accountIds: appliedFilters.accountIds,
  };

  const [transactions, , { isLoading }] = useApiSpenicleSummaryTransactionsQuery({
    from: dateFilters.from,
    to: dateFilters.to,
    categoryId: appliedFilters.categoryId,
    accountId: appliedFilters.accountId,
    frequency: appliedFilters.frequency,
    sortBy: 'date',
  });

  return (
    <>
      <If condition={[isLoading, !transactions?.length]}>
        <PageLoader />
      </If>
      <If condition={[!isLoading, transactions?.length]}>
        <DateTransactionsAreaChart data={transactions!} />

        <div className="grid lg:grid-cols-3 gap-4">
          <GrowthRate data={transactions!} />
          <AverageAmount data={transactions!} />
          <AverageLoggedTransaction data={transactions!} />
          <HighestSpend data={transactions!} />
          <HighestNet data={transactions!} />
          <TotalTransactions data={transactions!} />
        </div>
      </If>
    </>
  );
};

export default SummaryTrendsPage;
