import { useApiHiAppQuery } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Drawer, NoResults, PageLoader, Tabs } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { DetailsTab } from './sub-tabs/details-tab';
import { ProfilesTab } from './sub-tabs/profiles-tab';
import { SubTab } from './types';

interface DetailAppDrawerProps {
  appId: number;
  tabId?: string;
}

export const DetailAppDrawer: FC<DetailAppDrawerProps> = ({ appId, tabId }) => {
  const { openDrawer } = useDrawerRoute();

  const [app, , { isLoading }] = useApiHiAppQuery(appId, {
    enabled: Boolean(appId && appId > 0),
  });

  const activeTab = tabId || SubTab.Details;

  const handleOnTabChange = (tabId: string) => {
    openDrawer(
      DRAWER_ROUTES.DETAIL_APP,
      { appId, tabId },
      {
        replace: true,
      },
    );
  };

  return (
    <>
      <Drawer.Header hasTab>
        <Drawer.Title>{app?.name}</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Tab>
        <Tabs value={activeTab} onValueChange={handleOnTabChange}>
          <Tabs.Trigger value={SubTab.Details}>Details</Tabs.Trigger>
          <Tabs.Trigger value={SubTab.MyProfiles}>Profiles</Tabs.Trigger>
        </Tabs>
      </Drawer.Tab>
      <If condition={isLoading}>
        <Drawer.Body>
          <PageLoader />
        </Drawer.Body>
      </If>
      <If condition={[!isLoading, !app]}>
        <Drawer.Body>
          <NoResults icon={SearchXIcon} title="App not found" subtitle="The app you are looking for does not exist." />
        </Drawer.Body>
      </If>

      <If condition={[!isLoading, app]}>
        {activeTab === SubTab.Details && <DetailsTab app={app!} />}
        {activeTab === SubTab.MyProfiles && <ProfilesTab app={app!} />}
      </If>
    </>
  );
};
