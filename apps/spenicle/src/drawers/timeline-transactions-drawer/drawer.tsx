import { useApiSpenicleTransactionsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { TransactionModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, Hr, NoResults, PageLoader } from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { TransactionCard } from '../../components/transaction-card';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';

interface TimelineTransactionsDrawerProps {
  startDate: string;
  endDate: string;
}

export const TimelineTransactionsDrawer: FC<TimelineTransactionsDrawerProps> = ({ startDate, endDate }) => {
  const { openDrawer } = useDrawerRoute();

  const [transactions, , { isInitialFetching, hasNextPage, isFetchingNextPage }, { fetchNextPage }] =
    useApiSpenicleTransactionsInfiniteQuery({
      dateFrom: dayjs(startDate).startOf('day').toISOString(),
      dateTo: dayjs(endDate).endOf('day').toISOString(),
      pageSize: 25,
    });

  const handleOnTransactionClick = (transaction: TransactionModel) => {
    openDrawer(DRAWER_ROUTES.DETAIL_TRANSACTION, {
      transactionId: transaction.id,
    });
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>
          Transactions from {formatDate(startDate, DateFormat.DAY_MONTH_YEAR)} to{' '}
          {formatDate(endDate, DateFormat.DAY_MONTH_YEAR)}
        </Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <If condition={isInitialFetching}>
          <PageLoader />
        </If>
        <If condition={!isInitialFetching}>
          <If condition={!transactions}>
            <NoResults
              icon={SearchXIcon}
              title="No Transactions Found"
              subtitle="There are no transactions in this timeline."
            />
          </If>
          <If condition={!!transactions}>
            <ul className="mb-4">
              {transactions.map((transaction, index) => {
                const isLastItem = index === transactions.length - 1;

                return (
                  <li key={transaction.id}>
                    <TransactionCard
                      transaction={transaction}
                      onClick={() => handleOnTransactionClick(transaction)}
                      useDateTime
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
        </If>
      </Drawer.Body>
    </>
  );
};
