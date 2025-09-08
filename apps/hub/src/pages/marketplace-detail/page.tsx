import { useApiHiAppQuery } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import {
  Badge,
  BadgeGroup,
  Button,
  ButtonGroup,
  ButtonIcon,
  Icon,
  PageContent,
  PageHeader,
  Tabs,
} from '@dimasbaguspm/versaur';
import { DownloadIcon, ExternalLinkIcon } from 'lucide-react';
import { Outlet, useParams } from 'react-router';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

const MarketplaceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { openDrawer } = useDrawerRoute();

  const [app] = useApiHiAppQuery(+id!, {
    enabled: !!id,
  });

  const onInstallClick = () => {
    openDrawer(DRAWER_ROUTES.APP_PROFILE_CREATION, {
      appId: app?.id ?? 0,
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
          <BadgeGroup>
            <Badge>Free</Badge>
            <Badge color="secondary">Beta</Badge>
          </BadgeGroup>
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
        mobileActions={
          <ButtonGroup>
            <ButtonIcon variant="outline" as={ExternalLinkIcon} aria-label="Open" onClick={handleOnOpen} />
            <ButtonIcon as={DownloadIcon} aria-label="Install" onClick={onInstallClick} />
          </ButtonGroup>
        }
        tabs={
          <Tabs value="overview" onValueChange={(value) => console.log(value)}>
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="profiles">Profiles</Tabs.Trigger>
            <Tabs.Trigger value="usage">Usage</Tabs.Trigger>
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
