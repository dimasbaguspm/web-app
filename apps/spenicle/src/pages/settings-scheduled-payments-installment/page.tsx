import { useApiSpenicleScheduledTransactionsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { ScheduledTransactionModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Hr, NoResults, PageLoader } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';

import { ScheduledTransactionCard } from '../../components/scheduled-transaction-card';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';

const SettingsScheduledPaymentInstallmentPage = () => {
  const { openDrawer } = useDrawerRoute();
  const [scheduledTransactions, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiSpenicleScheduledTransactionsInfiniteQuery({
      isRecurring: false,
      sortBy: 'last_run_at',
    });

  const handleOnCardClick = (scheduledTransaction: ScheduledTransactionModel) => {
    openDrawer(DRAWER_ROUTES.DETAIL_SCHEDULED_PAYMENTS, {
      scheduledTransactionId: scheduledTransaction.id,
    });
  };

  const handleOnSetupInstallmentClick = () => {
    openDrawer(DRAWER_ROUTES.NEW_SCHEDULED_PAYMENTS);
  };

  return (
    <>
      <If condition={isInitialFetching}>
        <PageLoader />
      </If>
      <If condition={[!isInitialFetching, !scheduledTransactions.length]}>
        <NoResults
          icon={SearchXIcon}
          title="No Installments"
          subtitle="You have no installment at the moment. Click the button below to create your first installment"
          action={
            <ButtonGroup alignment="center">
              <Button variant="outline" onClick={handleOnSetupInstallmentClick}>
                Set Up Installment
              </Button>
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
                <ScheduledTransactionCard
                  scheduledTransaction={scheduledTransaction}
                  isInstallment
                  onClick={handleOnCardClick}
                />
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

export default SettingsScheduledPaymentInstallmentPage;
