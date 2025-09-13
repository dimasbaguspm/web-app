import { useApiSpenicleAccountGroupQuery } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Drawer, PageLoader, Tabs } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { DetailsTab } from './sub-tabs/details-tab';
import { HistoryTab } from './sub-tabs/history-tab';
import { TrendsTab } from './sub-tabs/trends-tab';
import { AccountGroupDetailTab } from './types';

interface DetailAccountGroupDrawerProps {
  accountGroupId: number;
  tabId?: string;
}

export const DetailAccountGroupDrawer: FC<DetailAccountGroupDrawerProps> = ({ accountGroupId, tabId }) => {
  const { openDrawer } = useDrawerRoute();

  const [accountGroup, , { isLoading }] = useApiSpenicleAccountGroupQuery(accountGroupId, {
    enabled: Boolean(accountGroupId),
  });

  const activeTabId = tabId || AccountGroupDetailTab.Details;

  const handleTabChange = (tabId: string) => {
    openDrawer(DRAWER_ROUTES.DETAIL_ACCOUNT_GROUP, { accountGroupId, tabId }, { replace: true });
  };

  return (
    <>
      <Drawer.Header hasTab>
        <Drawer.Title>{accountGroup?.name ?? 'Account Group Details'}</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Tab>
        <Tabs value={activeTabId} onValueChange={handleTabChange}>
          <Tabs.Trigger value={AccountGroupDetailTab.Details}>Details</Tabs.Trigger>
          <Tabs.Trigger value={AccountGroupDetailTab.Trends}>Trends</Tabs.Trigger>
          <Tabs.Trigger value={AccountGroupDetailTab.History}>History</Tabs.Trigger>
        </Tabs>
      </Drawer.Tab>
      <If condition={isLoading}>
        <PageLoader />
      </If>
      <If condition={!isLoading && accountGroup}>
        <Drawer.Body>
          {activeTabId === AccountGroupDetailTab.Details && <DetailsTab accountGroup={accountGroup!} />}
          {activeTabId === AccountGroupDetailTab.Trends && <TrendsTab accountGroup={accountGroup!} />}
          {activeTabId === AccountGroupDetailTab.History && <HistoryTab accountGroup={accountGroup!} />}
        </Drawer.Body>
      </If>
    </>
  );
};
