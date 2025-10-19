import { SearchSummaryTransactionsModel, SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { FC } from 'react';

import { TrendsChart } from './presentation/trends-chart';
import { TrendsStats } from './presentation/trends-stats';

interface TransactionTrendsProps {
  metric: 'net' | 'income' | 'expense';
  frequency: NonNullable<SearchSummaryTransactionsModel['frequency']>;
  transactions: SummaryTransactionsModel;
}

export const TransactionTrends: FC<TransactionTrendsProps> = ({ transactions, metric, frequency }) => {
  return (
    <>
      <TrendsChart transactions={transactions!} metric={metric} frequency={frequency} />
      <TrendsStats transactions={transactions!} metric={metric} frequency={frequency} />
    </>
  );
};
