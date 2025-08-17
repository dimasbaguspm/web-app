import { NoResults, Text } from '@dimasbaguspm/versaur';
import { AppWindowIcon, SearchIcon } from 'lucide-react';
import { FC } from 'react';

import { useMarketplaceContext } from '../../context';
import { AppsGrid } from '../../presentation';

const MarketplaceInstalledPage: FC = () => {
  const { data } = useMarketplaceContext();

  const totalInstalled =
    data.userAppProfiles.length + data.groupAppProfiles.length;

  return (
    <div className="space-y-6">
      {/* Personal Apps */}
      {data.userAppProfiles.length > 0 && (
        <div className="space-y-4">
          <Text as="h3" color="black" fontSize="xl" fontWeight="semibold">
            Personal Apps ({data.userAppProfiles.length})
          </Text>
          <AppsGrid profiles={data.userAppProfiles} variant="user" />
        </div>
      )}

      {/* Group Apps */}
      {data.groupAppProfiles.length > 0 && (
        <div className="space-y-4">
          <Text as="h3" color="black" fontSize="xl" fontWeight="semibold">
            Group Apps ({data.groupAppProfiles.length})
          </Text>
          <AppsGrid profiles={data.groupAppProfiles} variant="group" />
        </div>
      )}

      {/* Empty State */}
      {totalInstalled === 0 && (
        <NoResults
          title={data.searchTerm ? 'No results found' : 'No installed apps'}
          subtitle={
            data.searchTerm
              ? `No apps found matching with "${data.searchTerm}" search term`
              : 'Install apps to see them here'
          }
          icon={data.searchTerm ? SearchIcon : AppWindowIcon}
          hasGrayBackground
        />
      )}
    </div>
  );
};

export default MarketplaceInstalledPage;
