import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { AccountModel, TransactionModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  ButtonMenu,
  FormLayout,
  Icon,
  NoResults,
  PageLoader,
  SearchInput,
} from '@dimasbaguspm/versaur';
import { FilterIcon, SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { TransactionCard } from '../../../components/transaction-card';
import { DRAWER_ROUTES } from '../../../constants/drawer-routes';
import { useAccountDetailHistoryData } from '../hooks/use-account-detail-history-data';

interface HistoryTabProps {
  data: AccountModel;
}

export const HistoryTab: FC<HistoryTabProps> = ({ data }) => {
  const { openDrawer } = useDrawerRoute();
  const [searchValue, setSearchValue] = useDebouncedState<string>({
    debounceTime: 1000,
  });

  const {
    data: transactions,
    isInitialLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useAccountDetailHistoryData(data, searchValue);

  const handleOnTransactionClick = (transaction: TransactionModel) => {
    openDrawer(DRAWER_ROUTES.DETAIL_TRANSACTION, {
      transactionId: transaction.id,
    });
  };

  return (
    <>
      <FormLayout className="mb-4">
        <FormLayout.Column span={12}>
          <SearchInput onChange={(ev) => setSearchValue(ev.target.value)} placeholder="Search name or notes" />
        </FormLayout.Column>
        <FormLayout.Column span={12}>
          <ButtonGroup>
            <ButtonMenu
              label={
                <>
                  <Icon as={FilterIcon} size="sm" color="inherit" />
                  Filter
                </>
              }
              variant="outline"
              aria-label="Filter"
            >
              <ButtonMenu.Item>Sort by date</ButtonMenu.Item>
              <ButtonMenu.Item>Sort by amount</ButtonMenu.Item>
            </ButtonMenu>
          </ButtonGroup>
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
          <ul>
            {transactions.map(({ transaction, account, category }) => (
              <li key={transaction.id} className="border-b border-border">
                <TransactionCard
                  transaction={transaction}
                  account={account}
                  category={category}
                  onClick={handleOnTransactionClick}
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
