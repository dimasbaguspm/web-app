import {
  useApiHiAppQuery,
  useApiHiGroupsPaginatedQuery,
} from '@dimasbaguspm/hooks/use-api';
import { useMemo } from 'react';

import { useDrawerRoute } from '../../hooks/use-drawer-route';
import { useAuthProvider } from '../../providers/auth-provider';

export const useAppProfileData = () => {
  const { groupMembers, user } = useAuthProvider();
  const { additionalParams } = useDrawerRoute();
  const appId = additionalParams?.appId;

  const [app, , { isLoading: isAppLoading }] = useApiHiAppQuery(+appId!, {
    enabled: Boolean(appId),
  });

  const groupIds = useMemo(() => {
    return [...new Set(groupMembers.map((member) => member.groupId))];
  }, [groupMembers]);

  const [groupsData, , { isLoading: isGroupsLoading }] =
    useApiHiGroupsPaginatedQuery(
      {
        id: groupIds,
      },
      {
        enabled: Boolean(groupIds.length),
      },
    );

  const isDataLoading = isAppLoading || isGroupsLoading;

  const groups = groupsData?.items || [];

  return {
    user,
    app: app!,
    groups,
    isDataLoading,
  };
};
