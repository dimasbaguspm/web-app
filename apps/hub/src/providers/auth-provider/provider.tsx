import { FC, PropsWithChildren } from 'react';

import { useApiHiAuthMeQuery } from '../../hooks/use-api';

import { AuthContext } from './context';

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [data, , { isFetching }] = useApiHiAuthMeQuery();

  if (isFetching || !data) {
    return null; // Optionally, you can return a loading state here
  }

  return (
    <AuthContext.Provider
      value={{ userId: data?.user?.id, email: data?.user?.email }}
    >
      {children}
    </AuthContext.Provider>
  );
};
