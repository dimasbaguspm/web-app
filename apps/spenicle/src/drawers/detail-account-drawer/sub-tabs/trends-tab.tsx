import { useApiSpenicleSummaryTransactionsQuery } from '@dimasbaguspm/hooks/use-api';
import { AccountModel } from '@dimasbaguspm/interfaces';
import { If } from '@dimasbaguspm/utils/if';
import { PageLoader } from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { FC } from 'react';

import { TransactionTrends } from '../../../components/transaction-trends';
import { TransactionTrendsFiltersControl } from '../../../components/transaction-trends-filter-control';
import { useTransactionTrendsFilter } from '../../../hooks/use-transaction-trends-filter';

interface TrendsTabProps {
  data: AccountModel;
}

export const TrendsTab: FC<TrendsTabProps> = ({ data }) => {
  const filters = useTransactionTrendsFilter({ adapter: 'state' });

  const [transactions, , { isLoading }] = useApiSpenicleSummaryTransactionsQuery({
    from: dayjs().startOf('year').add(1, 'day').toISOString(),
    to: dayjs().endOf('month').toISOString(),
    accountId: [data.id],
    sortBy: 'date',
    frequency: 'monthly',
  });

  return (
    <>
      <If condition={[isLoading]}>
        <PageLoader />
      </If>

      <If condition={[!isLoading, !!transactions]}>
        <TransactionTrendsFiltersControl config={filters} />
        <TransactionTrends transactions={transactions!} metric={filters.appliedFilters.metric} />
      </If>
    </>
  );
};
