import {
  useApiHiAuthLogout,
  useApiHiAuthMeQuery,
  useApiHiAuthTokenRefresher,
  useApiHiWhoAmIQuery,
} from '@dimasbaguspm/hooks/use-api';
import { PageLoader } from '@dimasbaguspm/versaur';
import { FC, PropsWithChildren } from 'react';

import { AuthContext } from './context';

const Provider: FC<PropsWithChildren> = ({ children }) => {
  const [authData, , { isFetching: isFetchingAuth }, refetchAuth] = useApiHiAuthMeQuery();

  const isAuthenticated = !!authData?.user?.id;

  const [logout] = useApiHiAuthLogout();

  const [user, , { isFetching: isFetchingUser }, refetchUser] = useApiHiWhoAmIQuery({
    enabled: isAuthenticated,
  });

  const isDataFetching = isFetchingAuth || isFetchingUser;

  const handleLogout = async () => {
    await logout({});
  };
  const refetch = async () => {
    await refetchAuth();
    await refetchUser();
  };

  if (!isAuthenticated || isDataFetching || !authData || !user) {
    return <PageLoader fullscreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        activeProfile: authData.tokenPayload.activeProfile,
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
