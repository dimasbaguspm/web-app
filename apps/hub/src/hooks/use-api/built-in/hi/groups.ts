import { QUERY_KEYS } from '../../query-keys';
import { HI_URL } from '../../url';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery } from '../../use-api-query';

import {
  SearchGroupsModel,
  GroupPageModel,
  GroupModel,
  CreateGroupModel,
  UpdateGroupModel,
} from './types';

export const useApiHiGroupsPaginatedQuery = (params: SearchGroupsModel) => {
  return useApiQuery<GroupPageModel, SearchGroupsModel>({
    base: 'HI',
    queryKey: QUERY_KEYS.HI_GROUPS_PAGINATED(params),
    path: HI_URL.GROUPS.PAGINATED,
  });
};

export const useApiHiGroupQuery = (id: number) => {
  return useApiQuery<GroupModel, unknown>({
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
