import {
  useApiHiAppsPaginatedQuery,
  useApiHiCreateGroup,
  useApiHiGroupMembersPaginatedQuery,
  useApiHiGroupsPaginatedQuery,
} from '@dimasbaguspm/hooks/use-api';

import { GroupData, GroupMemberData, User } from '../types';

export const useGroupsData = (user: User) => {
  const [createGroup] = useApiHiCreateGroup();

  // Fetch my groups (groups I'm a member of)
  const [myGroupMembers] = useApiHiGroupMembersPaginatedQuery({
    userId: user.id.toString(),
  });

  // Fetch all groups to show group details
  const [allGroups, , { isLoading: isGroupsLoading }] = useApiHiGroupsPaginatedQuery({
    id: myGroupMembers?.items.map((member: GroupMemberData) => member.groupId),
  });

  // Fetch available apps for stats
  const [apps] = useApiHiAppsPaginatedQuery({});

  // Get the groups I'm a member of
  const myGroups = allGroups?.items.filter((group: GroupData) =>
    myGroupMembers?.items.some((member: GroupMemberData) => member.groupId === group.id),
  );

  const getGroupMemberCount = (groupId: number) => {
    return myGroupMembers?.items.filter((member: GroupMemberData) => member.groupId === groupId).length || 0;
  };

  const isGroupOwner = (groupId: number) => {
    return (
      myGroupMembers?.items.find((member: GroupMemberData) => member.groupId === groupId && member.userId === user.id)
        ?.role === 'owner'
    );
  };

  return {
    myGroups,
    myGroupMembers,
    apps,
    isGroupsLoading,
    createGroup,
    getGroupMemberCount,
    isGroupOwner,
  };
};
