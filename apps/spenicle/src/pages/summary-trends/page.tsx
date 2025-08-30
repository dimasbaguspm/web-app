import { useApiSpenicleSummaryTransactionsQuery } from '@dimasbaguspm/hooks/use-api';
import { SearchSummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { If } from '@dimasbaguspm/utils/if';
import { LoadingIndicator } from '@dimasbaguspm/versaur';

import {
  SummaryFrequencyType,
  useSummaryFilter,
} from '../summary/hooks/use-summary-filter';

import { AverageLoggedTransaction } from './components/average-logged-transaction';
import { AverageTransactionValue } from './components/average-transaction-value';
import { DateTransactionsAreaChart } from './components/date-transactions-area-chart';
import { GrowthRate } from './components/growth-rate';
import { HighestNetInADay } from './components/highest-net-in-a-day';
import { HighestSpendInADay } from './components/highest-spend-in-a-day';
import { MostActiveDay } from './components/most-active-day';

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

  const [transactions, , { isFetching }] =
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
      <If condition={isFetching}>
        <LoadingIndicator type="bar" size="sm" />
      </If>
      <If condition={[!isFetching, transactions?.length]}>
        <DateTransactionsAreaChart data={transactions!} />

        <div className="grid lg:grid-cols-3 gap-4">
          <GrowthRate data={transactions!} />
          <AverageTransactionValue data={transactions!} />
          <AverageLoggedTransaction data={transactions!} />
          <HighestSpendInADay data={transactions!} />
          <HighestNetInADay data={transactions!} />
          <MostActiveDay data={transactions!} />
        </div>
      </If>
    </>
  );
};

export default SummaryTrendsPage;
