import { useContext } from 'react';

import { GlobalProviderContext } from './context';

export const useGlobalProvider = () => {
  const context = useContext(GlobalProviderContext);
  if (!context) {
    throw new Error('useGlobalProvider must be used within a GlobalProvider');
  }
  return context;
};
