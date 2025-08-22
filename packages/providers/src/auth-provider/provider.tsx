import {
  useApiHiAppProfilesPaginatedQuery,
  useApiHiAuthMeQuery,
  useApiHiGroupMembersPaginatedQuery,
  useApiHiUserQuery,
} from '@dimasbaguspm/hooks/use-api';
import { LoadingIndicator } from '@dimasbaguspm/versaur';
import { FC, PropsWithChildren } from 'react';

import { AuthContext } from './context';

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [data, , { isFetching }] = useApiHiAuthMeQuery();

  const [user, , { isFetching: isUserFetching }] = useApiHiUserQuery(
    data?.user?.id ?? 0,
    {
      enabled: !!data?.user?.id,
    },
  );

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
