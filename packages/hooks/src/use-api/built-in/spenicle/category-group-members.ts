import {
  SearchCategoryGroupMembersModel,
  CategoryGroupMembersPageModel,
  CreateCategoryGroupMembersModel,
  DeleteCategoryGroupMemberModel,
  CategoryGroupMemberModel,
} from '@dimasbaguspm/interfaces';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '../../query-keys';
import { SPENICLE_URL } from '../../url';
import { useApiInfiniteQuery, UseApiInfiniteQueryOptions } from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiSpenicleCategoryGroupMembersInfiniteQuery = (
  params: SearchCategoryGroupMembersModel,
  options?: Partial<UseApiInfiniteQueryOptions<CategoryGroupMemberModel, SearchCategoryGroupMembersModel, unknown>>,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_CATEGORY_GROUP_MEMBERS_INFINITE(params),
    queryParams: params,
    path: SPENICLE_URL.CATEGORY_GROUP_MEMBERS.PAGINATED,
  });
};

export const useApiSpenicleCategoryGroupMembersPaginatedQuery = (
  params: SearchCategoryGroupMembersModel,
  options?: Partial<UseApiQueryOptions<CategoryGroupMembersPageModel, SearchCategoryGroupMembersModel, unknown>>,
) => {
  return useApiQuery<CategoryGroupMembersPageModel, SearchCategoryGroupMembersModel>({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_CATEGORY_GROUP_MEMBERS_PAGINATED(params),
    queryParams: params,
    path: SPENICLE_URL.CATEGORY_GROUP_MEMBERS.PAGINATED,
  });
};

export const useApiSpenicleCategoryGroupMembersQuery = (
  categoryGroupId: number,
  options?: Partial<UseApiQueryOptions<CategoryGroupMemberModel[], void, unknown>>,
) => {
  return useApiQuery<CategoryGroupMemberModel[], void>({
    ...options,
    path: SPENICLE_URL.CATEGORY_GROUP_MEMBERS.BY_ID(categoryGroupId),
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_CATEGORY_GROUP_MEMBERS_BY_ID(categoryGroupId),
  });
};

export const useApiSpenicleCreateCategoryGroupMembers = () => {
  const queryClient = useQueryClient();
  return useApiMutate<CategoryGroupMemberModel[], CreateCategoryGroupMembersModel>({
    path: '/category-group-members',
    method: 'POST',
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
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_GROUP_MEMBERS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_GROUP_MEMBERS_INFINITE().slice(0, 3),
        exact: false,
      });
    },
  });
};

export const useApiSpenicleDeleteCategoryGroupMembers = () => {
  const queryClient = useQueryClient();
  return useApiMutate<unknown, DeleteCategoryGroupMemberModel>({
    path: '/category-group-members/:categoryGroupId',
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
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_GROUP_MEMBERS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_CATEGORY_GROUP_MEMBERS_INFINITE().slice(0, 3),
        exact: false,
      });
    },
  });
};
