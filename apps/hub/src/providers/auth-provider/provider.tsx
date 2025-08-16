import {
  useApiHiAuthMeQuery,
  useApiHiGroupMembersPaginatedQuery,
  useApiHiUserQuery,
} from '@dimasbaguspm/hooks/use-api';
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

  const isDataFetching = isFetching || isUserFetching || isUserGroupFetching;

  if (isDataFetching || !data || !user) {
    return null;
  }

  const groupMembers = userMembers?.items ?? [];

  return (
    <AuthContext.Provider value={{ user, groupMembers }}>
      {children}
    </AuthContext.Provider>
  );
};
