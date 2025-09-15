import { useApiHiAppProfileQuery, useApiHiAppQuery, useApiHiAuthSetActiveProfile } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, NoResults, PageLoader, Tabs } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { DetailsTab } from './sub-tabs/details-tab';
import { SettingsTab } from './sub-tabs/settings-tab';
import { UsageTab } from './sub-tabs/usage-tab';
import { SubTab } from './types';

interface DetailAppProfileDrawerProps {
  appProfileId: number;
  tabId?: string;
}

export const DetailAppProfileDrawer: FC<DetailAppProfileDrawerProps> = ({ appProfileId, tabId }) => {
  const { isDesktop } = useWindowResize();
  const { openDrawer } = useDrawerRoute();

  const [setProfile] = useApiHiAuthSetActiveProfile();
  const [appProfile, , { isLoading: isAppProfileLoading }] = useApiHiAppProfileQuery(appProfileId);
  const [app, , { isLoading: isAppLoading }] = useApiHiAppQuery(appProfile?.appId ?? 0, {
    enabled: !!appProfile?.appId,
  });

  const isLoading = isAppProfileLoading || isAppLoading;

  const activeTab = tabId || SubTab.Details;

  const handleOnTabChange = (tabId: string) => {
    openDrawer(
      DRAWER_ROUTES.DETAIL_APP_PROFILE,
      { appProfileId, tabId },
      {
        replace: true,
      },
    );
  };

  const handleOnLaunchClick = async () => {
    if (!app?.url) return;

    await setProfile({ profileId: appProfileId });

    window.open(app.url, '_blank');
  };

  return (
    <>
      <Drawer.Header hasTab>
        <Drawer.Title>{appProfile?.name}</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Tab>
        <Tabs value={activeTab} onValueChange={handleOnTabChange}>
          <Tabs.Trigger value={SubTab.Details}>Details</Tabs.Trigger>
          <Tabs.Trigger value={SubTab.Usage}>Usage</Tabs.Trigger>
          <Tabs.Trigger value={SubTab.Settings}>Settings</Tabs.Trigger>
        </Tabs>
      </Drawer.Tab>
      <Drawer.Body>
        <If condition={isLoading}>
          <PageLoader />
        </If>
        <If condition={[!isLoading && !appProfile]}>
          <NoResults
            icon={SearchXIcon}
            title="Profile not found"
            subtitle="The profile you are looking for does not exist"
          />
        </If>
        <If condition={[!isLoading && appProfile]}>
          {activeTab === SubTab.Details && <DetailsTab app={app!} appProfile={appProfile!} />}
          {activeTab === SubTab.Usage && <UsageTab />}
          {activeTab === SubTab.Settings && <SettingsTab appProfile={appProfile!} />}
        </If>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button onClick={handleOnLaunchClick}>Launch</Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
