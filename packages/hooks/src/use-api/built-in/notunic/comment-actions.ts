import {
  SearchCommentActionsModel,
  CommentActionsPageModel,
  CommentActionModel,
  CreateCommentActionModel,
  UpdateCommentActionModel,
} from '@dimasbaguspm/interfaces/notunic-api';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '../../query-keys';
import { NOTUNIC_URL } from '../../url';
import { useApiInfiniteQuery, UseApiInfiniteQueryOptions } from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiNotunicCommentActionsInfiniteQuery = (
  params: SearchCommentActionsModel,
  options?: Partial<UseApiInfiniteQueryOptions<CommentActionModel, SearchCommentActionsModel, unknown>>,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_COMMENT_ACTIONS_INFINITE(params),
    queryParams: params,
    path: NOTUNIC_URL.COMMENT_ACTIONS.PAGINATED,
  });
};

export const useApiNotunicCommentActionsPaginatedQuery = (
  params: SearchCommentActionsModel,
  options?: Partial<UseApiQueryOptions<CommentActionsPageModel, SearchCommentActionsModel, unknown>>,
) => {
  return useApiQuery<CommentActionsPageModel, SearchCommentActionsModel>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_COMMENT_ACTIONS_PAGINATED(params),
    queryParams: params,
    path: NOTUNIC_URL.COMMENT_ACTIONS.PAGINATED,
  });
};

export const useApiNotunicCommentActionQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<CommentActionModel, unknown, unknown>>,
) => {
  const queryClient = useQueryClient();

  return useApiQuery<CommentActionModel, unknown>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_COMMENT_ACTIONS_BY_ID(id),
    path: NOTUNIC_URL.COMMENT_ACTIONS.BY_ID(id),
    initialData: () => {
      return queryClient
        .getQueryData<CommentActionsPageModel>(QUERY_KEYS.NOTUNIC_COMMENT_ACTIONS_PAGINATED().slice(0, 3))
        ?.items.find((c) => c.id === id);
    },
    initialDataUpdatedAt: queryClient.getQueryState(QUERY_KEYS.NOTUNIC_COMMENT_ACTIONS_PAGINATED().slice(0, 3))
      ?.dataUpdatedAt,
  });
};

export const useApiNotunicCreateCommentAction = () => {
  const queryClient = useQueryClient();
  return useApiMutate<CommentActionModel, CreateCommentActionModel>({
    path: '/comment-actions',
    method: 'POST',
    base: 'NOTUNIC',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_COMMENT_ACTIONS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_COMMENT_ACTIONS_INFINITE().slice(0, 3),
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
      queryClient.setQueryData(QUERY_KEYS.NOTUNIC_COMMENT_ACTIONS_BY_ID(data.id), data);
    },
  });
};

export const useApiNotunicUpdateCommentAction = () => {
  const queryClient = useQueryClient();
  return useApiMutate<CommentActionModel, UpdateCommentActionModel>({
    path: '/comment-actions/:id',
    method: 'PATCH',
    base: 'NOTUNIC',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_COMMENT_ACTIONS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_COMMENT_ACTIONS_INFINITE().slice(0, 3),
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
      queryClient.setQueryData(QUERY_KEYS.NOTUNIC_COMMENT_ACTIONS_BY_ID(data.id), data);
    },
  });
};
