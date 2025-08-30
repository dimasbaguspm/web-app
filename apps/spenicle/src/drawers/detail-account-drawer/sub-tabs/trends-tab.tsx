import { useApiSpenicleSummaryTransactionsQuery } from '@dimasbaguspm/hooks/use-api';
import { AccountModel } from '@dimasbaguspm/interfaces';
import { If } from '@dimasbaguspm/utils/if';
import { LoadingIndicator } from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { FC } from 'react';

import { TrendsChart } from '../components/trends-chart';
import { TrendsStats } from '../components/trends-stats';

interface TrendsTabProps {
  data: AccountModel;
}

export const TrendsTab: FC<TrendsTabProps> = ({ data }) => {
  const [transactions, , { isFetching }] =
    useApiSpenicleSummaryTransactionsQuery({
      from: dayjs().startOf('year').add(1, 'day').toISOString(),
      to: dayjs().endOf('month').toISOString(),
      accountId: [data.id],
      sortBy: 'date',
      frequency: 'monthly',
    });

  return (
    <>
      <If condition={[isFetching]}>
        <LoadingIndicator type="bar" size="sm" />
      </If>

      <If condition={[!isFetching, !!transactions]}>
        <TrendsChart data={data} transactions={transactions!} />
        <TrendsStats data={data} transactions={transactions!} />
      </If>
    </>
  );
};
