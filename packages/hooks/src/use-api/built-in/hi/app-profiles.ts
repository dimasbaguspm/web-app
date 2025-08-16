import { QUERY_KEYS } from '../../query-keys';
import { HI_URL } from '../../url';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

import {
  SearchAppProfilesModel,
  AppProfilesPageModel,
  AppProfileModel,
  CreateAppProfileModel,
  DeleteAppProfileModel,
  UpdateAppProfileModel,
} from './types';

export const useApiHiAppProfilesPaginatedQuery = (
  params: SearchAppProfilesModel,
  options?: Partial<
    UseApiQueryOptions<AppProfilesPageModel, SearchAppProfilesModel, unknown>
  >,
) => {
  return useApiQuery<AppProfilesPageModel, SearchAppProfilesModel>({
    ...options,
    base: 'HI',
    queryKey: QUERY_KEYS.HI_APP_PROFILES_PAGINATED(params),
    queryParams: params,
    path: HI_URL.APP_PROFILES.PAGINATED,
  });
};

export const useApiHiAppProfileQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<AppProfilesPageModel, unknown, unknown>>,
) => {
  return useApiQuery<AppProfilesPageModel, unknown>({
    ...options,
    base: 'HI',
    queryKey: QUERY_KEYS.HI_APP_PROFILES_BY_ID(id),
    path: HI_URL.APP_PROFILES.BY_ID(id),
  });
};

export const useApiHiCreateAppProfile = () => {
  return useApiMutate<AppProfileModel, CreateAppProfileModel>({
    path: '/app-profiles',
    method: 'POST',
    base: 'HI',
  });
};

export const useApiHiUpdateAppProfile = () => {
  return useApiMutate<AppProfileModel, UpdateAppProfileModel>({
    path: '/app-profiles/:id',
    method: 'PATCH',
    base: 'HI',
  });
};

export const useApiHiDeleteAppProfile = () => {
  return useApiMutate<void, DeleteAppProfileModel>({
    path: '/app-profiles/:id',
    method: 'DELETE',
    base: 'HI',
  });
};
