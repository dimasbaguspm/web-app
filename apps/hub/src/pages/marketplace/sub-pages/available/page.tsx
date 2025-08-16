import { FC } from 'react';

import { useMarketplaceContext } from '../../context';
import { AppsGrid, EmptyState } from '../../presentation';

const MarketplaceAvailablePage: FC = () => {
  const { data } = useMarketplaceContext();

  return (
    <div className="space-y-6">
      {data.availableApps.length > 0 ? (
        <AppsGrid profiles={[]} variant="available" />
      ) : (
        <EmptyState
          title={data.searchTerm ? 'No results found' : 'No available apps'}
          description={
            data.searchTerm
              ? `No apps found matching with "${data.searchTerm}" search term`
              : 'Browse available apps to get started'
          }
        />
      )}
    </div>
  );
};

export default MarketplaceAvailablePage;
