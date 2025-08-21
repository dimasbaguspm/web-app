import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '../../query-keys';
import { HI_URL } from '../../url';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

import {
  SearchUsersModel,
  UpdateUserModel,
  UserModel,
  UsersPageModel,
} from './types';

export const useApiHiUsersPaginatedQuery = (params: SearchUsersModel) => {
  return useApiQuery<UsersPageModel, SearchUsersModel>({
    base: 'HI',
    queryKey: QUERY_KEYS.HI_USER_PAGINATED(params),
    queryParams: params,
    path: HI_URL.USER.PAGINATED,
  });
};

export const useApiHiUserQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<UserModel, unknown, unknown>>,
) => {
  return useApiQuery<UserModel, unknown>({
    ...options,
    base: 'HI',
    queryKey: QUERY_KEYS.HI_USER_BY_ID(id),
    path: HI_URL.USER.BY_ID(id),
  });
};

export const useApiHiUpdateUser = () => {
  const queryClient = useQueryClient();

  return useApiMutate<UserModel, UpdateUserModel>({
    path: '/user/:id',
    method: 'PATCH',
    base: 'HI',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HI_USER_PAGINATED(),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.HI_USER_BY_ID(data.id), data);
    },
  });
};
