import { useApiHiAppQuery, useApiHiGroupsPaginatedQuery } from '@dimasbaguspm/hooks/use-api';
import { useMemo } from 'react';

import { useAuthProvider } from '../../providers/auth-provider';

export const useAppProfileData = () => {
  const { groupMembers, user } = useAuthProvider();

  const [app, , { isLoading: isAppLoading }] = useApiHiAppQuery(1, {
    enabled: Boolean(1),
  });

  const groupIds = useMemo(() => {
    return [...new Set(groupMembers.map((member) => member.groupId))];
  }, [groupMembers]);

  const [groupsData, , { isLoading: isGroupsLoading }] = useApiHiGroupsPaginatedQuery(
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
