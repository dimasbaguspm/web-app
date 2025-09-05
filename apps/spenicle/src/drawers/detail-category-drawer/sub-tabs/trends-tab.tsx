import { useApiSpenicleSummaryTransactionsQuery } from '@dimasbaguspm/hooks/use-api';
import { CategoryModel } from '@dimasbaguspm/interfaces';
import { If } from '@dimasbaguspm/utils/if';
import { PageLoader } from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { FC } from 'react';

import { TrendsChart } from '../components/trends-chart';
import { TrendsStats } from '../components/trends-stats';

interface TrendsTabProps {
  data: CategoryModel;
}

export const TrendsTab: FC<TrendsTabProps> = ({ data }) => {
  const [transactions, , { isLoading }] = useApiSpenicleSummaryTransactionsQuery({
    from: dayjs().startOf('year').add(1, 'day').toISOString(),
    to: dayjs().endOf('month').toISOString(),
    categoryId: [data.id],
    sortBy: 'date',
    frequency: 'monthly',
  });

  return (
    <>
      <If condition={[isLoading]}>
        <PageLoader />
      </If>

      <If condition={[!isLoading, !!transactions]}>
        <TrendsChart data={data} transactions={transactions!} />
        <TrendsStats data={data} transactions={transactions!} />
      </If>
    </>
  );
};
