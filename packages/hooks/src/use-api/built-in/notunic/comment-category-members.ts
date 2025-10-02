import {
  SearchCommentCategoryMembersModel,
  CommentCategoryMembersPageModel,
  CommentCategoryMemberModel,
  CreateCommentCategoryMemberModel,
} from '@dimasbaguspm/interfaces/notunic-api';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '../../query-keys';
import { NOTUNIC_URL } from '../../url';
import { useApiInfiniteQuery, UseApiInfiniteQueryOptions } from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiNotunicCommentCategoryMembersInfiniteQuery = (
  params: SearchCommentCategoryMembersModel,
  options?: Partial<UseApiInfiniteQueryOptions<CommentCategoryMemberModel, SearchCommentCategoryMembersModel, unknown>>,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_COMMENT_CATEGORY_MEMBERS_INFINITE(params),
    queryParams: params,
    path: NOTUNIC_URL.COMMENT_CATEGORY_MEMBERS.PAGINATED,
  });
};

export const useApiNotunicCommentCategoryMembersPaginatedQuery = (
  params: SearchCommentCategoryMembersModel,
  options?: Partial<UseApiQueryOptions<CommentCategoryMembersPageModel, SearchCommentCategoryMembersModel, unknown>>,
) => {
  return useApiQuery<CommentCategoryMembersPageModel, SearchCommentCategoryMembersModel>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_COMMENT_CATEGORY_MEMBERS_PAGINATED(params),
    queryParams: params,
    path: NOTUNIC_URL.COMMENT_CATEGORY_MEMBERS.PAGINATED,
  });
};

export const useApiNotunicCommentCategoryMemberQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<CommentCategoryMemberModel, unknown, unknown>>,
) => {
  const queryClient = useQueryClient();

  return useApiQuery<CommentCategoryMemberModel, unknown>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_COMMENT_CATEGORIES_BY_ID(id),
    path: NOTUNIC_URL.COMMENT_CATEGORIES.BY_ID(id),
    initialData: () => {
      return queryClient
        .getQueryData<CommentCategoryMemberModel[]>(QUERY_KEYS.NOTUNIC_COMMENT_CATEGORY_MEMBERS_PAGINATED().slice(0, 3))
        ?.find((c) => c.commentId === id);
    },
    initialDataUpdatedAt: queryClient.getQueryState(QUERY_KEYS.NOTUNIC_COMMENT_CATEGORY_MEMBERS_PAGINATED().slice(0, 3))
      ?.dataUpdatedAt,
  });
};

export const useApiNotunicCreateCommentCategoryMember = () => {
  const queryClient = useQueryClient();
  return useApiMutate<CommentCategoryMemberModel, CreateCommentCategoryMemberModel>({
    path: '/comment-category-members/:id',
    method: 'POST',
    base: 'NOTUNIC',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_COMMENT_CATEGORIES_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_COMMENT_CATEGORIES_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_COMMENTS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_COMMENTS_INFINITE().slice(0, 3),
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
      queryClient.setQueryData(QUERY_KEYS.NOTUNIC_COMMENT_CATEGORY_MEMBERS_BY_ID(data.commentId), data);
    },
  });
};

export const useApiNotunicDeleteCommentCategoryMember = () => {
  const queryClient = useQueryClient();
  return useApiMutate<{ id: number }, unknown>({
    path: '/comment-category-members/:id',
    method: 'DELETE',
    base: 'NOTUNIC',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_COMMENT_CATEGORIES_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_COMMENT_CATEGORIES_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_COMMENTS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_COMMENTS_INFINITE().slice(0, 3),
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
