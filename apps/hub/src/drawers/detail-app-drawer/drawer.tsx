import { useApiHiAppQuery } from '@dimasbaguspm/hooks/use-api';
import { If } from '@dimasbaguspm/utils/if';
import { Drawer, NoResults, PageLoader, Tabs } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

interface DetailAppDrawerProps {
  appId: number;
}

export const DetailAppDrawer: FC<DetailAppDrawerProps> = ({ appId }) => {
  const [app, , { isLoading }] = useApiHiAppQuery(appId, {
    enabled: Boolean(appId && appId > 0),
  });

  return (
    <>
      <Drawer.Header hasTab>
        <Drawer.Title>{app?.name} App</Drawer.Title>
      </Drawer.Header>
      <Drawer.Tab>
        <Tabs value="overview" onValueChange={() => {}}>
          <Tabs.Trigger value="overview">Details</Tabs.Trigger>
          <Tabs.Trigger value="reviews">Profiles</Tabs.Trigger>
          <Tabs.Trigger value="support">Usage</Tabs.Trigger>
        </Tabs>
      </Drawer.Tab>
      <Drawer.Body>
        <If condition={isLoading}>
          <PageLoader />
        </If>
        <If condition={[!isLoading, app]}>
          <p>Change Log</p>
        </If>
        <If condition={[!isLoading, !app]}>
          <NoResults icon={SearchXIcon} title="App not found" subtitle="The app you are looking for does not exist." />
        </If>
      </Drawer.Body>
    </>
  );
};
