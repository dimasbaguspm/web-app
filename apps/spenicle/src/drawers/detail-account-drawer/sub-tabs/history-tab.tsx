import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { AccountModel, TransactionModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  ButtonMenuIcon,
  FormLayout,
  LoadingIndicator,
  NoResults,
  SearchInput,
} from '@dimasbaguspm/versaur';
import { FilterIcon, SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../../constants/drawer-routes';
import { HistoryTransactionCard } from '../components/history-transaction-card';
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
        <FormLayout.Column span={10}>
          <SearchInput onChange={(ev) => setSearchValue(ev.target.value)} placeholder="Search name or notes" />
        </FormLayout.Column>
        <FormLayout.Column span={2} className="flex items-end justify-end">
          <FormLayout.Column span={2} className="flex items-end justify-end">
            <ButtonMenuIcon as={FilterIcon} variant="outline" aria-label="Filter">
              <ButtonMenuIcon.Item>Sort by date</ButtonMenuIcon.Item>
              <ButtonMenuIcon.Item>Sort by amount</ButtonMenuIcon.Item>
            </ButtonMenuIcon>
          </FormLayout.Column>
        </FormLayout.Column>
      </FormLayout>

      <If condition={[isInitialLoading]}>
        <LoadingIndicator type="bar" size="sm" />
      </If>

      <If condition={[!isInitialLoading]}>
        <If condition={!transactions.length}>
          <NoResults icon={SearchXIcon} title="No history available" subtitle="Try adjusting your search criteria" />
        </If>
        <If condition={[transactions.length]}>
          <ul>
            {transactions.map(({ transaction, account, category }) => (
              <li key={transaction.id} className="border-b border-border">
                <HistoryTransactionCard
                  transaction={transaction}
                  account={account}
                  category={category}
                  onClick={handleOnTransactionClick}
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
