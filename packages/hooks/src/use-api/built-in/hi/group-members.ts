import {
  SearchGroupMembersModel,
  GroupMembersPageModel,
  GroupMemberModel,
  CreateGroupMemberModel,
  UpdateGroupMemberModel,
  DeleteGroupMemberModel,
} from '@dimasbaguspm/interfaces';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '../../query-keys';
import { HI_URL } from '../../url';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiHiGroupMembersPaginatedQuery = (
  params: SearchGroupMembersModel,
  options?: Partial<
    UseApiQueryOptions<GroupMembersPageModel, SearchGroupMembersModel, unknown>
  >,
) => {
  return useApiQuery<GroupMembersPageModel, SearchGroupMembersModel>({
    ...options,
    base: 'HI',
    queryKey: QUERY_KEYS.HI_GROUP_MEMBERS_PAGINATED(params),
    queryParams: params,
    path: HI_URL.GROUP_MEMBERS.PAGINATED,
  });
};

export const useApiHiGroupMemberQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<GroupMemberModel, unknown, unknown>>,
) => {
  return useApiQuery<GroupMemberModel, unknown>({
    ...options,
    base: 'HI',
    queryKey: QUERY_KEYS.HI_GROUP_MEMBERS_BY_ID(id),
    path: HI_URL.GROUP_MEMBERS.BY_ID(id),
  });
};

export const useApiHiCreateGroupMember = () => {
  const queryClient = useQueryClient();
  return useApiMutate<GroupMemberModel, CreateGroupMemberModel>({
    path: '/group-members',
    method: 'POST',
    base: 'HI',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HI_GROUP_MEMBERS_PAGINATED(),
        exact: false,
      });
      queryClient.setQueryData(
        QUERY_KEYS.HI_GROUP_MEMBERS_BY_ID(data.id),
        data,
      );
    },
  });
};

export const useApiHiUpdateGroupMember = () => {
  const queryClient = useQueryClient();
  return useApiMutate<GroupMemberModel, UpdateGroupMemberModel>({
    path: '/group-members/:id',
    method: 'PATCH',
    base: 'HI',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HI_GROUP_MEMBERS_PAGINATED(),
        exact: false,
      });
      queryClient.setQueryData(
        QUERY_KEYS.HI_GROUP_MEMBERS_BY_ID(data.id),
        data,
      );
    },
  });
};

export const useApiHiDeleteGroupMember = () => {
  return useApiMutate<void, DeleteGroupMemberModel>({
    path: '/group-members/:id',
    method: 'DELETE',
    base: 'HI',
  });
};
