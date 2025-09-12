import { useApiSpenicleCategoryGroupQuery } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Drawer, PageLoader, Tabs } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { HistoryTab } from './sub-tabs/history-tab';
import { OverviewTab } from './sub-tabs/overview-tab';
import { TrendsTab } from './sub-tabs/trends-tab';
import { CategoryGroupDetailTab } from './types';

interface DetailCategoryGroupDrawerProps {
  categoryGroupId: number;
  tabId?: string;
}

export const DetailCategoryGroupDrawer: FC<DetailCategoryGroupDrawerProps> = ({ categoryGroupId, tabId }) => {
  const { openDrawer } = useDrawerRoute();

  const [categoryGroup, , { isLoading }] = useApiSpenicleCategoryGroupQuery(categoryGroupId, {
    enabled: Boolean(categoryGroupId),
  });

  const activeTabId = tabId || 'overview';

  const handleTabChange = (tabId: string) => {
    openDrawer(DRAWER_ROUTES.DETAIL_ACCOUNT_GROUP, { categoryGroupId, tabId });
  };

  return (
    <>
      <Drawer.Header hasTab>
        <Drawer.Title>{categoryGroup?.name ?? 'Category Group Details'}</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Tab>
        <Tabs value={activeTabId} onValueChange={handleTabChange}>
          <Tabs.Trigger value={CategoryGroupDetailTab.Overview}>Overview</Tabs.Trigger>
          <Tabs.Trigger value={CategoryGroupDetailTab.Trends}>Trends</Tabs.Trigger>
          <Tabs.Trigger value={CategoryGroupDetailTab.History}>History</Tabs.Trigger>
        </Tabs>
      </Drawer.Tab>
      <If condition={isLoading}>
        <PageLoader />
      </If>
      <If condition={!isLoading && categoryGroup}>
        <Drawer.Body>
          {activeTabId === CategoryGroupDetailTab.Overview && <OverviewTab categoryGroup={categoryGroup!} />}
          {activeTabId === CategoryGroupDetailTab.Trends && <TrendsTab categoryGroup={categoryGroup!} />}
          {activeTabId === CategoryGroupDetailTab.History && <HistoryTab categoryGroup={categoryGroup!} />}
        </Drawer.Body>
      </If>
    </>
  );
};
