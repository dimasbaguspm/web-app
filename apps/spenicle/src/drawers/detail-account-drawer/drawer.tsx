import { useApiSpenicleAccountQuery } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatSpenicleAccount } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { Drawer, PageLoader, Tabs } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { DetailsTab } from './sub-tabs/details-tab';
import { HistoryTab } from './sub-tabs/history-tab';
import { TrendsTab } from './sub-tabs/trends-tab';

interface DetailAccountDrawerProps {
  accountId: number;
  tabId?: string;
}

export const DetailAccountDrawer: FC<DetailAccountDrawerProps> = ({ accountId, tabId }) => {
  const { openDrawer } = useDrawerRoute();
  const activeTab = tabId || 'details';

  const [account, , { isLoading }] = useApiSpenicleAccountQuery(accountId);

  const { name } = formatSpenicleAccount(account);

  const handleOnTabChange = (tabId: string) => {
    openDrawer(
      DRAWER_ROUTES.ACCOUNT_DETAIL,
      { accountId, tabId },
      {
        replace: true,
      },
    );
  };

  return (
    <>
      <Drawer.Header hasTab>
        <Drawer.Title>{isLoading ? 'Loading...' : name}</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Tab>
        <Tabs value={activeTab} onValueChange={handleOnTabChange}>
          <Tabs.Trigger value="details">Details</Tabs.Trigger>
          <Tabs.Trigger value="trends">Trends</Tabs.Trigger>
          <Tabs.Trigger value="history">History</Tabs.Trigger>
        </Tabs>
      </Drawer.Tab>

      <If condition={isLoading}>
        <PageLoader />
      </If>

      <If condition={[!isLoading, account]}>
        <Drawer.Body>
          {activeTab === 'details' && <DetailsTab data={account!} />}
          {activeTab === 'trends' && <TrendsTab data={account!} />}
          {activeTab === 'history' && <HistoryTab data={account!} />}
        </Drawer.Body>
      </If>
    </>
  );
};
