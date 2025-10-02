import { useApiNotunicSpaceQuery } from '@dimasbaguspm/hooks/use-api';
import { SpaceModel } from '@dimasbaguspm/interfaces/notunic-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatNotunicSpace } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonMenuIcon,
  Icon,
  NoResults,
  PageHeader,
  PageLoader,
  Tabs,
} from '@dimasbaguspm/versaur';
import { BoltIcon, PlusIcon, SearchXIcon } from 'lucide-react';
import { FC } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { DEEP_LINKS } from '../../constants/page-routes';

import { SpaceDetailTab } from './types';

interface SpacesDetailPageProps {
  space: SpaceModel;
}

const SpacesDetailPage: FC<SpacesDetailPageProps> = ({ space }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { openDrawer } = useDrawerRoute();
  const { name, trimmedDescription } = formatNotunicSpace(space);

  const currentTab = (() => {
    switch (pathname) {
      case DEEP_LINKS.SPACES_DETAIL.path(space.id.toString()):
        return SpaceDetailTab.Threads;
      case DEEP_LINKS.SPACES_DETAIL_ACTIONS.path(space.id.toString()):
        return SpaceDetailTab.Actions;
      default:
        return SpaceDetailTab.Threads;
    }
  })();

  const handleTabChange = (value: string) => {
    let url: string = '';

    switch (value) {
      case SpaceDetailTab.Threads:
        url = DEEP_LINKS.SPACES_DETAIL.path(space.id.toString());
        break;
      case SpaceDetailTab.Actions:
        url = DEEP_LINKS.SPACES_DETAIL_ACTIONS.path(space.id.toString());
        break;
      default:
        url = DEEP_LINKS.SPACES_DETAIL.path(space.id.toString());
        break;
    }
    navigate(url);
  };

  const handleOnEditClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_SPACE, { spaceId: space.id });
  };

  const handleOnPlusClick = () => {
    openDrawer(DRAWER_ROUTES.NEW_THREAD, { spaceId: space.id });
  };

  const handleOnThreadGroupsClick = () => {
    openDrawer(DRAWER_ROUTES.MANAGE_THREAD_GROUPS, { spaceId: space.id });
  };

  return (
    <>
      <PageHeader
        title={name}
        subtitle={trimmedDescription}
        tabs={
          <Tabs value={currentTab} onValueChange={handleTabChange}>
            <Tabs.Trigger value={SpaceDetailTab.Threads}>Threads</Tabs.Trigger>
            <Tabs.Trigger value={SpaceDetailTab.Actions}>Actions</Tabs.Trigger>
          </Tabs>
        }
        actions={
          <ButtonGroup>
            <Button onClick={handleOnPlusClick}>
              <Icon as={PlusIcon} color="inherit" size="sm" />
              New Thread
            </Button>
            <ButtonMenuIcon as={BoltIcon} aria-label="More Options" variant="outline">
              <ButtonMenuIcon.Item onClick={() => {}}>Search</ButtonMenuIcon.Item>
              <ButtonMenuIcon.Item onClick={handleOnThreadGroupsClick}>Thread Groups</ButtonMenuIcon.Item>
              <ButtonMenuIcon.Item onClick={handleOnEditClick}>Edit Space</ButtonMenuIcon.Item>
            </ButtonMenuIcon>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon as={PlusIcon} aria-label="New Thread" onClick={handleOnPlusClick} />
            <ButtonMenuIcon as={BoltIcon} aria-label="More Options" variant="outline">
              <ButtonMenuIcon.Item onClick={() => {}}>Search</ButtonMenuIcon.Item>
              <ButtonMenuIcon.Item onClick={handleOnThreadGroupsClick}>Thread Groups</ButtonMenuIcon.Item>
              <ButtonMenuIcon.Item onClick={handleOnEditClick}>Edit</ButtonMenuIcon.Item>
            </ButtonMenuIcon>
          </ButtonGroup>
        }
      />
      <Outlet />
    </>
  );
};

const SpaceDetailPageWrapper = () => {
  const { id } = useParams<{ id: string }>();

  const [space, , { isLoading }] = useApiNotunicSpaceQuery(id ? parseInt(id, 10) : 0);

  return (
    <>
      <If condition={[isLoading, !space]}>
        <PageLoader />
      </If>
      <If condition={[!isLoading, !space]}>
        <NoResults
          icon={SearchXIcon}
          title="Space not found"
          subtitle="The space you are looking for does not exist."
        />
      </If>
      <If condition={[!isLoading, space]}>
        <SpacesDetailPage space={space!} />
      </If>
    </>
  );
};

export default SpaceDetailPageWrapper;
