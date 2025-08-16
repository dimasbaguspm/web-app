import { QUERY_KEYS } from '../../query-keys';
import { SPENICLE_URL } from '../../url';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

import {
  SearchTransactionsModel,
  TransactionsPageModel,
  TransactionModel,
  CreateTransactionModel,
  UpdateTransactionModel,
} from './types';

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

export const useApiSpenicleCreateTransaction = () => {
  return useApiMutate<TransactionModel, CreateTransactionModel>({
    path: '/transaction',
    method: 'POST',
    base: 'SPENICLE',
  });
};

export const useApiSpenicleUpdateTransaction = () => {
  return useApiMutate<TransactionModel, UpdateTransactionModel>({
    path: '/transaction/:id',
    method: 'PATCH',
    base: 'SPENICLE',
  });
};
