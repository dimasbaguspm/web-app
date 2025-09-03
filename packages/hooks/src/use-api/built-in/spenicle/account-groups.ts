import {
  SearchAccountGroupsModel,
  AccountGroupsPageModel,
  AccountGroupModel,
  CreateAccountGroupModel,
  UpdateAccountGroupModel,
} from '@dimasbaguspm/interfaces';
import { useQueryClient } from '@tanstack/react-query';
import { uniqBy } from 'lodash';

import { BASE_QUERY_KEYS } from '../../constants';
import { QUERY_KEYS } from '../../query-keys';
import { SPENICLE_URL } from '../../url';
import { useApiInfiniteQuery, UseApiInfiniteQueryOptions } from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiSpenicleAccountGroupsInfiniteQuery = (
  params: SearchAccountGroupsModel,
  options?: Partial<UseApiInfiniteQueryOptions<AccountGroupModel, SearchAccountGroupsModel, unknown>>,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS_INFINITE(params),
    queryParams: params,
    path: SPENICLE_URL.ACCOUNT_GROUP.PAGINATED,
  });
};

export const useApiSpenicleAccountGroupsPaginatedQuery = (
  params: SearchAccountGroupsModel,
  options?: Partial<UseApiQueryOptions<AccountGroupsPageModel, SearchAccountGroupsModel, unknown>>,
) => {
  return useApiQuery<AccountGroupsPageModel, SearchAccountGroupsModel>({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS_PAGINATED(params),
    queryParams: params,
    path: SPENICLE_URL.ACCOUNT_GROUP.PAGINATED,
  });
};

export const useApiSpenicleAccountGroupQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<AccountGroupModel, unknown, unknown>>,
) => {
  const queryClient = useQueryClient();

  return useApiQuery<AccountGroupModel, unknown>({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS_BY_ID(id),
    path: SPENICLE_URL.ACCOUNT_GROUP.BY_ID(id),
    initialData: () => {
      return queryClient
        .getQueryData<AccountGroupsPageModel>(QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS_PAGINATED().slice(0, 3))
        ?.items.find((accountGroup) => accountGroup.id === id);
    },
    initialDataUpdatedAt: queryClient.getQueryState(QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS_PAGINATED().slice(0, 3))
      ?.dataUpdatedAt,
  });
};

export const useApiSpenicleCreateAccountGroup = () => {
  const queryClient = useQueryClient();
  return useApiMutate<AccountGroupModel, CreateAccountGroupModel>({
    path: '/account-group',
    method: 'POST',
    base: 'SPENICLE',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS_BY_ID(data.id), data);
    },
  });
};

export const useApiSpenicleUpdateAccountGroup = () => {
  const queryClient = useQueryClient();
  return useApiMutate<AccountGroupModel, UpdateAccountGroupModel>({
    path: '/account-group/:id',
    method: 'PATCH',
    base: 'SPENICLE',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS_BY_ID(data.id), data);
    },
  });
};

export const useApiSpenicleDeleteAccountGroup = () => {
  const queryClient = useQueryClient();
  return useApiMutate<{ id: number }, unknown>({
    path: '/account-group/:id',
    method: 'DELETE',
    base: 'SPENICLE',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS_INFINITE().slice(0, 3),
        exact: false,
      });
    },
  });
};

export const useApiSpenicleCachedAccountGroups = (): AccountGroupModel[] => {
  const queryClient = useQueryClient();

  const cacheSingleQuery = queryClient.getQueriesData<AccountGroupModel>({
    queryKey: [...BASE_QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS, 'by-id'],
    exact: false,
    type: 'all',
  });
  const cachePaginatedQuery = queryClient.getQueriesData<AccountGroupsPageModel>({
    queryKey: [...BASE_QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS, 'paginated'],
    exact: false,
    type: 'all',
  });
  const cacheInfiniteQuery = queryClient.getQueriesData<AccountGroupModel>({
    queryKey: [...BASE_QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS, 'infinite'],
    exact: false,
    type: 'all',
  });

  const cache: AccountGroupModel[] = [
    ...cacheSingleQuery.map(([, account]) => account!),
    ...cachePaginatedQuery.flatMap(([, page]) => page?.items ?? []),
    ...cacheInfiniteQuery.map(([, account]) => account!),
  ];

  return uniqBy(cache, 'id').filter(Boolean);
};
