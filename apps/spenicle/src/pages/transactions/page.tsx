import { TransactionModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, ButtonIcon, Icon, PageContent, PageHeader, PageLoader } from '@dimasbaguspm/versaur';
import { Dayjs } from 'dayjs';
import { CalendarRangeIcon, PlusIcon } from 'lucide-react';
import { FC } from 'react';
import { useNavigate } from 'react-router';
import { useSwipeable } from 'react-swipeable';

import { TransactionCard } from '../../components/transaction-card';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { DEEP_LINKS } from '../../constants/page-routes';

import { ActionsControl } from './components/actions-control';
import { NoResults } from './components/no-results';
import { TabsDate } from './components/tabs-date';
import { DateGuard } from './guards/date-guard';
import { useTransactionData } from './hooks/use-transactions-data';

interface TransactionsPageProps {
  startDate: Dayjs;
}

const TransactionsPage: FC<TransactionsPageProps> = ({ startDate }) => {
  const { openDrawer } = useDrawerRoute();
  const navigate = useNavigate();

  const { isLoading, transactions, accounts, categories, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useTransactionData({ date: startDate });

  const handleOnDateChange = (date: Dayjs) => {
    navigate(DEEP_LINKS.TRANSACTIONS_DATE.path(date.year(), date.month(), date.date()));
  };

  const handleOnNewTransactionClick = () => {
    openDrawer(DRAWER_ROUTES.NEW_TRANSACTION, undefined, {
      state: {
        payload: {
          date: formatDate(startDate, DateFormat.ISO_DATE),
          time: formatDate(startDate, DateFormat.TIME_24H),
        },
      },
    });
  };

  const handleOnTransactionClick = (transaction: TransactionModel) => {
    openDrawer(DRAWER_ROUTES.DETAIL_TRANSACTION, {
      transactionId: transaction.id,
    });
  };

  const handleOnFilterClick = () => {
    openDrawer(DRAWER_ROUTES.FILTER_TRANSACTION);
  };

  const handleOnCalendarDateChange = (date: Dayjs) => {
    navigate(DEEP_LINKS.TRANSACTIONS_DATE.path(date.year(), date.month(), date.date()));
  };

  const handleOnScheduledPaymentsClick = () => {
    navigate(DEEP_LINKS.SETTINGS_SCHEDULED_PAYMENTS.path);
  };

  const containerHandlers = useSwipeable({
    onSwipedRight: () => {
      const previousDate = startDate.subtract(1, 'd');
      navigate(DEEP_LINKS.TRANSACTIONS_DATE.path(previousDate.year(), previousDate.month(), previousDate.date()));
    },
    onSwipedLeft: () => {
      const nextDate = startDate.add(1, 'd');
      navigate(DEEP_LINKS.TRANSACTIONS_DATE.path(nextDate.year(), nextDate.month(), nextDate.date()));
    },
    trackMouse: false,
  });

  return (
    <>
      <PageHeader
        title="Transactions"
        subtitle={formatDate(startDate, DateFormat.MONTH_YEAR)}
        actions={
          <ButtonGroup>
            <Button variant="outline" onClick={handleOnScheduledPaymentsClick}>
              <Icon as={CalendarRangeIcon} color="inherit" size="sm" />
              Scheduled Payments
            </Button>
            <Button onClick={handleOnNewTransactionClick}>
              <Icon as={PlusIcon} color="inherit" size="sm" />
              New Transaction
            </Button>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon
              as={CalendarRangeIcon}
              aria-label="Refresh"
              variant="outline"
              onClick={handleOnScheduledPaymentsClick}
            />
            <ButtonIcon as={PlusIcon} aria-label="New Transaction" onClick={handleOnNewTransactionClick} />
          </ButtonGroup>
        }
        tabs={<TabsDate date={startDate} onDateChange={handleOnDateChange} />}
      />

      <PageContent {...containerHandlers} className="min-h-[calc(100dvh-25dvh)]">
        <ActionsControl
          date={startDate}
          onFilterClick={handleOnFilterClick}
          onDateChange={handleOnCalendarDateChange}
        />

        <If condition={[isLoading]}>
          <PageLoader />
        </If>

        <If condition={[!isLoading, transactions.length !== 0]}>
          <ul className="flex flex-col mb-4">
            {transactions.map((transaction) => {
              const account = accounts?.items.find((acc) => acc.id === transaction.accountId);
              const destinationAccount = accounts?.items.find((acc) => acc.id === transaction.destinationAccountId);
              const category = categories?.items.find((cat) => cat.id === transaction.categoryId);

              return (
                <li key={transaction.id} className="border-b border-border">
                  <TransactionCard
                    transaction={transaction}
                    account={account}
                    destinationAccount={destinationAccount}
                    category={category}
                    onClick={handleOnTransactionClick}
                  />
                </li>
              );
            })}
          </ul>
          <If condition={[hasNextPage]}>
            <ButtonGroup alignment="center">
              <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                Load More
              </Button>
            </ButtonGroup>
          </If>
        </If>

        <If condition={[!isLoading, transactions.length === 0]}>
          <NoResults onNewTransactionClick={handleOnNewTransactionClick} />
        </If>
      </PageContent>
    </>
  );
};

const TransactionsPageWrapper = () => {
  return <DateGuard>{(date) => <TransactionsPage startDate={date} />}</DateGuard>;
};

export default TransactionsPageWrapper;
