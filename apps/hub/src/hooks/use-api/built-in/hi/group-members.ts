import { QUERY_KEYS } from '../../query-keys';
import { HI_URL } from '../../url';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery } from '../../use-api-query';

import {
  SearchGroupMembersModel,
  GroupMembersPageModel,
  GroupMemberModel,
  CreateGroupMemberModel,
  UpdateGroupMemberModel,
  DeleteGroupMemberModel,
} from './types';

export const useApiHiGroupMembersPaginatedQuery = (
  params: SearchGroupMembersModel,
) => {
  return useApiQuery<GroupMembersPageModel, SearchGroupMembersModel>({
    base: 'HI',
    queryKey: QUERY_KEYS.HI_GROUP_MEMBERS_PAGINATED(params),
    path: HI_URL.GROUP_MEMBERS.PAGINATED,
  });
};

export const useApiHiGroupMemberQuery = (id: number) => {
  return useApiQuery<GroupMemberModel, unknown>({
    base: 'HI',
    queryKey: QUERY_KEYS.HI_GROUP_MEMBERS_BY_ID(id),
    path: HI_URL.GROUP_MEMBERS.BY_ID(id),
  });
};

export const useApiHiCreateGroupMember = () => {
  return useApiMutate<GroupMemberModel, CreateGroupMemberModel>({
    path: '/group-members',
    method: 'POST',
    base: 'HI',
  });
};

export const useApiHiUpdateGroupMember = () => {
  return useApiMutate<GroupMemberModel, UpdateGroupMemberModel>({
    path: '/group-members/:id',
    method: 'PATCH',
    base: 'HI',
  });
};

export const useApiHiDeleteGroupMember = () => {
  return useApiMutate<void, DeleteGroupMemberModel>({
    path: '/group-members/:id',
    method: 'DELETE',
    base: 'HI',
  });
};
