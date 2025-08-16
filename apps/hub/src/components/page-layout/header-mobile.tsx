import { AppBar, ButtonIcon, Tabs } from '@dimasbaguspm/versaur';
import { ArrowLeftIcon, SearchIcon } from 'lucide-react';
import { FC } from 'react';

export const HeaderMobile: FC = () => {
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
          as={SearchIcon}
          variant="primary"
          size="md"
          shape="rounded"
          aria-label="Search"
        />
      </AppBar.Trailing>
      <AppBar.Bottom>
        <Tabs value="entries" onValueChange={() => {}}>
          <Tabs.Trigger value="installed">Installed</Tabs.Trigger>
          <Tabs.Trigger value="available">Available</Tabs.Trigger>
        </Tabs>
      </AppBar.Bottom>
    </AppBar>
  );
};
