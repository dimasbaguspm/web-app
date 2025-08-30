import { useApiSpenicleSummaryTransactionsQuery } from '@dimasbaguspm/hooks/use-api';
import { SearchSummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { If } from '@dimasbaguspm/utils/if';
import { LoadingIndicator } from '@dimasbaguspm/versaur';

import {
  SummaryFrequencyType,
  useSummaryFilter,
} from '../summary/hooks/use-summary-filter';

import { AverageAmount } from './components/average-amount';
import { AverageLoggedTransaction } from './components/average-logged-transaction';
import { DateTransactionsAreaChart } from './components/date-transactions-area-chart';
import { GrowthRate } from './components/growth-rate';
import { HighestNet } from './components/highest-net';
import { HighestSpend } from './components/highest-spend-in-a-day';
import { TotalTransactions } from './components/total-transactions';

const SummaryTrendsPage = () => {
  const { appliedFilters, frequency } = useSummaryFilter();

  const dateFilters = {
    from: appliedFilters.range.startDate.toISOString(),
    to: appliedFilters.range.endDate.toISOString(),
    categoryIds: appliedFilters.categoryIds,
    accountIds: appliedFilters.accountIds,
  };

  const frequencyFilter = ((): SearchSummaryTransactionsModel['frequency'] => {
    switch (frequency) {
      case SummaryFrequencyType.thisYear:
        return 'monthly';
      case SummaryFrequencyType.allTheTime:
        return 'yearly';
      default:
        return 'daily';
    }
  })();

  const [transactions, , { isLoading }] =
    useApiSpenicleSummaryTransactionsQuery({
      from: dateFilters.from,
      to: dateFilters.to,
      categoryId: appliedFilters.categoryIds,
      accountId: appliedFilters.accountIds,
      frequency: frequencyFilter,
      sortBy: 'date',
    });

  return (
    <>
      <If condition={[isLoading, !transactions?.length]}>
        <LoadingIndicator type="bar" size="sm" />
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
