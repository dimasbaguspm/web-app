import {
  SearchAccountGroupMembersModel,
  AccountGroupMembersPageModel,
  CreateAccountGroupMembersModel,
  DeleteAccountGroupMemberModel,
  AccountGroupMemberModel,
} from '@dimasbaguspm/interfaces';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '../../query-keys';
import { SPENICLE_URL } from '../../url';
import { useApiInfiniteQuery, UseApiInfiniteQueryOptions } from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiSpenicleAccountGroupMembersInfiniteQuery = (
  params: SearchAccountGroupMembersModel,
  options?: Partial<UseApiInfiniteQueryOptions<AccountGroupMemberModel, SearchAccountGroupMembersModel, unknown>>,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_GROUP_MEMBERS_INFINITE(params),
    queryParams: params,
    path: SPENICLE_URL.ACCOUNT_GROUP_MEMBERS.PAGINATED,
  });
};

export const useApiSpenicleAccountGroupMembersPaginatedQuery = (
  params: SearchAccountGroupMembersModel,
  options?: Partial<UseApiQueryOptions<AccountGroupMembersPageModel, SearchAccountGroupMembersModel, unknown>>,
) => {
  return useApiQuery<AccountGroupMembersPageModel, SearchAccountGroupMembersModel>({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_GROUP_MEMBERS_PAGINATED(params),
    queryParams: params,
    path: SPENICLE_URL.ACCOUNT_GROUP_MEMBERS.PAGINATED,
  });
};

export const useApiSpenicleAccountGroupMembersQuery = (
  accountGroupId: number,
  options?: Partial<UseApiQueryOptions<AccountGroupMemberModel[], void, unknown>>,
) => {
  return useApiQuery<AccountGroupMemberModel[], void>({
    ...options,
    path: SPENICLE_URL.ACCOUNT_GROUP_MEMBERS.BY_ID(accountGroupId),
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS_BY_ID(accountGroupId),
  });
};

export const useApiSpenicleCreateAccountGroupMembers = () => {
  const queryClient = useQueryClient();
  return useApiMutate<AccountGroupMemberModel[], CreateAccountGroupMembersModel>({
    path: '/account-group-members',
    method: 'POST',
    base: 'SPENICLE',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_GROUP_MEMBERS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_GROUP_MEMBERS_INFINITE().slice(0, 3),
        exact: false,
      });
    },
  });
};

export const useApiSpenicleDeleteAccountGroupMembers = () => {
  const queryClient = useQueryClient();
  return useApiMutate<unknown, DeleteAccountGroupMemberModel>({
    path: '/account-group-members/:accountGroupId',
    method: 'DELETE',
    base: 'SPENICLE',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_GROUP_MEMBERS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_GROUP_MEMBERS_INFINITE().slice(0, 3),
        exact: false,
      });
    },
  });
};
