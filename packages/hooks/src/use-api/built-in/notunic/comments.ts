import {
  SearchCommentsModel,
  CommentsPageModel,
  CommentModel,
  CreateCommentModel,
  UpdateCommentModel,
} from '@dimasbaguspm/interfaces/notunic-api';
import { useQueryClient } from '@tanstack/react-query';
import { uniqBy } from 'lodash';

import { BASE_QUERY_KEYS } from '../../constants';
import { QUERY_KEYS } from '../../query-keys';
import { NOTUNIC_URL } from '../../url';
import { useApiInfiniteQuery, UseApiInfiniteQueryOptions } from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiNotunicCommentsInfiniteQuery = (
  params: SearchCommentsModel,
  options?: Partial<UseApiInfiniteQueryOptions<CommentModel, SearchCommentsModel, unknown>>,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_COMMENTS_INFINITE(params),
    queryParams: params,
    path: NOTUNIC_URL.COMMENTS.PAGINATED,
  });
};

export const useApiNotunicCommentsPaginatedQuery = (
  params: SearchCommentsModel,
  options?: Partial<UseApiQueryOptions<CommentsPageModel, SearchCommentsModel, unknown>>,
) => {
  return useApiQuery<CommentsPageModel, SearchCommentsModel>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_COMMENTS_PAGINATED(params),
    queryParams: params,
    path: NOTUNIC_URL.COMMENTS.PAGINATED,
  });
};

export const useApiNotunicCommentQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<CommentModel, unknown, unknown>>,
) => {
  const queryClient = useQueryClient();

  return useApiQuery<CommentModel, unknown>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_COMMENTS_BY_ID(id),
    path: NOTUNIC_URL.COMMENTS.BY_ID(id),
    initialData: () => {
      return queryClient
        .getQueryData<CommentsPageModel>(QUERY_KEYS.NOTUNIC_COMMENTS_PAGINATED().slice(0, 3))
        ?.items.find((c) => c.id === id);
    },
    initialDataUpdatedAt: queryClient.getQueryState(QUERY_KEYS.NOTUNIC_COMMENTS_PAGINATED().slice(0, 3))?.dataUpdatedAt,
  });
};

export const useApiNotunicCreateComment = () => {
  const queryClient = useQueryClient();
  return useApiMutate<CommentModel, CreateCommentModel>({
    path: '/comments',
    method: 'POST',
    base: 'NOTUNIC',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_COMMENTS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_COMMENTS_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.NOTUNIC_COMMENTS_BY_ID(data.id), data);
    },
  });
};

export const useApiNotunicUpdateComment = () => {
  const queryClient = useQueryClient();
  return useApiMutate<CommentModel, UpdateCommentModel>({
    path: '/comments/:id',
    method: 'PATCH',
    base: 'NOTUNIC',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_COMMENTS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_COMMENTS_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.NOTUNIC_COMMENTS_BY_ID(data.id), data);
    },
  });
};

export const useApiNotunicDeleteComment = () => {
  const queryClient = useQueryClient();
  return useApiMutate<{ id: number }, unknown>({
    path: '/comments/:id',
    method: 'DELETE',
    base: 'NOTUNIC',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_COMMENTS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_COMMENTS_INFINITE().slice(0, 3),
        exact: false,
      });
    },
  });
};

export const useApiNotunicCachedComments = (): CommentModel[] => {
  const queryClient = useQueryClient();

  const cacheSingleQuery = queryClient.getQueriesData<CommentModel>({
    queryKey: [...BASE_QUERY_KEYS.NOTUNIC_COMMENTS, 'by-id'],
    exact: false,
    type: 'all',
  });
  const cachePaginatedQuery = queryClient.getQueriesData<CommentsPageModel>({
    queryKey: [...BASE_QUERY_KEYS.NOTUNIC_COMMENTS, 'paginated'],
    exact: false,
    type: 'all',
  });
  const cacheInfiniteQuery = queryClient.getQueriesData<CommentModel>({
    queryKey: [...BASE_QUERY_KEYS.NOTUNIC_COMMENTS, 'infinite'],
    exact: false,
    type: 'all',
  });

  const cache: CommentModel[] = [
    ...cacheSingleQuery.map(([, c]) => c!),
    ...cachePaginatedQuery.flatMap(([, page]) => page?.items ?? []),
    ...cacheInfiniteQuery.map(([, c]) => c!),
  ];

  return uniqBy(cache, 'id').filter(Boolean);
};
