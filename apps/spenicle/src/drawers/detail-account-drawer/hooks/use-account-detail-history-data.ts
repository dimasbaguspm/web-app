import {
  useApiSpenicleAccountsPaginatedQuery,
  useApiSpenicleCachedAccounts,
  useApiSpenicleCachedCategories,
  useApiSpenicleCategoriesPaginatedQuery,
  useApiSpenicleTransactionsInfiniteQuery,
} from '@dimasbaguspm/hooks/use-api';
import { AccountModel } from '@dimasbaguspm/interfaces';

export const useAccountDetailHistoryData = (
  account: AccountModel,
  query: string,
) => {
  const [
    transactions,
    ,
    { hasNextPage, isFetching, isFetchingNextPage },
    { fetchNextPage },
  ] = useApiSpenicleTransactionsInfiniteQuery({
    search: query,
    accountId: [account.id],
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
    const category = cachedCategories.find(
      (c) => c.id === transaction.categoryId,
    )!;
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
