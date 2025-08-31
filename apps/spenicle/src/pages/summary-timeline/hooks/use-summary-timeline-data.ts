import {
  useApiSpenicleAccountsPaginatedQuery,
  useApiSpenicleCachedAccounts,
  useApiSpenicleCachedCategories,
  useApiSpenicleCategoriesPaginatedQuery,
  useApiSpenicleTransactionsInfiniteQuery,
} from '@dimasbaguspm/hooks/use-api';

import { useSummaryFilter } from '../../summary/hooks/use-summary-filter';

export const useSummaryTimelineData = () => {
  const { appliedFilters } = useSummaryFilter();

  const dateFilters = {
    from: appliedFilters.range.startDate.toISOString(),
    to: appliedFilters.range.endDate.toISOString(),
    categoryIds: appliedFilters.categoryIds,
    accountIds: appliedFilters.accountIds,
  };

  const [transactions, , { hasNextPage, isFetching, isFetchingNextPage }, { fetchNextPage }] =
    useApiSpenicleTransactionsInfiniteQuery({
      dateFrom: dateFilters.from,
      dateTo: dateFilters.to,
      categoryId: appliedFilters.categoryIds,
      accountId: appliedFilters.accountIds,
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

  const isInitialLoading = isFetching && !isFetchingNextPage;

  return {
    data,
    isInitialLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  };
};
