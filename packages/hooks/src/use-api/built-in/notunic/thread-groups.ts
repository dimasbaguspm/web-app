import {
  SearchThreadGroupsModel,
  ThreadGroupsPageModel,
  ThreadGroupModel,
  CreateThreadGroupModel,
  UpdateThreadGroupModel,
} from '@dimasbaguspm/interfaces/notunic-api';
import { useQueryClient } from '@tanstack/react-query';
import { uniqBy } from 'lodash';

import { BASE_QUERY_KEYS } from '../../constants';
import { QUERY_KEYS } from '../../query-keys';
import { NOTUNIC_URL } from '../../url';
import { useApiInfiniteQuery, UseApiInfiniteQueryOptions } from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiNotunicThreadGroupsInfiniteQuery = (
  params: SearchThreadGroupsModel,
  options?: Partial<UseApiInfiniteQueryOptions<ThreadGroupModel, SearchThreadGroupsModel, unknown>>,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_THREAD_GROUPS_INFINITE(params),
    queryParams: params,
    path: NOTUNIC_URL.THREAD_GROUPS.PAGINATED,
  });
};

export const useApiNotunicThreadGroupsPaginatedQuery = (
  params: SearchThreadGroupsModel,
  options?: Partial<UseApiQueryOptions<ThreadGroupsPageModel, SearchThreadGroupsModel, unknown>>,
) => {
  return useApiQuery<ThreadGroupsPageModel, SearchThreadGroupsModel>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_THREAD_GROUPS_PAGINATED(params),
    queryParams: params,
    path: NOTUNIC_URL.THREAD_GROUPS.PAGINATED,
  });
};

export const useApiNotunicThreadGroupQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<ThreadGroupModel, unknown, unknown>>,
) => {
  const queryClient = useQueryClient();

  return useApiQuery<ThreadGroupModel, unknown>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_THREAD_GROUPS_BY_ID(id),
    path: NOTUNIC_URL.THREAD_GROUPS.BY_ID(id),
    initialData: () => {
      return queryClient
        .getQueryData<ThreadGroupsPageModel>(QUERY_KEYS.NOTUNIC_THREAD_GROUPS_PAGINATED().slice(0, 3))
        ?.items.find((tg) => tg.id === id);
    },
    initialDataUpdatedAt: queryClient.getQueryState(QUERY_KEYS.NOTUNIC_THREAD_GROUPS_PAGINATED().slice(0, 3))
      ?.dataUpdatedAt,
  });
};

export const useApiNotunicCreateThreadGroup = () => {
  const queryClient = useQueryClient();
  return useApiMutate<ThreadGroupModel, CreateThreadGroupModel>({
    path: '/thread-group',
    method: 'POST',
    base: 'NOTUNIC',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREAD_GROUPS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREAD_GROUPS_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREADS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREADS_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.NOTUNIC_THREAD_GROUPS_BY_ID(data.id), data);
    },
  });
};

export const useApiNotunicUpdateThreadGroup = () => {
  const queryClient = useQueryClient();
  return useApiMutate<ThreadGroupModel, UpdateThreadGroupModel>({
    path: '/thread-group/:id',
    method: 'PATCH',
    base: 'NOTUNIC',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREAD_GROUPS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREAD_GROUPS_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREADS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREADS_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.NOTUNIC_THREAD_GROUPS_BY_ID(data.id), data);
    },
  });
};

export const useApiNotunicDeleteThreadGroup = () => {
  const queryClient = useQueryClient();
  return useApiMutate<unknown, { id: number }>({
    path: '/thread-group/:id',
    method: 'DELETE',
    base: 'NOTUNIC',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREAD_GROUPS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREAD_GROUPS_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREADS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREADS_INFINITE().slice(0, 3),
        exact: false,
      });
    },
  });
};

export const useApiNotunicCachedThreadGroups = (): ThreadGroupModel[] => {
  const queryClient = useQueryClient();

  const cacheSingleQuery = queryClient.getQueriesData<ThreadGroupModel>({
    queryKey: [...BASE_QUERY_KEYS.NOTUNIC_THREAD_GROUPS, 'by-id'],
    exact: false,
    type: 'all',
  });
  const cachePaginatedQuery = queryClient.getQueriesData<ThreadGroupsPageModel>({
    queryKey: [...BASE_QUERY_KEYS.NOTUNIC_THREAD_GROUPS, 'paginated'],
    exact: false,
    type: 'all',
  });
  const cacheInfiniteQuery = queryClient.getQueriesData<ThreadGroupModel>({
    queryKey: [...BASE_QUERY_KEYS.NOTUNIC_THREAD_GROUPS, 'infinite'],
    exact: false,
    type: 'all',
  });

  const cache: ThreadGroupModel[] = [
    ...cacheSingleQuery.map(([, tg]) => tg!),
    ...cachePaginatedQuery.flatMap(([, page]) => page?.items ?? []),
    ...cacheInfiniteQuery.map(([, tg]) => tg!),
  ];

  return uniqBy(cache, 'id').filter(Boolean);
};
