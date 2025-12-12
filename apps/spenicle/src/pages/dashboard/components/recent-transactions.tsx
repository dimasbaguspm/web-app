import { Button, ButtonGroup, Hr, Icon, NoResults } from '@dimasbaguspm/versaur';
import { ArrowRightIcon, SearchXIcon } from 'lucide-react';

import { TransactionCard } from '../../../components/transaction-card';

import type { TransactionModel } from '@dimasbaguspm/interfaces';

interface RecentTransactionsProps {
  transactions: TransactionModel[];
  onTransactionClick?: (transaction: TransactionModel) => void;
  onViewAll?: () => void;
}

export const RecentTransactions = ({ transactions, onTransactionClick, onViewAll }: RecentTransactionsProps) => {
  return (
    <div className="mt-4">
      {transactions.length > 0 ? (
        <>
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction.id}>
                <TransactionCard
                  transaction={transaction}
                  onClick={() => onTransactionClick?.(transaction)}
                  useDateTime
                />
                <Hr hasMargin />
              </li>
            ))}
          </ul>
          <ButtonGroup alignment="end">
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              More <Icon as={ArrowRightIcon} color="inherit" size="sm" />
            </Button>
          </ButtonGroup>
        </>
      ) : (
        <NoResults
          icon={SearchXIcon}
          title="No transactions yet"
          subtitle="Start tracking your finances"
          action={
            <Button variant="outline" onClick={onViewAll}>
              Start Tracking
            </Button>
          }
        />
      )}
    </div>
  );
};
