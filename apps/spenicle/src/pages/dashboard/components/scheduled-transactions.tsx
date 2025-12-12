import { ScheduledTransactionModel } from '@dimasbaguspm/interfaces';
import { Button, ButtonGroup, Hr, Icon, NoResults } from '@dimasbaguspm/versaur';
import { ArrowRightIcon, CalendarClockIcon } from 'lucide-react';

import { ScheduledTransactionCard } from '../../../components/scheduled-transaction-card';

interface ScheduledTransactionsProps {
  scheduledTransactions: ScheduledTransactionModel[];
  onScheduledTransactionClick?: (scheduledTransaction: ScheduledTransactionModel) => void;
  onViewAll?: () => void;
}

export const ScheduledTransactions = ({
  scheduledTransactions,
  onScheduledTransactionClick,
  onViewAll,
}: ScheduledTransactionsProps) => {
  return (
    <div className="mt-4">
      {scheduledTransactions.length > 0 ? (
        <>
          <ul className="mb-4">
            {scheduledTransactions.map((scheduledTransaction) => {
              return (
                <li key={scheduledTransaction.id}>
                  <ScheduledTransactionCard
                    scheduledTransaction={scheduledTransaction}
                    onClick={() => onScheduledTransactionClick?.(scheduledTransaction)}
                    size="sm"
                  />
                  <Hr />
                </li>
              );
            })}
          </ul>
          <ButtonGroup alignment="end">
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              Manage <Icon as={ArrowRightIcon} color="inherit" size="sm" />
            </Button>
          </ButtonGroup>
        </>
      ) : (
        <NoResults
          icon={CalendarClockIcon}
          title="No upcoming bills"
          subtitle="Scheduled items due soon will appear here"
          action={
            <Button variant="outline" onClick={onViewAll}>
              Manage Scheduled Transactions
            </Button>
          }
        />
      )}
    </div>
  );
};
