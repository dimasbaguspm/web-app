import {
  SearchCategoriesModel,
  CategoriesPageModel,
  CategoryModel,
  CreateCategoryModel,
  UpdateCategoryModel,
} from '@dimasbaguspm/interfaces';
import { useQueryClient } from '@tanstack/react-query';
import { uniqBy } from 'lodash';

import { BASE_QUERY_KEYS } from '../../constants';
import { QUERY_KEYS } from '../../query-keys';
import { SPENICLE_URL } from '../../url';
import {
  useApiInfiniteQuery,
  UseApiInfiniteQueryOptions,
} from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiSpenicleCategoriesInfiniteQuery = (
  params: SearchCategoriesModel,
  options?: Partial<
    UseApiInfiniteQueryOptions<CategoryModel, SearchCategoriesModel, unknown>
  >,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_CATEGORY_INFINITE(params),
    queryParams: params,
    path: SPENICLE_URL.CATEGORY.PAGINATED,
  });
};

export const useApiSpenicleCategoriesPaginatedQuery = (
  params: SearchCategoriesModel,
  options?: Partial<
    UseApiQueryOptions<CategoriesPageModel, SearchCategoriesModel, unknown>
  >,
) => {
  return useApiQuery<CategoriesPageModel, SearchCategoriesModel>({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_CATEGORY_PAGINATED(params),
    queryParams: params,
    path: SPENICLE_URL.CATEGORY.PAGINATED,
  });
};

export const useApiSpenicleCategoryQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<CategoryModel, unknown, unknown>>,
) => {
  return useApiQuery<CategoryModel, unknown>({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_CATEGORY_BY_ID(id),
    path: SPENICLE_URL.CATEGORY.BY_ID(id),
  });
};

export const useApiSpenicleCreateCategory = () => {
  const queryClient = useQueryClient();
  return useApiMutate<CategoryModel, CreateCategoryModel>({
    path: '/category',
    method: 'POST',
    base: 'SPENICLE',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(
        QUERY_KEYS.SPENICLE_CATEGORY_BY_ID(data.id),
        data,
      );
    },
  });
};

export const useApiSpenicleUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useApiMutate<CategoryModel, UpdateCategoryModel>({
    path: '/category/:id',
    method: 'PATCH',
    base: 'SPENICLE',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(
        QUERY_KEYS.SPENICLE_CATEGORY_BY_ID(data.id),
        data,
      );
    },
  });
};

export const useApiSpenicleDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useApiMutate<{ id: number }, unknown>({
    path: '/category/:id',
    method: 'DELETE',
    base: 'SPENICLE',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_INFINITE().slice(0, 3),
        exact: false,
      });
    },
  });
};

export const useApiSpenicleCachedCategories = (): CategoryModel[] => {
  const queryClient = useQueryClient();

  const cacheSingleQuery = queryClient.getQueriesData<CategoryModel>({
    queryKey: [...BASE_QUERY_KEYS.SPENICLE_CATEGORIES, 'by-id'],
    exact: false,
    type: 'all',
  });
  const cachePaginatedQuery = queryClient.getQueriesData<CategoriesPageModel>({
    queryKey: [...BASE_QUERY_KEYS.SPENICLE_CATEGORIES, 'paginated'],
    exact: false,
    type: 'all',
  });
  const cacheInfiniteQuery = queryClient.getQueriesData<CategoryModel>({
    queryKey: [...BASE_QUERY_KEYS.SPENICLE_CATEGORIES, 'infinite'],
    exact: false,
    type: 'all',
  });

  const cache: CategoryModel[] = [
    ...cacheSingleQuery.map(([, account]) => account!),
    ...cachePaginatedQuery.flatMap(([, page]) => page?.items ?? []),
    ...cacheInfiniteQuery.map(([, account]) => account!),
  ];

  return uniqBy(cache, 'id').filter(Boolean);
};
