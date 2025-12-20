import { useApiSpenicleTransactionsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { TransactionModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, PageContent, PageHeader, PageLayout, PageLoader } from '@dimasbaguspm/versaur';
import { Dayjs } from 'dayjs';
import { FC } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useSwipeable } from 'react-swipeable';

import { TransactionCard } from '../../components/transaction-card';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { DEEP_LINKS } from '../../constants/page-routes';
import { useTransactionFilter } from '../../hooks/use-transaction-filter';

import { ActionsControl } from './components/actions-control';
import { NoResults } from './components/no-results';
import { TabsDate } from './components/tabs-date';
import { DateGuard } from './guards/date-guard';

interface TransactionsPageProps {
  startDate: Dayjs;
}

const TransactionsPage: FC<TransactionsPageProps> = ({ startDate }) => {
  const { openDrawer } = useDrawerRoute();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { appliedFilters } = useTransactionFilter({ adapter: 'url' });

  const [transactions, , { hasNextPage, isLoading, isFetchingNextPage }, { fetchNextPage }] =
    useApiSpenicleTransactionsInfiniteQuery({
      accountId: appliedFilters?.accountId ? appliedFilters.accountId : [],
      categoryId: appliedFilters?.categoryId ? appliedFilters.categoryId : [],
      type: appliedFilters?.type ? appliedFilters.type : [],
      dateFrom: formatDate(startDate.startOf('day'), DateFormat.ISO_DATETIME),
      dateTo: formatDate(startDate.endOf('day'), DateFormat.ISO_DATETIME),
      pageSize: 15,
      sortBy: 'date',
    });

  // Helper function to navigate while preserving search params
  const navigateWithSearchParams = (path: string) => {
    const currentParams = searchParams.toString();
    const separator = currentParams ? '?' : '';
    navigate(`${path}${separator}${currentParams}`);
  };

  const handleOnDateChange = (date: Dayjs) => {
    navigateWithSearchParams(DEEP_LINKS.TRANSACTIONS_DATE.path(date.year(), date.month(), date.date()));
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
    navigateWithSearchParams(DEEP_LINKS.TRANSACTIONS_DATE.path(date.year(), date.month(), date.date()));
  };

  const containerHandlers = useSwipeable({
    onSwipedRight: () => {
      const previousDate = startDate.subtract(1, 'd');
      navigateWithSearchParams(
        DEEP_LINKS.TRANSACTIONS_DATE.path(previousDate.year(), previousDate.month(), previousDate.date()),
      );
    },
    onSwipedLeft: () => {
      const nextDate = startDate.add(1, 'd');
      navigateWithSearchParams(DEEP_LINKS.TRANSACTIONS_DATE.path(nextDate.year(), nextDate.month(), nextDate.date()));
    },
    trackMouse: false,
  });

  return (
    <PageLayout>
      <PageLayout.HeaderRegion>
        <PageHeader
          title="Transactions"
          size="wide"
          subtitle={formatDate(startDate, DateFormat.MONTH_YEAR)}
          tabs={<TabsDate date={startDate} onDateChange={handleOnDateChange} />}
        />
      </PageLayout.HeaderRegion>

      <PageLayout.ContentRegion>
        <PageContent {...containerHandlers} size="wide" className="min-h-[calc(100dvh-25dvh)]">
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
                return (
                  <li key={transaction.id} className="border-b border-border">
                    <TransactionCard transaction={transaction} onClick={handleOnTransactionClick} />
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
      </PageLayout.ContentRegion>
    </PageLayout>
  );
};

const TransactionsPageWrapper = () => {
  return <DateGuard>{(date) => <TransactionsPage startDate={date} />}</DateGuard>;
};

export default TransactionsPageWrapper;
