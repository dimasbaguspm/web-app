import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { LoadingIndicator, NoResults } from '@dimasbaguspm/versaur';
import { AppWindowIcon, SearchIcon } from 'lucide-react';
import { FC } from 'react';

import { useMarketplaceContext } from './context/context';
import { MarketplaceProvider } from './context/provider';
import { AppsGrid } from './presentation';
import { DesktopHeader } from './presentation/desktop-header';
import { MobileHeader } from './presentation/mobile-header';

const MarketplaceContent: FC = () => {
  const { loading, data } = useMarketplaceContext();
  const { isDesktop } = useWindowResize();

  const isLoading = loading.apps || loading.appProfiles;

  if (isLoading) {
    return <LoadingIndicator size="sm" type="bar" />;
  }

  return (
    <>
      {isDesktop ? <DesktopHeader /> : <MobileHeader />}

      <div className="px-4 space-y-12">
        {data.availableApps.length > 0 ? (
          <AppsGrid />
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
    </>
  );
};

const MarketplacePage: FC = () => {
  return (
    <MarketplaceProvider>
      <MarketplaceContent />
    </MarketplaceProvider>
  );
};

export default MarketplacePage;
