import { QUERY_KEYS } from '../../query-keys';
import { HI_URL } from '../../url';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery } from '../../use-api-query';

import {
  SearchGroupAppsModel,
  GroupAppsPageModel,
  GroupAppModel,
  CreateGroupAppModel,
  DeleteGroupAppModel,
} from './types';

export const useApiHiGroupAppsPaginatedQuery = (
  params: SearchGroupAppsModel,
) => {
  return useApiQuery<GroupAppsPageModel, SearchGroupAppsModel>({
    base: 'HI',
    queryKey: QUERY_KEYS.HI_GROUP_APPS_PAGINATED(params),
    path: HI_URL.GROUP_APPS.PAGINATED,
  });
};

export const useApiHiGroupAppQuery = (id: number) => {
  return useApiQuery<GroupAppModel, unknown>({
    base: 'HI',
    queryKey: QUERY_KEYS.HI_GROUP_APPS_BY_ID(id),
    path: HI_URL.GROUP_APPS.BY_ID(id),
  });
};

export const useApiHiCreateGroupApp = () => {
  return useApiMutate<GroupAppModel, CreateGroupAppModel>({
    path: '/group-apps',
    method: 'POST',
    base: 'HI',
  });
};

export const useApiHiDeleteGroupApp = () => {
  return useApiMutate<void, DeleteGroupAppModel>({
    path: '/group-apps/:id',
    method: 'DELETE',
    base: 'HI',
  });
};
