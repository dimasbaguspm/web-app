import {
  SearchAccountsModel,
  AccountsPageModel,
  AccountModel,
  CreateAccountModel,
  UpdateAccountModel,
} from '@dimasbaguspm/interfaces';
import { useQueryClient } from '@tanstack/react-query';
import { uniqBy } from 'lodash';

import { BASE_QUERY_KEYS } from '../../constants';
import { QUERY_KEYS } from '../../query-keys';
import { SPENICLE_URL } from '../../url';
import { useApiInfiniteQuery, UseApiInfiniteQueryOptions } from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiSpenicleAccountsInfiniteQuery = (
  params: SearchAccountsModel,
  options?: Partial<UseApiInfiniteQueryOptions<AccountModel, SearchAccountsModel, unknown>>,
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
  options?: Partial<UseApiQueryOptions<AccountsPageModel, SearchAccountsModel, unknown>>,
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
  const queryClient = useQueryClient();

  return useApiQuery<AccountModel, unknown>({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_BY_ID(id),
    path: SPENICLE_URL.ACCOUNT.BY_ID(id),
    initialData: () => {
      return queryClient
        .getQueryData<AccountsPageModel>(QUERY_KEYS.SPENICLE_ACCOUNT_PAGINATED().slice(0, 3))
        ?.items.find((account) => account.id === id);
    },
    initialDataUpdatedAt: queryClient.getQueryState(QUERY_KEYS.SPENICLE_ACCOUNT_PAGINATED().slice(0, 3))?.dataUpdatedAt,
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
        queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.SPENICLE_ACCOUNT_BY_ID(data.id), data);
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
        queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.SPENICLE_ACCOUNT_BY_ID(data.id), data);
    },
  });
};

export const useApiSpenicleDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useApiMutate<{ id: number }, unknown>({
    path: '/account/:id',
    method: 'DELETE',
    base: 'SPENICLE',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_INFINITE().slice(0, 3),
        exact: false,
      });
    },
  });
};

export const useApiSpenicleCachedAccounts = (): AccountModel[] => {
  const queryClient = useQueryClient();

  const cacheSingleQuery = queryClient.getQueriesData<AccountModel>({
    queryKey: [...BASE_QUERY_KEYS.SPENICLE_ACCOUNTS, 'by-id'],
    exact: false,
    type: 'all',
  });
  const cachePaginatedQuery = queryClient.getQueriesData<AccountsPageModel>({
    queryKey: [...BASE_QUERY_KEYS.SPENICLE_ACCOUNTS, 'paginated'],
    exact: false,
    type: 'all',
  });
  const cacheInfiniteQuery = queryClient.getQueriesData<AccountModel>({
    queryKey: [...BASE_QUERY_KEYS.SPENICLE_ACCOUNTS, 'infinite'],
    exact: false,
    type: 'all',
  });

  const cache: AccountModel[] = [
    ...cacheSingleQuery.map(([, account]) => account!),
    ...cachePaginatedQuery.flatMap(([, page]) => page?.items ?? []),
    ...cacheInfiniteQuery.map(([, account]) => account!),
  ];

  return uniqBy(cache, 'id').filter(Boolean);
};
