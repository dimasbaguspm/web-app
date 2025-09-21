import {
  SearchThreadsModel,
  ThreadsPageModel,
  ThreadModel,
  CreateThreadModel,
  UpdateThreadModel,
} from '@dimasbaguspm/interfaces/notunic-api';
import { useQueryClient } from '@tanstack/react-query';
import { uniqBy } from 'lodash';

import { BASE_QUERY_KEYS } from '../../constants';
import { QUERY_KEYS } from '../../query-keys';
import { NOTUNIC_URL } from '../../url';
import { useApiInfiniteQuery, UseApiInfiniteQueryOptions } from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiNotunicThreadsInfiniteQuery = (
  params: SearchThreadsModel,
  options?: Partial<UseApiInfiniteQueryOptions<ThreadModel, SearchThreadsModel, unknown>>,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_THREADS_INFINITE(params),
    queryParams: params,
    path: NOTUNIC_URL.THREADS.PAGINATED,
  });
};

export const useApiNotunicThreadsPaginatedQuery = (
  params: SearchThreadsModel,
  options?: Partial<UseApiQueryOptions<ThreadsPageModel, SearchThreadsModel, unknown>>,
) => {
  return useApiQuery<ThreadsPageModel, SearchThreadsModel>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_THREADS_PAGINATED(params),
    queryParams: params,
    path: NOTUNIC_URL.THREADS.PAGINATED,
  });
};

export const useApiNotunicThreadQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<ThreadModel, unknown, unknown>>,
) => {
  const queryClient = useQueryClient();

  return useApiQuery<ThreadModel, unknown>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_THREADS_BY_ID(id),
    path: NOTUNIC_URL.THREADS.BY_ID(id),
    initialData: () => {
      return queryClient
        .getQueryData<ThreadsPageModel>(QUERY_KEYS.NOTUNIC_THREADS_PAGINATED().slice(0, 3))
        ?.items.find((t) => t.id === id);
    },
    initialDataUpdatedAt: queryClient.getQueryState(QUERY_KEYS.NOTUNIC_THREADS_PAGINATED().slice(0, 3))?.dataUpdatedAt,
  });
};

export const useApiNotunicCreateThread = () => {
  const queryClient = useQueryClient();
  return useApiMutate<ThreadModel, CreateThreadModel>({
    path: '/threads',
    method: 'POST',
    base: 'NOTUNIC',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREADS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREADS_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.NOTUNIC_THREADS_BY_ID(data.id), data);
    },
  });
};

export const useApiNotunicUpdateThread = () => {
  const queryClient = useQueryClient();
  return useApiMutate<ThreadModel, UpdateThreadModel>({
    path: '/threads/:id',
    method: 'PATCH',
    base: 'NOTUNIC',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREADS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREADS_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.NOTUNIC_THREADS_BY_ID(data.id), data);
    },
  });
};

export const useApiNotunicDeleteThread = () => {
  const queryClient = useQueryClient();
  return useApiMutate<{ id: number }, unknown>({
    path: '/threads/:id',
    method: 'DELETE',
    base: 'NOTUNIC',
    onSuccess: () => {
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

export const useApiNotunicCachedThreads = (): ThreadModel[] => {
  const queryClient = useQueryClient();

  const cacheSingleQuery = queryClient.getQueriesData<ThreadModel>({
    queryKey: [...BASE_QUERY_KEYS.NOTUNIC_THREADS, 'by-id'],
    exact: false,
    type: 'all',
  });
  const cachePaginatedQuery = queryClient.getQueriesData<ThreadsPageModel>({
    queryKey: [...BASE_QUERY_KEYS.NOTUNIC_THREADS, 'paginated'],
    exact: false,
    type: 'all',
  });
  const cacheInfiniteQuery = queryClient.getQueriesData<ThreadModel>({
    queryKey: [...BASE_QUERY_KEYS.NOTUNIC_THREADS, 'infinite'],
    exact: false,
    type: 'all',
  });

  const cache: ThreadModel[] = [
    ...cacheSingleQuery.map(([, t]) => t!),
    ...cachePaginatedQuery.flatMap(([, page]) => page?.items ?? []),
    ...cacheInfiniteQuery.map(([, t]) => t!),
  ];

  return uniqBy(cache, 'id').filter(Boolean);
};
