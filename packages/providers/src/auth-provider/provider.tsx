import {
  useApiHiAppProfilesPaginatedQuery,
  useApiHiAuthLogout,
  useApiHiAuthMeQuery,
  useApiHiAuthTokenRefresher,
  useApiHiGroupMembersPaginatedQuery,
  useApiHiUserQuery,
} from '@dimasbaguspm/hooks/use-api';
import { PageLoader } from '@dimasbaguspm/versaur';
import { FC, PropsWithChildren } from 'react';

import { AuthContext } from './context';

const Provider: FC<PropsWithChildren> = ({ children }) => {
  const [data, , { isLoading }, refetchAuth] = useApiHiAuthMeQuery();

  const [logout] = useApiHiAuthLogout();

  const [user, , { isLoading: isUserFetching }, refetchUser] = useApiHiUserQuery(data?.user?.id ?? 0, {
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

  const handleLogout = async () => {
    await logout({});
  };
  const refetch = async () => {
    await refetchAuth();
    await refetchUser();
  };

  if (isDataFetching || !data || !user) {
    return <PageLoader fullscreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        groupMembers,
        appProfiles,
        activeProfile: data.tokenPayload.activeProfile,
        refetch,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data, isLoading, isError } = useApiHiAuthTokenRefresher();

  if (isLoading) {
    return <PageLoader fullscreen />;
  }

  if (!data) {
    // If refresher failed or returned no data (common when client_id/cookies
    // are missing on some mobile webviews), don't block the app UI by
    // returning null which may trigger SSO. Proceed but log for diagnostics.
    if (isError) console.warn('Auth token refresher failed; proceeding without refresher data');
    return <Provider>{children}</Provider>;
  }

  return <Provider>{children}</Provider>;
};
