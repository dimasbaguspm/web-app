import { SearchSummaryTransactionsModel, SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { FC } from 'react';

import { TrendsChart } from './presentation/trends-chart';
import { TrendsStats } from './presentation/trends-stats';

interface TransactionTrendsProps {
  metric: 'net' | 'income' | 'expense';
  frequency: NonNullable<SearchSummaryTransactionsModel['frequency']>;
  transactions: SummaryTransactionsModel;
  hideStats?: boolean;
}

export const TransactionTrends: FC<TransactionTrendsProps> = ({ transactions, metric, frequency, hideStats }) => {
  return (
    <>
      <TrendsChart transactions={transactions!} metric={metric} frequency={frequency} />
      {!hideStats && <TrendsStats transactions={transactions!} metric={metric} frequency={frequency} />}
    </>
  );
};
