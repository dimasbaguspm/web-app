import {
  SearchAppProfilesModel,
  AppProfilesPageModel,
  AppProfileModel,
  CreateAppProfileModel,
  DeleteAppProfileModel,
  UpdateAppProfileModel,
} from '@dimasbaguspm/interfaces';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '../../query-keys';
import { HI_URL } from '../../url';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

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
  options?: Partial<UseApiQueryOptions<AppProfileModel, unknown, unknown>>,
) => {
  return useApiQuery<AppProfileModel, unknown>({
    ...options,
    base: 'HI',
    queryKey: QUERY_KEYS.HI_APP_PROFILES_BY_ID(id),
    path: HI_URL.APP_PROFILES.BY_ID(id),
  });
};

export const useApiHiCreateAppProfile = () => {
  const queryClient = useQueryClient();

  return useApiMutate<AppProfileModel, CreateAppProfileModel>({
    path: '/app-profiles',
    method: 'POST',
    base: 'HI',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HI_APP_PROFILES_PAGINATED(),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.HI_APP_PROFILES_BY_ID(data.id), data);
    },
  });
};

export const useApiHiUpdateAppProfile = () => {
  const queryClient = useQueryClient();

  return useApiMutate<AppProfileModel, UpdateAppProfileModel>({
    path: '/app-profiles/:id',
    method: 'PATCH',
    base: 'HI',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HI_APP_PROFILES_PAGINATED(),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.HI_APP_PROFILES_BY_ID(data.id), data);
    },
  });
};

export const useApiHiDeleteAppProfile = () => {
  const queryClient = useQueryClient();

  return useApiMutate<void, DeleteAppProfileModel>({
    path: '/app-profiles/:id',
    method: 'DELETE',
    base: 'HI',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HI_APP_PROFILES_PAGINATED(),
        exact: false,
      });
    },
  });
};
