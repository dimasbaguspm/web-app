import { SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { FC } from 'react';

import { TrendsChart } from './presentation/trends-chart';
import { TrendsStats } from './presentation/trends-stats';

interface TransactionTrendsProps {
  metric: 'net' | 'income' | 'expense';
  transactions: SummaryTransactionsModel;
}

export const TransactionTrends: FC<TransactionTrendsProps> = ({ transactions, metric }) => {
  return (
    <>
      <TrendsChart transactions={transactions!} metric={metric} />
      <TrendsStats transactions={transactions!} metric={metric} />
    </>
  );
};
