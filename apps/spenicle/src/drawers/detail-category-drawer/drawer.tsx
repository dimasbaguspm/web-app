import { useApiSpenicleCategoryQuery } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatSpenicleCategory } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { Drawer, LoadingIndicator, NoResults, Tabs } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { DetailsTab } from './sub-tabs/details-tab';
import { HistoryTab } from './sub-tabs/history-tab';
import { TrendsTab } from './sub-tabs/trends-tab';

interface DetailCategoryDrawerProps {
  categoryId: number;
  tabId?: string;
}

export const DetailCategoryDrawer: FC<DetailCategoryDrawerProps> = ({ categoryId, tabId }) => {
  const { openDrawer } = useDrawerRoute();
  const activeTab = tabId || 'details';
  const [category, , { isFetching }] = useApiSpenicleCategoryQuery(categoryId);

  const { name } = formatSpenicleCategory(category);

  const handleOnTabChange = (tabId: string) => {
    openDrawer(
      DRAWER_ROUTES.DETAIL_CATEGORY,
      { categoryId, tabId },
      {
        replace: true,
      },
    );
  };

  return (
    <>
      <Drawer.Header hasTab>
        <Drawer.Title>{isFetching ? 'Loading...' : name}</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Tab>
        <Tabs value={activeTab} onValueChange={handleOnTabChange}>
          <Tabs.Trigger value="details">Details</Tabs.Trigger>
          <Tabs.Trigger value="trends">Trends</Tabs.Trigger>
          <Tabs.Trigger value="history">History</Tabs.Trigger>
        </Tabs>
      </Drawer.Tab>

      <If condition={isFetching}>
        <LoadingIndicator type="bar" size="sm" />
      </If>

      <If condition={[!isFetching, !category]}>
        <NoResults title="No Category Found" icon={SearchXIcon} />
      </If>

      <If condition={[!isFetching, category]}>
        <Drawer.Body>
          {activeTab === 'details' && <DetailsTab data={category!} />}
          {activeTab === 'trends' && <TrendsTab data={category!} />}
          {activeTab === 'history' && <HistoryTab data={category!} />}
        </Drawer.Body>
      </If>
    </>
  );
};
