import {
  SearchCommentCategoriesModel,
  CommentCategoriesPageModel,
  CommentCategoryModel,
  CreateCommentCategoryModel,
  UpdateCommentCategoryModel,
} from '@dimasbaguspm/interfaces/notunic-api';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '../../query-keys';
import { NOTUNIC_URL } from '../../url';
import { useApiInfiniteQuery, UseApiInfiniteQueryOptions } from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiNotunicCommentCategoriesInfiniteQuery = (
  params: SearchCommentCategoriesModel,
  options?: Partial<UseApiInfiniteQueryOptions<CommentCategoryModel, SearchCommentCategoriesModel, unknown>>,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_COMMENT_CATEGORIES_INFINITE(params),
    queryParams: params,
    path: NOTUNIC_URL.COMMENT_CATEGORIES.PAGINATED,
  });
};

export const useApiNotunicCommentCategoriesPaginatedQuery = (
  params: SearchCommentCategoriesModel,
  options?: Partial<UseApiQueryOptions<CommentCategoriesPageModel, SearchCommentCategoriesModel, unknown>>,
) => {
  return useApiQuery<CommentCategoriesPageModel, SearchCommentCategoriesModel>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_COMMENT_CATEGORIES_PAGINATED(params),
    queryParams: params,
    path: NOTUNIC_URL.COMMENT_CATEGORIES.PAGINATED,
  });
};

export const useApiNotunicCommentCategoryQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<CommentCategoryModel, unknown, unknown>>,
) => {
  const queryClient = useQueryClient();

  return useApiQuery<CommentCategoryModel, unknown>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_COMMENT_CATEGORIES_BY_ID(id),
    path: NOTUNIC_URL.COMMENT_CATEGORIES.BY_ID(id),
    initialData: () => {
      return queryClient
        .getQueryData<CommentCategoriesPageModel>(QUERY_KEYS.NOTUNIC_COMMENT_CATEGORIES_PAGINATED().slice(0, 3))
        ?.items.find((c) => c.id === id);
    },
    initialDataUpdatedAt: queryClient.getQueryState(QUERY_KEYS.NOTUNIC_COMMENT_CATEGORIES_PAGINATED().slice(0, 3))
      ?.dataUpdatedAt,
  });
};

export const useApiNotunicCreateCommentCategory = () => {
  const queryClient = useQueryClient();
  return useApiMutate<CommentCategoryModel, CreateCommentCategoryModel>({
    path: '/comment-category',
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
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREADS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREADS_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.NOTUNIC_COMMENTS_BY_ID(data.id), data);
    },
  });
};

export const useApiNotunicUpdateCommentCategory = () => {
  const queryClient = useQueryClient();
  return useApiMutate<CommentCategoryModel, UpdateCommentCategoryModel>({
    path: '/comment-category/:id',
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
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREADS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_THREADS_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.NOTUNIC_COMMENTS_BY_ID(data.id), data);
    },
  });
};

export const useApiNotunicDeleteCommentCategory = () => {
  const queryClient = useQueryClient();
  return useApiMutate<{ id: number }, unknown>({
    path: '/comment-category/:id',
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
