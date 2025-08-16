import {
  AppBar,
  BottomSheet,
  Button,
  ButtonIcon,
  SearchInput,
} from '@dimasbaguspm/versaur';
import { ArrowLeftIcon, SearchIcon, X } from 'lucide-react';
import { ChangeEvent, FC, useState } from 'react';

import { useMarketplaceContext } from '../context';

import { Tab } from './tab';

export const MobileHeader: FC = () => {
  const { data, actions } = useMarketplaceContext();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);

  const handleOpenBottomSheet = () => {
    setIsBottomSheetOpen(true);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  const handleSearchChange = (ev: ChangeEvent<HTMLInputElement>) => {
    actions.onSearchChange(ev.target.value);
  };
  return (
    <>
      <AppBar>
        <AppBar.Leading>
          <ButtonIcon
            as={ArrowLeftIcon}
            variant="neutral-ghost"
            aria-label="Back"
            size="lg"
          />
        </AppBar.Leading>

        <AppBar.Center>
          <AppBar.Headline>Marketplace</AppBar.Headline>
          <AppBar.Subtitle>
            Discover and manage your installed apps
          </AppBar.Subtitle>
        </AppBar.Center>
        <AppBar.Trailing>
          <ButtonIcon
            variant="primary"
            size="md"
            shape="rounded"
            aria-label="Print"
            as={SearchIcon}
            onClick={handleOpenBottomSheet}
          />
        </AppBar.Trailing>
        <AppBar.Bottom>
          <Tab />
        </AppBar.Bottom>
      </AppBar>

      <BottomSheet isOpen={isBottomSheetOpen} onClose={handleCloseBottomSheet}>
        <BottomSheet.Header>
          <div className="flex items-center justify-between">
            <BottomSheet.Title>Search</BottomSheet.Title>
            <ButtonIcon
              as={X}
              variant="ghost"
              size="sm"
              onClick={handleCloseBottomSheet}
              aria-label="Close"
            />
          </div>
        </BottomSheet.Header>
        <BottomSheet.Body>
          <SearchInput
            placeholder="Search apps..."
            value={data.searchTerm}
            onChange={handleSearchChange}
          />
        </BottomSheet.Body>
        <BottomSheet.Footer>
          <Button variant="primary" size="md" onClick={handleCloseBottomSheet}>
            Search
          </Button>
        </BottomSheet.Footer>
      </BottomSheet>
    </>
  );
};
