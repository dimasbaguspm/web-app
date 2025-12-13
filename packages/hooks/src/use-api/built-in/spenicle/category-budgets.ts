import {
  SearchCategoryBudgetModel,
  CategoryBudgetPageModel,
  CategoryBudgetModel,
  CreateCategoryBudgetModel,
  UpdateCategoryBudgetModel,
} from '@dimasbaguspm/interfaces';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '../../query-keys';
import { SPENICLE_URL } from '../../url';
import { useApiInfiniteQuery, UseApiInfiniteQueryOptions } from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiSpenicleCategoryBudgetsInfiniteQuery = (
  params: SearchCategoryBudgetModel,
  options?: Partial<UseApiInfiniteQueryOptions<CategoryBudgetModel, SearchCategoryBudgetModel, unknown>>,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_CATEGORY_BUDGET_INFINITE(params),
    queryParams: params,
    path: SPENICLE_URL.CATEGORY_BUDGET.PAGINATED,
  });
};

export const useApiSpenicleCategoryBudgetsPaginatedQuery = (
  params: SearchCategoryBudgetModel,
  options?: Partial<UseApiQueryOptions<CategoryBudgetPageModel, SearchCategoryBudgetModel, unknown>>,
) => {
  return useApiQuery<CategoryBudgetPageModel, SearchCategoryBudgetModel>({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_CATEGORY_BUDGET_PAGINATED(params),
    queryParams: params,
    path: SPENICLE_URL.CATEGORY_BUDGET.PAGINATED,
  });
};

export const useApiSpenicleCategoryBudgetQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<CategoryBudgetModel, unknown, unknown>>,
) => {
  return useApiQuery<CategoryBudgetModel, unknown>({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_CATEGORY_BUDGET_BY_ID(id),
    path: SPENICLE_URL.CATEGORY_BUDGET.BY_ID(id),
  });
};

export const useApiSpenicleCreateCategoryBudget = () => {
  const queryClient = useQueryClient();
  return useApiMutate<CategoryBudgetModel, CreateCategoryBudgetModel>({
    path: '/category-budget',
    method: 'POST',
    base: 'SPENICLE',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_BUDGET_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_BUDGET_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.SPENICLE_CATEGORY_BUDGET_BY_ID(data.id), data);
    },
  });
};

export const useApiSpenicleUpdateCategoryBudget = () => {
  const queryClient = useQueryClient();
  return useApiMutate<CategoryBudgetModel, UpdateCategoryBudgetModel>({
    path: '/category-budget/:id',
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
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_BUDGET_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_BUDGET_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_BY_ID(data.category.id),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.SPENICLE_CATEGORY_BUDGET_BY_ID(data.id), data);
    },
  });
};

export const useApiSpenicleDeleteCategoryBudget = () => {
  const queryClient = useQueryClient();
  return useApiMutate<{ id: number }, unknown>({
    path: '/category-budget/:id',
    method: 'DELETE',
    base: 'SPENICLE',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_BUDGET_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_BUDGET_INFINITE().slice(0, 3),
        exact: false,
      });
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
