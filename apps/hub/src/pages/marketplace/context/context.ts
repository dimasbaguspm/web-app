import { createContext, useContext } from 'react';

import type { MarketplaceContextType } from '../types';

export const MarketplaceContext = createContext<MarketplaceContextType | null>(null);

export const useMarketplaceContext = (): MarketplaceContextType => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplaceContext must be used within a MarketplaceProvider');
  }
  return context;
};
