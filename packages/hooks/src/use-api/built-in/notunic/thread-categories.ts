import {
  SearchThreadCategoriesModel,
  ThreadCategoriesPageModel,
  ThreadCategoryModel,
  CreateThreadCategoryModel,
  UpdateThreadCategoryModel,
} from '@dimasbaguspm/interfaces/notunic-api';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '../../query-keys';
import { NOTUNIC_URL } from '../../url';
import { useApiInfiniteQuery, UseApiInfiniteQueryOptions } from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiNotunicThreadCategoriesInfiniteQuery = (
  params: SearchThreadCategoriesModel,
  options?: Partial<UseApiInfiniteQueryOptions<ThreadCategoryModel, SearchThreadCategoriesModel, unknown>>,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_THREAD_CATEGORIES_INFINITE(params),
    queryParams: params,
    path: NOTUNIC_URL.THREAD_CATEGORIES.PAGINATED,
  });
};

export const useApiNotunicThreadCategoriesPaginatedQuery = (
  params: SearchThreadCategoriesModel,
  options?: Partial<UseApiQueryOptions<ThreadCategoriesPageModel, SearchThreadCategoriesModel, unknown>>,
) => {
  return useApiQuery<ThreadCategoriesPageModel, SearchThreadCategoriesModel>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_THREAD_CATEGORIES_PAGINATED(params),
    queryParams: params,
    path: NOTUNIC_URL.THREAD_CATEGORIES.PAGINATED,
  });
};

export const useApiNotunicThreadCategoryQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<ThreadCategoryModel, unknown, unknown>>,
) => {
  const queryClient = useQueryClient();

  return useApiQuery<ThreadCategoryModel, unknown>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_THREAD_CATEGORIES_BY_ID(id),
    path: NOTUNIC_URL.THREAD_CATEGORIES.BY_ID(id),
    initialData: () => {
      return queryClient
        .getQueryData<ThreadCategoriesPageModel>(QUERY_KEYS.NOTUNIC_THREAD_CATEGORIES_PAGINATED().slice(0, 3))
        ?.items.find((c) => c.id === id);
    },
    initialDataUpdatedAt: queryClient.getQueryState(QUERY_KEYS.NOTUNIC_THREAD_CATEGORIES_PAGINATED().slice(0, 3))
      ?.dataUpdatedAt,
  });
};

export const useApiNotunicCreateThreadCategory = () => {
  const queryClient = useQueryClient();
  return useApiMutate<ThreadCategoryModel, CreateThreadCategoryModel>({
    path: '/thread-category',
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
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREAD_CATEGORIES_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREAD_CATEGORIES_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.NOTUNIC_THREADS_BY_ID(data.id), data);
    },
  });
};

export const useApiNotunicUpdateThreadCategory = () => {
  const queryClient = useQueryClient();
  return useApiMutate<ThreadCategoryModel, UpdateThreadCategoryModel>({
    path: '/thread-category/:id',
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
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREAD_CATEGORIES_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREAD_CATEGORIES_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.NOTUNIC_THREADS_BY_ID(data.id), data);
    },
  });
};

export const useApiNotunicDeleteThreadCategory = () => {
  const queryClient = useQueryClient();
  return useApiMutate<{ id: number }, unknown>({
    path: '/thread-category/:id',
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
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREAD_CATEGORIES_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREAD_CATEGORIES_PAGINATED().slice(0, 3),
        exact: false,
      });
    },
  });
};
