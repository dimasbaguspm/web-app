import { TransactionModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  LoadingIndicator,
  NoResults,
} from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { SummaryTimelineCard } from './components/card';
import { useSummaryTimelineData } from './hooks/use-summary-timeline-data';

const SummaryTimeline = () => {
  const {
    data,
    isInitialLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSummaryTimelineData();
  const { openDrawer } = useDrawerRoute();

  const handleOnTransactionClick = (transaction: TransactionModel) => {
    openDrawer(DRAWER_ROUTES.DETAIL_TRANSACTION, {
      transactionId: transaction.id,
    });
  };

  return (
    <>
      <If condition={isInitialLoading}>
        <LoadingIndicator type="bar" size="sm" />
      </If>

      <If condition={[!isInitialLoading, data.length]}>
        <ul className="mb-4">
          {data.map(({ transaction, account, category }) => {
            return (
              <li key={transaction.id} className="border-b border-border">
                <SummaryTimelineCard
                  transaction={transaction}
                  category={category}
                  account={account}
                  onClick={handleOnTransactionClick}
                />
              </li>
            );
          })}
        </ul>

        <If condition={hasNextPage}>
          <ButtonGroup alignment="center" onClick={() => fetchNextPage()}>
            <Button variant="outline" disabled={isFetchingNextPage}>
              Load More
            </Button>
          </ButtonGroup>
        </If>
      </If>

      <If condition={[!isInitialLoading, !data.length]}>
        <NoResults
          icon={SearchXIcon}
          title="No transactions found"
          subtitle="Try adjusting your filters to find what you're looking for"
        />
      </If>
    </>
  );
};

export default SummaryTimeline;
