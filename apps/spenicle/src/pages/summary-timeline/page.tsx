import { useApiSpenicleTransactionsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { TransactionModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, NoResults, PageLoader } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';

import { TransactionCard } from '../../components/transaction-card';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { useSummaryFilter } from '../../hooks/use-summary-filter';

const SummaryTimeline = () => {
  const { openDrawer } = useDrawerRoute();

  const { appliedFilters } = useSummaryFilter();

  const dateFilters = {
    from: appliedFilters.dateFrom,
    to: appliedFilters.dateTo,
    categoryIds: appliedFilters.categoryIds,
    accountIds: appliedFilters.accountIds,
  };

  const [transactions, , { hasNextPage, isLoading, isFetchingNextPage }, { fetchNextPage }] =
    useApiSpenicleTransactionsInfiniteQuery({
      dateFrom: dateFilters.from,
      dateTo: dateFilters.to,
      categoryId: appliedFilters.categoryId,
      accountId: appliedFilters.accountId,
      pageSize: 15,
      sortBy: 'date',
    });

  const handleOnTransactionClick = (transaction: TransactionModel) => {
    openDrawer(DRAWER_ROUTES.DETAIL_TRANSACTION, {
      transactionId: transaction.id,
    });
  };

  return (
    <>
      <If condition={isLoading}>
        <PageLoader />
      </If>

      <If condition={[!isLoading, transactions.length]}>
        <ul className="mb-4">
          {transactions.map((transaction) => {
            return (
              <li key={transaction.id} className="border-b border-border">
                <TransactionCard transaction={transaction} onClick={handleOnTransactionClick} useDateTime />
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

      <If condition={[!isLoading, !transactions.length]}>
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
