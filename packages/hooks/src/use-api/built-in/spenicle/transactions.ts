import { QUERY_KEYS } from '../../query-keys';
import { SPENICLE_URL } from '../../url';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery } from '../../use-api-query';

import {
  SearchTransactionsModel,
  TransactionsPageModel,
  TransactionModel,
  CreateTransactionModel,
  UpdateTransactionModel,
} from './types';

export const useApiSpenicleTransactionsPaginatedQuery = (
  params: SearchTransactionsModel,
) => {
  return useApiQuery<TransactionsPageModel, SearchTransactionsModel>({
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_TRANSACTION_PAGINATED(params),
    path: SPENICLE_URL.TRANSACTION.PAGINATED,
  });
};

export const useApiSpenicleTransactionQuery = (id: number) => {
  return useApiQuery<TransactionModel, unknown>({
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
