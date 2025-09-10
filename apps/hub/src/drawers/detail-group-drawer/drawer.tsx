import { useApiHiGroupQuery } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Drawer, NoResults, PageLoader, Tabs } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { DetailsTab } from './sub-tabs/details-tab';
import { ProfilesTab } from './sub-tabs/profiles-tab';
import { DetailGroupDrawerTab } from './types';

interface DetailGroupDrawerProps {
  groupId: number;
  tabId?: string;
}

export const DetailGroupDrawer: FC<DetailGroupDrawerProps> = ({ groupId, tabId }) => {
  const { openDrawer } = useDrawerRoute();

  const [group, , { isLoading: isLoadingGroup }] = useApiHiGroupQuery(groupId);

  const activeTab = tabId || DetailGroupDrawerTab.Detail;

  const handleTabChange = (value: string) => {
    openDrawer(DRAWER_ROUTES.DETAIL_GROUP, { groupId: groupId.toString(), tabId: value }, { replace: true });
  };

  return (
    <>
      <Drawer.Header hasTab>
        <Drawer.Title>{group?.name || 'Group Details'}</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Tab>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <Tabs.Trigger value={DetailGroupDrawerTab.Detail}>Details</Tabs.Trigger>
          <Tabs.Trigger value={DetailGroupDrawerTab.Profiles}>Profiles</Tabs.Trigger>
        </Tabs>
      </Drawer.Tab>

      <Drawer.Body>
        <If condition={isLoadingGroup}>
          <PageLoader />
        </If>
        <If condition={[!isLoadingGroup, !group]}>
          <NoResults
            icon={SearchXIcon}
            title="Group not found"
            subtitle="We couldn't find the group you're looking for."
          />
        </If>
        <If condition={[!isLoadingGroup, group]}>
          {activeTab === DetailGroupDrawerTab.Detail && <DetailsTab group={group!} />}
          {activeTab === DetailGroupDrawerTab.Profiles && <ProfilesTab group={group!} />}
        </If>
      </Drawer.Body>
    </>
  );
};
