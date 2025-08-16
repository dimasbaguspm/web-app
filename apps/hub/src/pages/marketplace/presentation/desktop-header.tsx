import { SearchInput, Text } from '@dimasbaguspm/versaur';
import { ChangeEvent, FC } from 'react';

import { useMarketplaceContext } from '../context';

import { Tab } from './tab';

export const DesktopHeader: FC = () => {
  const { actions, data } = useMarketplaceContext();

  const handleSearchChange = (ev: ChangeEvent<HTMLInputElement>) => {
    actions.onSearchChange(ev.target.value);
  };

  return (
    <div className="mb-4 space-y-4">
      <div className="flex flex-row items-center justify-between gap-4">
        <div>
          <Text as="h1" fontSize="3xl" fontWeight="bold" color="black">
            Marketplace
          </Text>
          <Text as="p" color="gray">
            Discover and manage your installed apps
          </Text>
        </div>
        <SearchInput
          placeholder="Search apps..."
          value={data.searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <Tab className="mb-4" />
    </div>
  );
};
