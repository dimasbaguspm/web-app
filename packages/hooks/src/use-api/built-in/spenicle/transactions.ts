import {
  SearchTransactionsModel,
  TransactionsPageModel,
  TransactionModel,
  CreateTransactionModel,
  UpdateTransactionModel,
} from '@dimasbaguspm/interfaces';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '../../query-keys';
import { SPENICLE_URL } from '../../url';
import {
  useApiInfiniteQuery,
  UseApiInfiniteQueryOptions,
} from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiSpenicleTransactionsInfiniteQuery = (
  params: SearchTransactionsModel,
  options?: Partial<
    UseApiInfiniteQueryOptions<
      TransactionModel,
      SearchTransactionsModel,
      unknown
    >
  >,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_TRANSACTION_INFINITE(params),
    queryParams: params,
    path: SPENICLE_URL.TRANSACTION.PAGINATED,
  });
};

export const useApiSpenicleTransactionsPaginatedQuery = (
  params: SearchTransactionsModel,
  options?: Partial<
    UseApiQueryOptions<TransactionsPageModel, SearchTransactionsModel, unknown>
  >,
) => {
  return useApiQuery<TransactionsPageModel, SearchTransactionsModel>({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_TRANSACTION_PAGINATED(params),
    queryParams: params,
    path: SPENICLE_URL.TRANSACTION.PAGINATED,
  });
};

export const useApiSpenicleTransactionQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<TransactionModel, unknown, unknown>>,
) => {
  return useApiQuery<TransactionModel, unknown>({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_TRANSACTION_BY_ID(id),
    path: SPENICLE_URL.TRANSACTION.BY_ID(id),
  });
};

export const useApiSpenicleGetPaginatedTransactions = () => {
  return useApiMutate<TransactionsPageModel, SearchTransactionsModel>({
    path: '/transaction',
    method: 'GET',
    base: 'SPENICLE',
  });
};

export const useApiSpenicleCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useApiMutate<TransactionModel, CreateTransactionModel>({
    path: '/transaction',
    method: 'POST',
    base: 'SPENICLE',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_TRANSACTION_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_TRANSACTION_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_SUMMARY_TRANSACTIONS().slice(0, 2),
      });
      queryClient.setQueryData(
        QUERY_KEYS.SPENICLE_TRANSACTION_BY_ID(data.id),
        data,
      );
    },
  });
};

export const useApiSpenicleUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useApiMutate<TransactionModel, UpdateTransactionModel>({
    path: '/transaction/:id',
    method: 'PATCH',
    base: 'SPENICLE',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_TRANSACTION_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_TRANSACTION_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_SUMMARY_TRANSACTIONS().slice(0, 2),
      });
      queryClient.setQueryData(
        QUERY_KEYS.SPENICLE_TRANSACTION_BY_ID(data.id),
        data,
      );
    },
  });
};
