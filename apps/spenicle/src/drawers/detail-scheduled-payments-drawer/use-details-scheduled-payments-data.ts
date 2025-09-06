import {
  useApiSpenicleAccountsPaginatedQuery,
  useApiSpenicleCachedAccounts,
  useApiSpenicleCachedCategories,
  useApiSpenicleCategoriesPaginatedQuery,
  useApiSpenicleScheduledTransactionQuery,
  useApiSpenicleScheduledTransactionQueuesInfiniteQuery,
} from '@dimasbaguspm/hooks/use-api';
import { TransactionModel } from '@dimasbaguspm/interfaces';

export const useDetailsScheduledPaymentsData = (scheduledTransactionId: number) => {
  const [scheduledTransaction, , { isLoading }] = useApiSpenicleScheduledTransactionQuery(scheduledTransactionId);
  const [queue, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiSpenicleScheduledTransactionQueuesInfiniteQuery(scheduledTransactionId, {
      pageSize: 15,
    });

  const transactions = queue?.map((data) => data.embedded?.transaction as TransactionModel) || [];

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

  return {
    scheduledTransaction,
    data,
    isLoading,
    isInitialFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  };
};
