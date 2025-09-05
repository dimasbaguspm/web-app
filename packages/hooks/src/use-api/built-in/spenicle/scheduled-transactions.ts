import {
  SearchScheduledTransactionsModel,
  ScheduledTransactionsPageModel,
  ScheduledTransactionModel,
  CreateScheduledTransactionModel,
  UpdateScheduledTransactionModel,
} from '@dimasbaguspm/interfaces';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '../../query-keys';
import { SPENICLE_URL } from '../../url';
import { useApiInfiniteQuery, UseApiInfiniteQueryOptions } from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiSpenicleScheduledTransactionsInfiniteQuery = (
  params: SearchScheduledTransactionsModel,
  options?: Partial<UseApiInfiniteQueryOptions<ScheduledTransactionModel, SearchScheduledTransactionsModel, unknown>>,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_SCHEDULED_TRANSACTION_INFINITE(params),
    queryParams: params,
    path: SPENICLE_URL.SCHEDULED_TRANSACTION.PAGINATED,
  });
};

export const useApiSpenicleScheduledTransactionsPaginatedQuery = (
  params: SearchScheduledTransactionsModel,
  options?: Partial<UseApiQueryOptions<ScheduledTransactionsPageModel, SearchScheduledTransactionsModel, unknown>>,
) => {
  return useApiQuery<ScheduledTransactionsPageModel, SearchScheduledTransactionsModel>({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_SCHEDULED_TRANSACTION_PAGINATED(params),
    queryParams: params,
    path: SPENICLE_URL.SCHEDULED_TRANSACTION.PAGINATED,
  });
};

export const useApiSpenicleScheduledTransactionQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<ScheduledTransactionModel, unknown, unknown>>,
) => {
  return useApiQuery<ScheduledTransactionModel, unknown>({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_SCHEDULED_TRANSACTION_BY_ID(id),
    path: SPENICLE_URL.SCHEDULED_TRANSACTION.BY_ID(id),
  });
};

export const useApiSpenicleGetPaginatedScheduledTransactions = () => {
  return useApiMutate<ScheduledTransactionsPageModel, SearchScheduledTransactionsModel>({
    path: '/scheduled-transaction',
    method: 'GET',
    base: 'SPENICLE',
  });
};

export const useApiSpenicleCreateScheduledTransaction = () => {
  const queryClient = useQueryClient();
  return useApiMutate<ScheduledTransactionModel, CreateScheduledTransactionModel>({
    path: '/scheduled-transaction',
    method: 'POST',
    base: 'SPENICLE',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_SCHEDULED_TRANSACTION_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_SCHEDULED_TRANSACTION_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_TRANSACTION_INFINITE().slice(0, 3),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_TRANSACTION_PAGINATED().slice(0, 3),
      });
      queryClient.setQueryData(QUERY_KEYS.SPENICLE_SCHEDULED_TRANSACTION_BY_ID(data.id), data);
    },
  });
};

export const useApiSpenicleUpdateScheduledTransaction = () => {
  const queryClient = useQueryClient();
  return useApiMutate<ScheduledTransactionModel, UpdateScheduledTransactionModel>({
    path: '/scheduled-transaction/:id',
    method: 'PATCH',
    base: 'SPENICLE',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_SCHEDULED_TRANSACTION_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_SCHEDULED_TRANSACTION_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_TRANSACTION_INFINITE().slice(0, 3),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_TRANSACTION_PAGINATED().slice(0, 3),
      });
      queryClient.setQueryData(QUERY_KEYS.SPENICLE_SCHEDULED_TRANSACTION_BY_ID(data.id), data);
    },
  });
};

export const useApiSpenicleDeleteScheduledTransaction = () => {
  const queryClient = useQueryClient();
  return useApiMutate<unknown, { id: number }>({
    path: '/scheduled-transaction/:id',
    method: 'DELETE',
    base: 'SPENICLE',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_SCHEDULED_TRANSACTION_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_SCHEDULED_TRANSACTION_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_TRANSACTION_INFINITE().slice(0, 3),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_TRANSACTION_PAGINATED().slice(0, 3),
      });
    },
  });
};
