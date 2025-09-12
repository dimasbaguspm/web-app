import { useApiSpenicleAccountGroupQuery } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Drawer, PageLoader, Tabs } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { HistoryTab } from './sub-tabs/history-tab';
import { OverviewTab } from './sub-tabs/overview-tab';
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

  const activeTabId = tabId || 'overview';

  const handleTabChange = (tabId: string) => {
    openDrawer(DRAWER_ROUTES.DETAIL_ACCOUNT_GROUP, { accountGroupId, tabId });
  };

  return (
    <>
      <Drawer.Header hasTab>
        <Drawer.Title>{accountGroup?.name ?? 'Account Group Details'}</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Tab>
        <Tabs value={activeTabId} onValueChange={handleTabChange}>
          <Tabs.Trigger value={AccountGroupDetailTab.Overview}>Overview</Tabs.Trigger>
          <Tabs.Trigger value={AccountGroupDetailTab.Trends}>Trends</Tabs.Trigger>
          <Tabs.Trigger value={AccountGroupDetailTab.History}>History</Tabs.Trigger>
        </Tabs>
      </Drawer.Tab>
      <If condition={isLoading}>
        <PageLoader />
      </If>
      <If condition={!isLoading && accountGroup}>
        <Drawer.Body>
          {activeTabId === AccountGroupDetailTab.Overview && <OverviewTab accountGroup={accountGroup!} />}
          {activeTabId === AccountGroupDetailTab.Trends && <TrendsTab accountGroup={accountGroup!} />}
          {activeTabId === AccountGroupDetailTab.History && <HistoryTab accountGroup={accountGroup!} />}
        </Drawer.Body>
      </If>
    </>
  );
};
