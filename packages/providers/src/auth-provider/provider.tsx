import {
  useApiHiAppProfilesPaginatedQuery,
  useApiHiAuthMeQuery,
  useApiHiAuthTokenRefresher,
  useApiHiGroupMembersPaginatedQuery,
  useApiHiUserQuery,
} from '@dimasbaguspm/hooks/use-api';
import { LoadingIndicator } from '@dimasbaguspm/versaur';
import { FC, PropsWithChildren } from 'react';

import { AuthContext } from './context';

const Provider: FC<PropsWithChildren> = ({ children }) => {
  const [data, , { isFetching }, refetchAuth] = useApiHiAuthMeQuery();

  const [user, , { isFetching: isUserFetching }, refetchUser] =
    useApiHiUserQuery(data?.user?.id ?? 0, {
      enabled: !!data?.user?.id,
    });

  const [userMembers, , { isFetching: isUserGroupFetching }] =
    useApiHiGroupMembersPaginatedQuery(
      {
        userId: [(data?.user?.id ?? 0).toString()],
        pageSize: '100',
      },
      {
        enabled: !!data?.user?.id,
      },
    );

  const [userAppProfiles, , { isFetching: isUserAppProfilesFetching }] =
    useApiHiAppProfilesPaginatedQuery(
      {
        userId: [data?.user?.id ?? 0],
        pageSize: 100,
      },
      {
        enabled: !!data?.user?.id,
      },
    );

  const [
    userGroupAppProfiles,
    ,
    { isFetching: isUserGroupAppProfilesFetching },
  ] = useApiHiAppProfilesPaginatedQuery(
    {
      groupId: (userMembers?.items ?? []).map((member) => member.groupId),
      pageSize: 100,
    },
    {
      enabled: (userMembers?.items ?? []).length > 0 && !!data?.user?.id,
    },
  );

  const isDataFetching =
    isFetching ||
    isUserFetching ||
    isUserGroupFetching ||
    isUserAppProfilesFetching ||
    isUserGroupAppProfilesFetching;

  const groupMembers = userMembers?.items ?? [];
  const appProfiles = [
    ...(userAppProfiles?.items ?? []),
    ...(userGroupAppProfiles?.items ?? []),
  ];

  const refetch = async () => {
    await refetchAuth();
    await refetchUser();
  };

  if (isDataFetching || !data || !user) {
    return (
      <div>
        <LoadingIndicator size="sm" type="bar" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        groupMembers,
        appProfiles,
        activeProfile: data.tokenPayload.activeProfile,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data } = useApiHiAuthTokenRefresher();

  if (!data) return null;

  return <Provider>{children}</Provider>;
};
