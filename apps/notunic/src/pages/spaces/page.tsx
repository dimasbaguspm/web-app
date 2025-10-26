import { useApiNotunicSpacesInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { SpaceModel } from '@dimasbaguspm/interfaces/notunic-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  FormLayout,
  Hr,
  Icon,
  NoResults,
  PageContent,
  PageHeader,
  PageLayout,
  PageLoader,
  SearchInput,
} from '@dimasbaguspm/versaur';
import { PlusIcon, SearchXIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

import { SpaceCard } from '../../components/space-card';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { DEEP_LINKS } from '../../constants/page-routes';

const SpacePage = () => {
  const { isDesktop } = useWindowResize();
  const { openDrawer } = useDrawerRoute();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useDebouncedState<string>();

  const [spaces, , { isInitialFetching, hasNextPage, isFetchingNextPage }, { fetchNextPage }] =
    useApiNotunicSpacesInfiniteQuery({
      name: searchTerm,
      pageSize: 15,
    });

  const handleOpenNewSpace = () => {
    openDrawer(DRAWER_ROUTES.NEW_SPACE);
  };

  const handleOnSpaceCardClick = (space: SpaceModel) => {
    navigate(DEEP_LINKS.SPACES_DETAIL.path(space.id.toString()));
  };

  return (
    <PageLayout>
      <PageLayout.HeaderRegion>
        <PageHeader
          title="Spaces"
          subtitle="All your spaces in one place"
          size="wide"
          actions={
            <ButtonGroup>
              <Button onClick={handleOpenNewSpace}>
                <Icon as={PlusIcon} color="inherit" size="sm" />
                New Space
              </Button>
            </ButtonGroup>
          }
          mobileActions={
            <ButtonGroup>
              <ButtonIcon as={PlusIcon} aria-label="New Space" onClick={handleOpenNewSpace} />
            </ButtonGroup>
          }
        />
      </PageLayout.HeaderRegion>
      <PageLayout.ContentRegion>
        <PageContent size="wide">
          <FormLayout className="mb-4">
            <FormLayout.Column span={isDesktop ? 4 : 12}>
              <SearchInput
                defaultValue={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search spaces..."
              />
            </FormLayout.Column>
          </FormLayout>

          <If condition={isInitialFetching}>
            <PageLoader />
          </If>

          <If condition={[!isInitialFetching, spaces.length]}>
            <ul className="mb-4">
              {spaces?.map((space, index) => {
                const isLast = index === spaces.length - 1;
                return (
                  <li key={space.id}>
                    <SpaceCard space={space} onClick={handleOnSpaceCardClick} />
                    {!isLast && <Hr />}
                  </li>
                );
              })}
            </ul>
            <If condition={hasNextPage}>
              <ButtonGroup alignment="center">
                <Button onClick={() => fetchNextPage()} variant="outline" disabled={isFetchingNextPage}>
                  Load More
                </Button>
              </ButtonGroup>
            </If>
          </If>

          <If condition={[!isInitialFetching, !spaces.length]}>
            <NoResults
              icon={SearchXIcon}
              title="No spaces found"
              subtitle="Create a new space to get started"
              action={
                <ButtonGroup>
                  <Button variant="outline" onClick={handleOpenNewSpace}>
                    <Icon as={PlusIcon} color="inherit" size="sm" />
                    New Space
                  </Button>
                </ButtonGroup>
              }
            />
          </If>
        </PageContent>
      </PageLayout.ContentRegion>
    </PageLayout>
  );
};

export default SpacePage;
