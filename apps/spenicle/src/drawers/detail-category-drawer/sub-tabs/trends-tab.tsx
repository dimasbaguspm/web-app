import { useApiSpenicleSummaryTransactionsQuery } from '@dimasbaguspm/hooks/use-api';
import { CategoryModel } from '@dimasbaguspm/interfaces';
import { If } from '@dimasbaguspm/utils/if';
import { PageLoader } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { TransactionTrends } from '../../../components/transaction-trends';
import { TransactionTrendsFiltersControl } from '../../../components/transaction-trends-filter-control';
import { useTransactionTrendsFilter } from '../../../hooks/use-transaction-trends-filter';

interface TrendsTabProps {
  data: CategoryModel;
}

export const TrendsTab: FC<TrendsTabProps> = ({ data }) => {
  const filters = useTransactionTrendsFilter({ adapter: 'state' });

  const [transactions, , { isLoading }] = useApiSpenicleSummaryTransactionsQuery({
    categoryId: [data.id],
    from: filters.appliedFilters.startDate,
    to: filters.appliedFilters.endDate,
    frequency: filters.appliedFilters.frequency,
    sortBy: 'date',
  });

  return (
    <>
      <TransactionTrendsFiltersControl config={filters} />

      <If condition={[isLoading]}>
        <PageLoader />
      </If>

      <If condition={[!isLoading, !!transactions]}>
        <TransactionTrends
          transactions={transactions!}
          metric={filters.appliedFilters.metric}
          frequency={filters.appliedFilters.frequency}
        />
      </If>
    </>
  );
};
