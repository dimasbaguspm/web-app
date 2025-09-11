import { useApiHiAppsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { AppModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonMenu,
  FormLayout,
  Icon,
  NoResults,
  PageContent,
  PageHeader,
  PageLoader,
  SearchInput,
} from '@dimasbaguspm/versaur';
import { ChevronDown, HelpCircleIcon, SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { AppCard } from '../../components/app-card';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';

const MarketplacePage: FC = () => {
  const { isDesktop } = useWindowResize();
  const { openDrawer } = useDrawerRoute();
  const [searchTerm, setSearchTerm] = useDebouncedState<string>();

  const [apps, , { isInitialFetching, hasNextPage, isFetchingNextPage }, { fetchNextPage }] = useApiHiAppsInfiniteQuery(
    {
      search: searchTerm,
      pageSize: 15,
      sortBy: 'name',
      sortOrder: 'asc',
    },
  );

  const handleOnCardClick = (app: AppModel) => {
    openDrawer(DRAWER_ROUTES.DETAIL_APP, {
      appId: app.id,
    });
  };

  return (
    <>
      <PageHeader
        title="Marketplace"
        subtitle="Discover the available apps"
        actions={
          <ButtonGroup>
            <Button>
              <Icon as={HelpCircleIcon} size="sm" color="inherit" />
              Help
            </Button>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon as={HelpCircleIcon} aria-label="Help" />
          </ButtonGroup>
        }
      />

      <PageContent>
        <FormLayout className="mb-4">
          <FormLayout.Column span={isDesktop ? 4 : 12}>
            <SearchInput
              placeholder="Search"
              variant="neutral"
              defaultValue={searchTerm}
              onChange={(ev) => setSearchTerm(ev.target.value)}
            />
          </FormLayout.Column>
          <FormLayout.Column span={isDesktop ? 8 : 12}>
            <ButtonMenu
              variant="outline"
              label={
                <>
                  <Icon as={ChevronDown} size="sm" color="inherit" />
                  Type
                </>
              }
            >
              <ButtonMenu.Item>All Types</ButtonMenu.Item>
              <ButtonMenu.Item>Personal</ButtonMenu.Item>
              <ButtonMenu.Item>Organization</ButtonMenu.Item>
            </ButtonMenu>
          </FormLayout.Column>
        </FormLayout>

        <If condition={isInitialFetching}>
          <PageLoader />
        </If>
        <If condition={[!isInitialFetching, apps.length]}>
          <ul className="mb-4">
            {apps.map((app) => (
              <li key={app.id}>
                <AppCard app={app} onClick={handleOnCardClick} />
              </li>
            ))}
          </ul>
          <If condition={hasNextPage}>
            <ButtonGroup alignment="center">
              <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} variant="outline">
                Load More
              </Button>
            </ButtonGroup>
          </If>
        </If>
        <If condition={[!isInitialFetching, !apps.length]}>
          <NoResults
            icon={SearchXIcon}
            title="No apps found"
            subtitle="Try adjusting your search criteria, or check back later for new apps"
          />
        </If>
      </PageContent>
    </>
  );
};

export default MarketplacePage;
