import {
  SearchThreadCategoryMembersModel,
  ThreadCategoryMembersPageModel,
  ThreadCategoryMemberModel,
  CreateThreadCategoryMemberModel,
} from '@dimasbaguspm/interfaces/notunic-api';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '../../query-keys';
import { NOTUNIC_URL } from '../../url';
import { useApiInfiniteQuery, UseApiInfiniteQueryOptions } from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiNotunicThreadCategoryMembersInfiniteQuery = (
  params: SearchThreadCategoryMembersModel,
  options?: Partial<UseApiInfiniteQueryOptions<ThreadCategoryMemberModel, SearchThreadCategoryMembersModel, unknown>>,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_THREAD_CATEGORY_MEMBERS_INFINITE(params),
    queryParams: params,
    path: NOTUNIC_URL.THREAD_CATEGORY_MEMBERS.PAGINATED,
  });
};

export const useApiNotunicThreadCategoryMembersPaginatedQuery = (
  params: SearchThreadCategoryMembersModel,
  options?: Partial<UseApiQueryOptions<ThreadCategoryMembersPageModel, SearchThreadCategoryMembersModel, unknown>>,
) => {
  return useApiQuery<ThreadCategoryMembersPageModel, SearchThreadCategoryMembersModel>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_THREAD_CATEGORY_MEMBERS_PAGINATED(params),
    queryParams: params,
    path: NOTUNIC_URL.THREAD_CATEGORY_MEMBERS.PAGINATED,
  });
};

export const useApiNotunicThreadCategoryMemberQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<ThreadCategoryMemberModel, unknown, unknown>>,
) => {
  const queryClient = useQueryClient();

  return useApiQuery<ThreadCategoryMemberModel, unknown>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_THREAD_CATEGORIES_BY_ID(id),
    path: NOTUNIC_URL.THREAD_CATEGORIES.BY_ID(id),
    initialData: () => {
      return queryClient
        .getQueryData<ThreadCategoryMemberModel[]>(QUERY_KEYS.NOTUNIC_THREAD_CATEGORY_MEMBERS_PAGINATED().slice(0, 3))
        ?.find((c) => c.threadId === id);
    },
    initialDataUpdatedAt: queryClient.getQueryState(QUERY_KEYS.NOTUNIC_THREAD_CATEGORY_MEMBERS_PAGINATED().slice(0, 3))
      ?.dataUpdatedAt,
  });
};

export const useApiNotunicCreateThreadCategoryMember = () => {
  const queryClient = useQueryClient();
  return useApiMutate<ThreadCategoryMemberModel, CreateThreadCategoryMemberModel>({
    path: '/thread-category-members/:id',
    method: 'POST',
    base: 'NOTUNIC',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREAD_CATEGORIES_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREAD_CATEGORIES_PAGINATED().slice(0, 3),
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
      queryClient.setQueryData(QUERY_KEYS.NOTUNIC_THREAD_CATEGORY_MEMBERS_BY_ID(data.threadId), data);
    },
  });
};

export const useApiNotunicDeleteThreadCategoryMember = () => {
  const queryClient = useQueryClient();
  return useApiMutate<{ id: number }, unknown>({
    path: '/thread-category-members/:id',
    method: 'DELETE',
    base: 'NOTUNIC',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREAD_CATEGORIES_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREAD_CATEGORIES_PAGINATED().slice(0, 3),
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
