import { useClientId } from '@dimasbaguspm/utils/client-id';
import { FC, PropsWithChildren } from 'react';

import { GlobalProviderContext } from './context';

export const GlobalProvider: FC<PropsWithChildren> = ({ children }) => {
  const { clientId } = useClientId();

  return (
    <GlobalProviderContext.Provider value={{ clientId }}>
      {children}
    </GlobalProviderContext.Provider>
  );
};
