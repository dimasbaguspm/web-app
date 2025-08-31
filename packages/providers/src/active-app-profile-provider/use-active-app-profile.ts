import { useContext } from 'react';

import { ActiveAppProfileContext } from './context';

export const useActiveAppProfile = () => {
  const context = useContext(ActiveAppProfileContext);
  if (!context) {
    throw new Error('useActiveAppProfile must be used within an ActiveAppProfileProvider');
  }
  return context;
};
