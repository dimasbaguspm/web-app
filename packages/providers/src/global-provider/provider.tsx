import { useClientId } from '@dimasbaguspm/utils/client-id';
import { If } from '@dimasbaguspm/utils/if';
import { LoadingIndicator } from '@dimasbaguspm/versaur';
import { FC, PropsWithChildren } from 'react';

import { GlobalProviderContext } from './context';

export const GlobalProvider: FC<PropsWithChildren> = ({ children }) => {
  const { clientId, loading } = useClientId();

  return (
    <>
      <If condition={[!clientId, loading]}>
        <LoadingIndicator type="bar" size="sm" />
      </If>

      <If condition={[clientId, !loading]}>
        <GlobalProviderContext.Provider value={{ clientId: clientId! }}>
          {children}
        </GlobalProviderContext.Provider>
      </If>
    </>
  );
};
