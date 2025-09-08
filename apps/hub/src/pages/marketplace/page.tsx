import { useApiHiAppsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { AppModel } from '@dimasbaguspm/interfaces';
import { If } from '@dimasbaguspm/utils/if';
import {
  Brand,
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonMenu,
  Card,
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
import { useNavigate } from 'react-router';

import { DEEP_LINKS } from '../../constants/page-routes';

const MarketplacePage: FC = () => {
  const { isDesktop } = useWindowResize();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useDebouncedState<string>();

  const [apps, , { isInitialFetching }] = useApiHiAppsInfiniteQuery({
    search: searchTerm,
    pageSize: 15,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const handleOnCardClick = (app: AppModel) => {
    navigate(DEEP_LINKS.MARKETPLACE_DETAIL(app.id).path);
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
                <Card
                  title={app.name}
                  subtitle={app.description}
                  avatar={<Brand name="spenicle" shape="rounded" size="lg" />}
                  onClick={() => handleOnCardClick(app)}
                />
              </li>
            ))}
          </ul>
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
