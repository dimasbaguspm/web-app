import {
  useApiHiAppProfilesPaginatedQuery,
  useApiHiAuthMeQuery,
  useApiHiGroupMembersPaginatedQuery,
  useApiHiUserQuery,
} from '@dimasbaguspm/hooks/use-api';
import { PageLoader } from '@dimasbaguspm/versaur';
import { FC, PropsWithChildren } from 'react';

import { AuthContext } from './context';

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [data, , { isLoading }] = useApiHiAuthMeQuery();

  const [user, , { isLoading: isUserFetching }] = useApiHiUserQuery(data?.user?.id ?? 0, {
    enabled: !!data?.user?.id,
  });

  const [userMembers, , { isLoading: isUserGroupFetching }] = useApiHiGroupMembersPaginatedQuery(
    {
      userId: [(data?.user?.id ?? 0).toString()],
      pageSize: '100',
    },
    {
      enabled: !!data?.user?.id,
    },
  );

  const [userAppProfiles, , { isLoading: isUserAppProfilesFetching }] = useApiHiAppProfilesPaginatedQuery(
    {
      userId: [data?.user?.id ?? 0],
      pageSize: 100,
    },
    {
      enabled: !!data?.user?.id,
    },
  );

  const [userGroupAppProfiles, , { isLoading: isUserGroupAppProfilesFetching }] = useApiHiAppProfilesPaginatedQuery(
    {
      groupId: (userMembers?.items ?? []).map((member) => member.groupId),
      pageSize: 100,
    },
    {
      enabled: (userMembers?.items ?? []).length > 0 && !!data?.user?.id,
    },
  );

  const isDataFetching =
    isLoading || isUserFetching || isUserGroupFetching || isUserAppProfilesFetching || isUserGroupAppProfilesFetching;

  const groupMembers = userMembers?.items ?? [];
  const appProfiles = [...(userAppProfiles?.items ?? []), ...(userGroupAppProfiles?.items ?? [])];

  if (isDataFetching || !data || !user) {
    return <PageLoader />;
  }

  return <AuthContext.Provider value={{ user, groupMembers, appProfiles }}>{children}</AuthContext.Provider>;
};
