import { FC, ReactNode } from 'react';

import { useMarketplaceData } from '../hooks';

import { MarketplaceContext } from './context';

interface MarketplaceProviderProps {
  children: ReactNode;
}

export const MarketplaceProvider: FC<MarketplaceProviderProps> = ({
  children,
}) => {
  const contextValue = useMarketplaceData();

  return (
    <MarketplaceContext.Provider value={contextValue}>
      {children}
    </MarketplaceContext.Provider>
  );
};
