import { QUERY_KEYS } from '../../query-keys';
import { HI_URL } from '../../url';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

import {
  SearchGroupsModel,
  GroupPageModel,
  GroupModel,
  CreateGroupModel,
  UpdateGroupModel,
} from './types';

export const useApiHiGroupsPaginatedQuery = (
  params: SearchGroupsModel,
  options?: Partial<
    UseApiQueryOptions<GroupPageModel, SearchGroupsModel, unknown>
  >,
) => {
  return useApiQuery<GroupPageModel, SearchGroupsModel>({
    ...options,
    base: 'HI',
    queryKey: QUERY_KEYS.HI_GROUPS_PAGINATED(params),
    path: HI_URL.GROUPS.PAGINATED,
  });
};

export const useApiHiGroupQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<GroupModel, unknown, unknown>>,
) => {
  return useApiQuery<GroupModel, unknown>({
    ...options,
    base: 'HI',
    queryKey: QUERY_KEYS.HI_GROUPS_BY_ID(id),
    path: HI_URL.GROUPS.BY_ID(id),
  });
};

export const useApiHiCreateGroup = () => {
  return useApiMutate<GroupModel, CreateGroupModel>({
    path: '/groups',
    method: 'POST',
    base: 'HI',
  });
};

export const useApiHiUpdateGroup = () => {
  return useApiMutate<GroupModel, UpdateGroupModel>({
    path: '/groups/:id',
    method: 'PATCH',
    base: 'HI',
  });
};
