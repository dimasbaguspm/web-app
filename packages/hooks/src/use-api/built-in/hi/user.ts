import {
  SearchUsersModel,
  UpdateUserModel,
  UpdateUserPasswordModel,
  UserModel,
  UsersPageModel,
} from '@dimasbaguspm/interfaces';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '../../query-keys';
import { HI_URL } from '../../url';
import { useApiInfiniteQuery, UseApiInfiniteQueryOptions } from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiHiUsersInfiniteQuery = (
  params: SearchUsersModel,
  options?: Partial<UseApiInfiniteQueryOptions<UserModel, SearchUsersModel, unknown>>,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'HI',
    queryKey: QUERY_KEYS.HI_USER_INFINITE(params),
    queryParams: params,
    path: HI_URL.USER.PAGINATED,
  });
};

export const useApiHiUsersPaginatedQuery = (params: SearchUsersModel) => {
  return useApiQuery<UsersPageModel, SearchUsersModel>({
    base: 'HI',
    queryKey: QUERY_KEYS.HI_USER_PAGINATED(params),
    queryParams: params,
    path: HI_URL.USER.PAGINATED,
  });
};

export const useApiHiWhoAmIQuery = (options?: Partial<UseApiQueryOptions<UserModel, unknown, unknown>>) => {
  return useApiQuery<UserModel, unknown>({
    ...options,
    base: 'HI',
    queryKey: QUERY_KEYS.HI_USER_ME,
    path: HI_URL.USER.ME,
  });
};

export const useApiHiUpdateWhoAmI = () => {
  const queryClient = useQueryClient();

  return useApiMutate<UserModel, UpdateUserModel>({
    path: '/user/me',
    method: 'PATCH',
    base: 'HI',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HI_USER_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.HI_USER_ME, data);
    },
  });
};

export const useApiHiUpdateWhoAmIPassword = () => {
  const queryClient = useQueryClient();

  return useApiMutate<void, UpdateUserPasswordModel>({
    path: '/user/me/password',
    method: 'PATCH',
    base: 'HI',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HI_USER_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HI_USER_ME,
      });
    },
  });
};
