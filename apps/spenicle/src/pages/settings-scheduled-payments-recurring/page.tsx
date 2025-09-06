import { useApiSpenicleScheduledTransactionsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { ScheduledTransactionModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Hr, NoResults, PageLoader } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';

import { ScheduledTransactionCard } from '../../components/scheduled-transaction-card';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';

const SettingsScheduledPaymentRecurringPage = () => {
  const { openDrawer } = useDrawerRoute();
  const [scheduledTransactions, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiSpenicleScheduledTransactionsInfiniteQuery({
      isRecurring: true,
      sortBy: 'last_run_at',
    });

  const handleOnCardClick = (scheduledTransaction: ScheduledTransactionModel) => {
    openDrawer(DRAWER_ROUTES.DETAIL_SCHEDULED_PAYMENTS, {
      scheduledTransactionId: scheduledTransaction.id,
    });
  };

  return (
    <>
      <If condition={isInitialFetching}>
        <PageLoader />
      </If>
      <If condition={[!isInitialFetching, !scheduledTransactions.length]}>
        <NoResults
          icon={SearchXIcon}
          title="No Recurring Transactions"
          subtitle="You have no recurring transactions at the moment. Click the button below to create your first recurring transaction"
          action={
            <ButtonGroup alignment="center">
              <Button variant="outline">Set Up Recurring Transaction</Button>
            </ButtonGroup>
          }
        />
      </If>
      <If condition={[!isInitialFetching, scheduledTransactions.length]}>
        <ul>
          {scheduledTransactions.map((scheduledTransaction, index) => {
            const isLastItem = index === scheduledTransactions.length - 1;
            return (
              <li key={scheduledTransaction.id}>
                <ScheduledTransactionCard scheduledTransaction={scheduledTransaction} onClick={handleOnCardClick} />
                {!isLastItem && <Hr />}
              </li>
            );
          })}
        </ul>
        <If condition={hasNextPage}>
          <ButtonGroup alignment="center">
            <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
              Load More
            </Button>
          </ButtonGroup>
        </If>
      </If>
    </>
  );
};

export default SettingsScheduledPaymentRecurringPage;
