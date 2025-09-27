import {
  SearchThreadGroupTagsModel,
  ThreadGroupTagsPageModel,
  ThreadGroupTagModel,
  CreateThreadGroupTagModel,
  UpdateThreadGroupTagModel,
} from '@dimasbaguspm/interfaces/notunic-api';
import { useQueryClient } from '@tanstack/react-query';
import { uniqBy } from 'lodash';

import { BASE_QUERY_KEYS } from '../../constants';
import { QUERY_KEYS } from '../../query-keys';
import { NOTUNIC_URL } from '../../url';
import { useApiInfiniteQuery, UseApiInfiniteQueryOptions } from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiNotunicThreadGroupTagsInfiniteQuery = (
  params: SearchThreadGroupTagsModel,
  options?: Partial<UseApiInfiniteQueryOptions<ThreadGroupTagModel, SearchThreadGroupTagsModel, unknown>>,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_THREAD_GROUP_TAGS_INFINITE(params),
    queryParams: params,
    path: NOTUNIC_URL.THREAD_GROUP_TAGS.PAGINATED,
  });
};

export const useApiNotunicThreadGroupTagsPaginatedQuery = (
  params: SearchThreadGroupTagsModel,
  options?: Partial<UseApiQueryOptions<ThreadGroupTagsPageModel, SearchThreadGroupTagsModel, unknown>>,
) => {
  return useApiQuery<ThreadGroupTagsPageModel, SearchThreadGroupTagsModel>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_THREAD_GROUP_TAGS_PAGINATED(params),
    queryParams: params,
    path: NOTUNIC_URL.THREAD_GROUP_TAGS.PAGINATED,
  });
};

export const useApiNotunicThreadGroupTagQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<ThreadGroupTagModel, unknown, unknown>>,
) => {
  const queryClient = useQueryClient();

  return useApiQuery<ThreadGroupTagModel, unknown>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_THREAD_GROUP_TAGS_BY_ID(id),
    path: NOTUNIC_URL.THREAD_GROUP_TAGS.BY_ID(id),
    initialData: () => {
      return queryClient
        .getQueryData<ThreadGroupTagsPageModel>(QUERY_KEYS.NOTUNIC_THREAD_GROUP_TAGS_PAGINATED().slice(0, 3))
        ?.items.find((tgt) => tgt.id === id);
    },
    initialDataUpdatedAt: queryClient.getQueryState(QUERY_KEYS.NOTUNIC_THREAD_GROUP_TAGS_PAGINATED().slice(0, 3))
      ?.dataUpdatedAt,
  });
};

export const useApiNotunicCreateThreadGroupTag = () => {
  const queryClient = useQueryClient();
  return useApiMutate<ThreadGroupTagModel, CreateThreadGroupTagModel>({
    path: '/thread-group-tag',
    method: 'POST',
    base: 'NOTUNIC',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREAD_GROUP_TAGS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREAD_GROUP_TAGS_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.NOTUNIC_THREAD_GROUP_TAGS_BY_ID(data.id), data);
    },
  });
};

export const useApiNotunicUpdateThreadGroupTag = () => {
  const queryClient = useQueryClient();
  return useApiMutate<ThreadGroupTagModel, UpdateThreadGroupTagModel>({
    path: '/thread-group-tag/:id',
    method: 'PATCH',
    base: 'NOTUNIC',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREAD_GROUP_TAGS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREAD_GROUP_TAGS_INFINITE().slice(0, 3),
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
      queryClient.setQueryData(QUERY_KEYS.NOTUNIC_THREAD_GROUP_TAGS_BY_ID(data.id), data);
    },
  });
};

export const useApiNotunicDeleteThreadGroupTag = () => {
  const queryClient = useQueryClient();
  return useApiMutate<unknown, { id: number }>({
    path: '/thread-group-tag/:id',
    method: 'DELETE',
    base: 'NOTUNIC',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREAD_GROUP_TAGS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREAD_GROUP_TAGS_INFINITE().slice(0, 3),
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

export const useApiNotunicCachedThreadGroupTags = (): ThreadGroupTagModel[] => {
  const queryClient = useQueryClient();

  const cacheSingleQuery = queryClient.getQueriesData<ThreadGroupTagModel>({
    queryKey: [...BASE_QUERY_KEYS.NOTUNIC_THREAD_GROUP_TAGS, 'by-id'],
    exact: false,
    type: 'all',
  });
  const cachePaginatedQuery = queryClient.getQueriesData<ThreadGroupTagsPageModel>({
    queryKey: [...BASE_QUERY_KEYS.NOTUNIC_THREAD_GROUP_TAGS, 'paginated'],
    exact: false,
    type: 'all',
  });
  const cacheInfiniteQuery = queryClient.getQueriesData<ThreadGroupTagModel>({
    queryKey: [...BASE_QUERY_KEYS.NOTUNIC_THREAD_GROUP_TAGS, 'infinite'],
    exact: false,
    type: 'all',
  });

  const cache: ThreadGroupTagModel[] = [
    ...cacheSingleQuery.map(([, tgt]) => tgt!),
    ...cachePaginatedQuery.flatMap(([, page]) => page?.items ?? []),
    ...cacheInfiniteQuery.map(([, tgt]) => tgt!),
  ];

  return uniqBy(cache, 'id').filter(Boolean);
};
