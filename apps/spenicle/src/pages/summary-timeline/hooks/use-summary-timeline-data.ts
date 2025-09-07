import {
  useApiSpenicleAccountsPaginatedQuery,
  useApiSpenicleCachedAccounts,
  useApiSpenicleCachedCategories,
  useApiSpenicleCategoriesPaginatedQuery,
  useApiSpenicleTransactionsInfiniteQuery,
} from '@dimasbaguspm/hooks/use-api';

import { useSummaryFilter } from '../../../hooks/use-summary-filter';

export const useSummaryTimelineData = () => {
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

  const cachedAccounts = useApiSpenicleCachedAccounts();
  const needToFetchAccounts = transactions
    .map((t) => t.accountId)
    .filter((id) => id && !cachedAccounts.some((ca) => ca.id === id));

  const cachedCategories = useApiSpenicleCachedCategories();
  const needToFetchCategories = transactions
    .map((t) => t.categoryId)
    .filter((id) => id && !cachedCategories.some((cc) => cc.id === id));

  useApiSpenicleAccountsPaginatedQuery(
    {
      id: needToFetchAccounts,
      pageSize: 15,
    },
    {
      enabled: Boolean(needToFetchAccounts.length),
    },
  );
  useApiSpenicleCategoriesPaginatedQuery(
    {
      id: needToFetchCategories,
      pageSize: 15,
    },
    {
      enabled: Boolean(needToFetchCategories.length),
    },
  );

  const data = (transactions || []).map((transaction) => {
    const account = cachedAccounts.find((a) => a.id === transaction.accountId)!;
    const category = cachedCategories.find((c) => c.id === transaction.categoryId)!;
    return {
      transaction,
      account,
      category,
    };
  });

  const isInitialLoading = isLoading && !isFetchingNextPage;

  return {
    data,
    isInitialLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  };
};
