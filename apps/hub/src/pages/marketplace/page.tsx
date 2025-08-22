import {
  LoadingIndicator,
  NoResults,
  PageContent,
  PageHeader,
  SearchInput,
} from '@dimasbaguspm/versaur';
import { AppWindowIcon, SearchIcon } from 'lucide-react';
import { FC } from 'react';

import { useMarketplaceContext } from './context/context';
import { MarketplaceProvider } from './context/provider';
import { AppsGrid } from './presentation';

const MarketplaceContent: FC = () => {
  const { loading, data } = useMarketplaceContext();

  const isLoading = loading.apps || loading.appProfiles;

  if (isLoading) {
    return <LoadingIndicator size="sm" type="bar" />;
  }

  return (
    <>
      <PageHeader
        title="Marketplace"
        subtitle="Discover and manage your installed apps"
      />

      <PageContent>
        <div className="mb-6">
          <SearchInput placeholder="Search apps... (⌘K)" />
        </div>

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
      </PageContent>
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
