import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { CategoryModel, TransactionModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, FormLayout, NoResults, PageLoader, SearchInput } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { TransactionCard } from '../../../components/transaction-card';
import { TransactionFiltersControl } from '../../../components/transaction-filter-control';
import { DRAWER_ROUTES } from '../../../constants/drawer-routes';
import { useTransactionData } from '../../../hooks/use-transaction-data';
import { useTransactionFilter } from '../../../hooks/use-transaction-filter';

interface HistoryTabProps {
  data: CategoryModel;
}

export const HistoryTab: FC<HistoryTabProps> = ({ data }) => {
  const { openDrawer } = useDrawerRoute();
  const [searchValue, setSearchValue] = useDebouncedState<string>({
    debounceTime: 1000,
  });
  const filters = useTransactionFilter({ adapter: 'state' });

  const {
    data: transactions,
    isInitialLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useTransactionData({
    categoryId: [data.id],
    search: searchValue,
    dateFrom: filters.appliedFilters.startDate,
    dateTo: filters.appliedFilters.endDate,
    type: filters.appliedFilters.type,
  });

  const handleOnTransactionClick = (transaction: TransactionModel) => {
    openDrawer(DRAWER_ROUTES.DETAIL_TRANSACTION, {
      transactionId: transaction.id,
    });
  };

  return (
    <>
      <FormLayout className="mb-4">
        <FormLayout.Column span={12}>
          <SearchInput onChange={(ev) => setSearchValue(ev.target.value)} placeholder="Search notes" />
        </FormLayout.Column>
        <FormLayout.Column span={12}>
          <TransactionFiltersControl config={filters} hideOtherFilters />
        </FormLayout.Column>
      </FormLayout>

      <If condition={[isInitialLoading]}>
        <PageLoader />
      </If>

      <If condition={[!isInitialLoading]}>
        <If condition={!transactions.length}>
          <NoResults icon={SearchXIcon} title="No history available" subtitle="Try adjusting your search criteria" />
        </If>
        <If condition={[transactions.length]}>
          <ul className="mb-4">
            {transactions.map(({ transaction, account, destinationAccount, category }) => (
              <li key={transaction.id} className="border-b border-border">
                <TransactionCard
                  transaction={transaction}
                  account={account}
                  destinationAccount={destinationAccount}
                  category={category}
                  onClick={handleOnTransactionClick}
                  hideCategorySubtitle
                  useDateTime
                />
              </li>
            ))}
          </ul>

          <If condition={hasNextPage}>
            <ButtonGroup alignment="center">
              <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                Load more
              </Button>
            </ButtonGroup>
          </If>
        </If>
      </If>
    </>
  );
};
