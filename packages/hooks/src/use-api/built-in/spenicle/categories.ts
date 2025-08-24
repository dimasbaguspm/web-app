import {
  SearchCategoriesModel,
  CategoriesPageModel,
  CategoryModel,
  CreateCategoryModel,
  UpdateCategoryModel,
} from '@dimasbaguspm/interfaces';
import { useQueryClient } from '@tanstack/react-query';

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
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_PAGINATED(),
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
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_PAGINATED(),
        exact: false,
      });
      queryClient.setQueryData(
        QUERY_KEYS.SPENICLE_CATEGORY_BY_ID(data.id),
        data,
      );
    },
  });
};
