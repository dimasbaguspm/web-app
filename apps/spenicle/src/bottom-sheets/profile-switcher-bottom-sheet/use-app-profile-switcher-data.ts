import { AppId } from '@dimasbaguspm/constants';
import { useApiHiAppProfilesPaginatedQuery } from '@dimasbaguspm/hooks/use-api';
import { AppProfileModel } from '@dimasbaguspm/interfaces';
import { useAuthProvider } from '@dimasbaguspm/providers/auth-provider';

export const useAppProfileSwitcherData = () => {
  const { user, groupMembers } = useAuthProvider();
  const [userAppProfiles, , { isFetching: isUserFetching }] = useApiHiAppProfilesPaginatedQuery(
    {
      appId: [AppId.Spenicle],
      userId: [user.id],
      pageSize: 100,
    },
    {
      enabled: !!user.id,
    },
  );

  type GroupMember = { groupId: number };

  const [groupAppProfiles, , { isFetching: isGroupFetching }] = useApiHiAppProfilesPaginatedQuery(
    {
      appId: [AppId.Spenicle],
      groupId: groupMembers.map((member: GroupMember) => member.groupId),
      pageSize: 100,
    },
    {
      enabled: groupMembers.length > 0,
    },
  );

  const profiles: AppProfileModel[] = [...(userAppProfiles?.items ?? []), ...(groupAppProfiles?.items ?? [])];

  return {
    profiles,
    isFetching: isUserFetching || isGroupFetching,
  };
};
