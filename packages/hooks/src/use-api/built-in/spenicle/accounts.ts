import {
  SearchAccountsModel,
  AccountsPageModel,
  AccountModel,
  CreateAccountModel,
  UpdateAccountModel,
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

export const useApiSpenicleAccountsInfiniteQuery = (
  params: SearchAccountsModel,
  options?: Partial<
    UseApiInfiniteQueryOptions<AccountModel, SearchAccountsModel, unknown>
  >,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_INFINITE(params),
    queryParams: params,
    path: SPENICLE_URL.ACCOUNT.PAGINATED,
  });
};

export const useApiSpenicleAccountsPaginatedQuery = (
  params: SearchAccountsModel,
  options?: Partial<
    UseApiQueryOptions<AccountsPageModel, SearchAccountsModel, unknown>
  >,
) => {
  return useApiQuery<AccountsPageModel, SearchAccountsModel>({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_PAGINATED(params),
    queryParams: params,
    path: SPENICLE_URL.ACCOUNT.PAGINATED,
  });
};

export const useApiSpenicleAccountQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<AccountModel, unknown, unknown>>,
) => {
  return useApiQuery<AccountModel, unknown>({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_BY_ID(id),
    path: SPENICLE_URL.ACCOUNT.BY_ID(id),
  });
};

export const useApiSpenicleCreateAccount = () => {
  const queryClient = useQueryClient();
  return useApiMutate<AccountModel, CreateAccountModel>({
    path: '/account',
    method: 'POST',
    base: 'SPENICLE',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_PAGINATED(),
        exact: false,
      });
      queryClient.setQueryData(
        QUERY_KEYS.SPENICLE_ACCOUNT_BY_ID(data.id),
        data,
      );
    },
  });
};

export const useApiSpenicleUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useApiMutate<AccountModel, UpdateAccountModel>({
    path: '/account/:id',
    method: 'PATCH',
    base: 'SPENICLE',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_PAGINATED(),
        exact: false,
      });
      queryClient.setQueryData(
        QUERY_KEYS.SPENICLE_ACCOUNT_BY_ID(data.id),
        data,
      );
    },
  });
};
