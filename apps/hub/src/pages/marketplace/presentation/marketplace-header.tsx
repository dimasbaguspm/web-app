import { AppBar, ButtonIcon, Tabs } from '@dimasbaguspm/versaur';
import { ArrowLeftIcon, SearchIcon } from 'lucide-react';
import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { DEEP_LINKS } from '../../../constants/routes';

const enum TabValues {
  INSTALLED = 'installed',
  AVAILABLE = 'available',
}
export const MarketplaceHeader: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (tab: string) => {
    if (tab === TabValues.INSTALLED) {
      navigate(DEEP_LINKS.MARKETPLACE_INSTALLED.path);
    } else if (tab === TabValues.AVAILABLE) {
      navigate(DEEP_LINKS.MARKETPLACE_AVAILABLE.path);
    }
  };
  return (
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
        />
      </AppBar.Trailing>
      <AppBar.Bottom>
        <Tabs
          value={
            location.pathname.includes(TabValues.INSTALLED)
              ? TabValues.INSTALLED
              : TabValues.AVAILABLE
          }
          onValueChange={handleTabChange}
        >
          <Tabs.Trigger value={TabValues.INSTALLED}>Installed</Tabs.Trigger>
          <Tabs.Trigger value={TabValues.AVAILABLE}>Available</Tabs.Trigger>
        </Tabs>
      </AppBar.Bottom>
    </AppBar>
  );
};
