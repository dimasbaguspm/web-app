/* eslint-disable import/max-dependencies */
import { TransactionModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  Icon,
  LoadingIndicator,
  PageContent,
  PageHeader,
} from '@dimasbaguspm/versaur';
import dayjs, { Dayjs } from 'dayjs';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { ActionsControl } from './components/actions-control';
import { FiltersControl } from './components/filters-control';
import { NoResults } from './components/no-results';
import { TabsDate } from './components/tabs-date';
import { TransactionCard } from './components/transaction-card';
import { useTransactionData } from './hooks/use-transactions-data';
import { useTransactionsFilter } from './hooks/use-transactions-filter';

const TransactionsPage = () => {
  const [activeDate, setActiveDate] = useState<Dayjs>(dayjs().startOf('day'));
  const [selectedDate, setSelectedDate] = useState<Dayjs>(activeDate);

  const { openDrawer } = useDrawerRoute();

  const { humanizedFilters } = useTransactionsFilter();
  const {
    isFetching,
    transactions,
    accounts,
    categories,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useTransactionData({ date: selectedDate });

  const handleOnDateChange = (date: Dayjs) => {
    setSelectedDate(date);
  };

  const handleOnNewTransactionClick = () => {
    openDrawer(DRAWER_ROUTES.NEW_TRANSACTION);
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
    setSelectedDate(date);
    setActiveDate(date);
  };

  return (
    <>
      <PageHeader
        title="Transactions"
        actions={
          <ButtonGroup>
            <Button onClick={handleOnNewTransactionClick}>
              <Icon as={PlusIcon} color="inherit" />
              New Transaction
            </Button>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon
              as={PlusIcon}
              aria-label="New Transaction"
              onClick={handleOnNewTransactionClick}
            />
          </ButtonGroup>
        }
        tabs={
          <TabsDate
            activeDate={activeDate}
            selectedDate={selectedDate}
            onDateChange={handleOnDateChange}
          />
        }
      />

      <PageContent>
        <ActionsControl
          date={selectedDate}
          onFilterClick={handleOnFilterClick}
          onDateChange={handleOnCalendarDateChange}
        />

        <If condition={[humanizedFilters.length]}>
          <FiltersControl />
        </If>

        <If condition={[isFetching]}>
          <LoadingIndicator size="sm" type="bar" />
        </If>

        <If condition={[!isFetching, transactions.length !== 0]}>
          <ul className="flex flex-col mb-4">
            {transactions.map((transaction) => {
              const account = accounts?.items.find(
                (acc) => acc.id === transaction.accountId,
              );
              const category = categories?.items.find(
                (cat) => cat.id === transaction.categoryId,
              );

              return (
                <li key={transaction.id} className="border-b border-border">
                  <TransactionCard
                    transaction={transaction}
                    account={account}
                    category={category}
                    onClick={handleOnTransactionClick}
                  />
                </li>
              );
            })}
          </ul>
          <If condition={[hasNextPage]}>
            <ButtonGroup alignment="center">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                Load More
              </Button>
            </ButtonGroup>
          </If>
        </If>

        <If condition={[!isFetching, transactions.length === 0]}>
          <NoResults onNewTransactionClick={handleOnNewTransactionClick} />
        </If>
      </PageContent>
    </>
  );
};

export default TransactionsPage;
