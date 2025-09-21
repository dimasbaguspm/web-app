import { useContext } from 'react';

import { PortalProviderContext } from './context';

export const usePortalProvider = () => {
  const context = useContext(PortalProviderContext);
  if (!context) {
    throw new Error('usePortalProvider must be used within a PortalProvider');
  }
  return context;
};
