import { useApiHiAppQuery } from '@dimasbaguspm/hooks/use-api';
import {
  Badge,
  Button,
  ButtonGroup,
  Icon,
  PageContent,
  PageHeader,
  Tabs,
} from '@dimasbaguspm/versaur';
import { DownloadIcon, ExternalLinkIcon } from 'lucide-react';
import { FC } from 'react';
import { Outlet, useParams } from 'react-router';

import { useDrawerRoute } from '../../hooks/use-drawer-route';

const MarketplaceDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { handleOpenDrawer } = useDrawerRoute();

  const [app] = useApiHiAppQuery(+id!, {
    enabled: !!id,
  });

  const onInstallClick = () => {
    handleOpenDrawer('APP_PROFILE_CREATION', {
      appId: app?.id,
    });
  };

  const handleOnOpen = () => {
    window.open(app?.url, '_blank');
  };

  return (
    <>
      <PageHeader
        title={app?.name}
        subtitle={app?.description}
        badges={
          <>
            <Badge>Free</Badge>
            <Badge color="secondary">Beta</Badge>
            <Badge>v1.0.0</Badge>
          </>
        }
        actions={
          <ButtonGroup>
            <Button variant="outline" onClick={handleOnOpen}>
              <Icon as={ExternalLinkIcon} color="inherit" size="sm" />
              Open
            </Button>
            <Button variant="outline" onClick={onInstallClick}>
              <Icon as={DownloadIcon} color="inherit" size="sm" />
              Install
            </Button>
          </ButtonGroup>
        }
        tabs={
          <Tabs value="overview" onValueChange={(value) => console.log(value)}>
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="usage">Usage</Tabs.Trigger>
            <Tabs.Trigger value="review">Review</Tabs.Trigger>
          </Tabs>
        }
      />
      <PageContent>
        <Outlet />
      </PageContent>
    </>
  );
};

export default MarketplaceDetailPage;
