import { NoResults } from '@dimasbaguspm/versaur';
import { AppWindowIcon, SearchIcon } from 'lucide-react';
import { FC } from 'react';

import { useMarketplaceContext } from '../../context';
import { AppsGrid } from '../../presentation';

const MarketplaceAvailablePage: FC = () => {
  const { data } = useMarketplaceContext();

  return (
    <div className="space-y-6">
      {data.availableApps.length > 0 ? (
        <AppsGrid profiles={[]} variant="available" />
      ) : (
        <NoResults
          hasGrayBackground
          title={data.searchTerm ? 'No results found' : 'No available apps'}
          subtitle={
            data.searchTerm
              ? `No apps found matching with "${data.searchTerm}" search term`
              : 'Browse available apps to get started'
          }
          icon={data.searchTerm ? SearchIcon : AppWindowIcon}
        />
      )}
    </div>
  );
};

export default MarketplaceAvailablePage;
