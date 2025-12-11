import { Button, Hr } from '@dimasbaguspm/versaur';
import { ArrowRightIcon } from 'lucide-react';

import { TransactionCard } from '../../../components/transaction-card';

import type { TransactionModel } from '@dimasbaguspm/interfaces';

interface RecentTransactionsProps {
  transactions: TransactionModel[];
  onTransactionClick?: (transaction: TransactionModel) => void;
  onViewAll?: () => void;
}

export const RecentTransactions = ({ transactions, onTransactionClick, onViewAll }: RecentTransactionsProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-foreground">Recent Transactions</h2>

        <Button variant="ghost" size="sm" onClick={onViewAll}>
          More <ArrowRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Recent Transaction Items using TransactionCard */}
      <ul className="space-y-3">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <li key={transaction.id}>
              <TransactionCard
                transaction={transaction}
                category={undefined}
                account={undefined}
                onClick={() => onTransactionClick?.(transaction)}
              />
              <Hr hasMargin />
            </li>
          ))
        ) : (
          <div className="bg-background rounded-2xl p-8 shadow-md text-center border border-border">
            <p className="text-foreground-light">No transactions yet</p>
            <p className="text-sm text-foreground-light opacity-60 mt-1">Start tracking your finances</p>
          </div>
        )}
      </ul>
    </div>
  );
};
