import { AppId } from '@dimasbaguspm/constants';
import { useClientId } from '@dimasbaguspm/utils/client-id';
import { FC, PropsWithChildren } from 'react';

import { GlobalProviderContext } from './context';

interface GlobalProviderProps {
  appId: AppId;
}

export const GlobalProvider: FC<PropsWithChildren<GlobalProviderProps>> = ({ children, appId }) => {
  const { clientId } = useClientId();

  return <GlobalProviderContext.Provider value={{ clientId, appId }}>{children}</GlobalProviderContext.Provider>;
};
