import {
  SearchCategoryGroupsModel,
  CategoryGroupsPageModel,
  CategoryGroupModel,
  CreateCategoryGroupModel,
  UpdateCategoryGroupModel,
} from '@dimasbaguspm/interfaces';
import { useQueryClient } from '@tanstack/react-query';
import { uniqBy } from 'lodash';

import { BASE_QUERY_KEYS } from '../../constants';
import { QUERY_KEYS } from '../../query-keys';
import { SPENICLE_URL } from '../../url';
import { useApiInfiniteQuery, UseApiInfiniteQueryOptions } from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiSpenicleCategoryGroupsInfiniteQuery = (
  params: SearchCategoryGroupsModel,
  options?: Partial<UseApiInfiniteQueryOptions<CategoryGroupModel, SearchCategoryGroupsModel, unknown>>,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_CATEGORY_GROUPS_INFINITE(params),
    queryParams: params,
    path: SPENICLE_URL.CATEGORY_GROUP.PAGINATED,
  });
};

export const useApiSpenicleCategoryGroupsPaginatedQuery = (
  params: SearchCategoryGroupsModel,
  options?: Partial<UseApiQueryOptions<CategoryGroupsPageModel, SearchCategoryGroupsModel, unknown>>,
) => {
  return useApiQuery<CategoryGroupsPageModel, SearchCategoryGroupsModel>({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_CATEGORY_GROUPS_PAGINATED(params),
    queryParams: params,
    path: SPENICLE_URL.CATEGORY_GROUP.PAGINATED,
  });
};

export const useApiSpenicleCategoryGroupQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<CategoryGroupModel, unknown, unknown>>,
) => {
  const queryClient = useQueryClient();

  return useApiQuery<CategoryGroupModel, unknown>({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_CATEGORY_GROUPS_BY_ID(id),
    path: SPENICLE_URL.CATEGORY_GROUP.BY_ID(id),
    initialData: () => {
      return queryClient
        .getQueryData<CategoryGroupsPageModel>(QUERY_KEYS.SPENICLE_CATEGORY_GROUPS_PAGINATED().slice(0, 3))
        ?.items.find((categoryGroup) => categoryGroup.id === id);
    },
    initialDataUpdatedAt: queryClient.getQueryState(QUERY_KEYS.SPENICLE_CATEGORY_GROUPS_PAGINATED().slice(0, 3))
      ?.dataUpdatedAt,
  });
};

export const useApiSpenicleCreateCategoryGroup = () => {
  const queryClient = useQueryClient();
  return useApiMutate<CategoryGroupModel, CreateCategoryGroupModel>({
    path: '/category-group',
    method: 'POST',
    base: 'SPENICLE',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_GROUPS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_GROUPS_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.SPENICLE_CATEGORY_GROUPS_BY_ID(data.id), data);
    },
  });
};

export const useApiSpenicleUpdateCategoryGroup = () => {
  const queryClient = useQueryClient();
  return useApiMutate<CategoryGroupModel, UpdateCategoryGroupModel>({
    path: '/category-group/:id',
    method: 'PATCH',
    base: 'SPENICLE',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_GROUPS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_GROUPS_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.SPENICLE_CATEGORY_GROUPS_BY_ID(data.id), data);
    },
  });
};

export const useApiSpenicleDeleteCategoryGroup = () => {
  const queryClient = useQueryClient();
  return useApiMutate<{ id: number }, unknown>({
    path: '/category-group/:id',
    method: 'DELETE',
    base: 'SPENICLE',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_GROUPS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_GROUPS_INFINITE().slice(0, 3),
        exact: false,
      });
    },
  });
};

export const useApiSpenicleCachedCategoryGroups = (): CategoryGroupModel[] => {
  const queryClient = useQueryClient();

  const cacheSingleQuery = queryClient.getQueriesData<CategoryGroupModel>({
    queryKey: [...BASE_QUERY_KEYS.SPENICLE_CATEGORY_GROUPS, 'by-id'],
    exact: false,
    type: 'all',
  });
  const cachePaginatedQuery = queryClient.getQueriesData<CategoryGroupsPageModel>({
    queryKey: [...BASE_QUERY_KEYS.SPENICLE_CATEGORY_GROUPS, 'paginated'],
    exact: false,
    type: 'all',
  });
  const cacheInfiniteQuery = queryClient.getQueriesData<CategoryGroupModel>({
    queryKey: [...BASE_QUERY_KEYS.SPENICLE_CATEGORY_GROUPS, 'infinite'],
    exact: false,
    type: 'all',
  });

  const cache: CategoryGroupModel[] = [
    ...cacheSingleQuery.map(([, categoryGroup]) => categoryGroup!),
    ...cachePaginatedQuery.flatMap(([, page]) => page?.items ?? []),
    ...cacheInfiniteQuery.map(([, categoryGroup]) => categoryGroup!),
  ];

  return uniqBy(cache, 'id').filter(Boolean);
};
