import { useApiSpenicleCategoriesInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { CategoryModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  FormLayout,
  Icon,
  NoResults,
  PageContent,
  PageHeader,
  PageLoader,
  SearchInput,
} from '@dimasbaguspm/versaur';
import { FoldersIcon, PlusIcon, SearchXIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

import { CategoryCard } from '../../components/category-card';
import { CategoryFiltersControl } from '../../components/category-filter-control';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { DEEP_LINKS } from '../../constants/page-routes';
import { useCategoryFilter } from '../../hooks/use-category-filter';

const CategoriesPage = () => {
  const { openDrawer } = useDrawerRoute();
  const navigate = useNavigate();
  const { isDesktop } = useWindowResize();

  const [debouncedSearch, setDebouncedSearch] = useDebouncedState<string>({
    adapter: 'url',
    urlKey: 'q',
  });
  const categoryFilter = useCategoryFilter({ adapter: 'url' });

  const [categories, , { isInitialFetching, hasNextPage, isFetchingNextPage }, { fetchNextPage }] =
    useApiSpenicleCategoriesInfiniteQuery({
      pageSize: 15,
      search: debouncedSearch,
      type: categoryFilter.appliedFilters.type,
      categoryGroupIds: categoryFilter.appliedFilters.groupId,
    });

  const handleOpenDrawer = () => {
    openDrawer(DRAWER_ROUTES.NEW_CATEGORY);
  };

  const handleCategoryClick = (category: CategoryModel) => {
    openDrawer(DRAWER_ROUTES.DETAIL_CATEGORY, { categoryId: category.id });
  };

  const handleManageGroupClick = () => {
    navigate(DEEP_LINKS.SETTINGS_CATEGORY_GROUPS.path);
  };
  return (
    <>
      <PageHeader
        title="Categories"
        subtitle="Manage your categories"
        size="wide"
        actions={
          <ButtonGroup>
            <Button variant="outline" aria-label="Manage Groups" onClick={handleManageGroupClick}>
              <Icon as={FoldersIcon} color="inherit" size="sm" />
              Manage Group
            </Button>
            <Button onClick={handleOpenDrawer}>
              <Icon as={PlusIcon} color="inherit" size="sm" />
              New Category
            </Button>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon
              as={FoldersIcon}
              variant="outline"
              aria-label="Manage Groups"
              onClick={handleManageGroupClick}
            />
            <ButtonIcon as={PlusIcon} aria-label="New Category" onClick={handleOpenDrawer} />
          </ButtonGroup>
        }
      />
      <PageContent size="wide">
        <FormLayout>
          <FormLayout.Column span={isDesktop ? 4 : 12}>
            <SearchInput defaultValue={debouncedSearch} onChange={(ev) => setDebouncedSearch(ev.target.value)} />
          </FormLayout.Column>
          <FormLayout.Column span={isDesktop ? 8 : 12}>
            <CategoryFiltersControl config={categoryFilter} />
          </FormLayout.Column>
        </FormLayout>

        <If condition={isInitialFetching}>
          <PageLoader />
        </If>

        <If condition={[!isInitialFetching, categories]}>
          <ul className="mb-4">
            {categories?.map((category) => (
              <li key={category.id} className="border-b border-border">
                <CategoryCard category={category} onClick={handleCategoryClick} />
              </li>
            ))}
          </ul>
          <If condition={hasNextPage}>
            <ButtonGroup alignment="center">
              <Button onClick={() => fetchNextPage()} variant="outline" disabled={isFetchingNextPage}>
                Load More
              </Button>
            </ButtonGroup>
          </If>
        </If>

        <If condition={[!isInitialFetching, categories.length === 0]}>
          <NoResults
            icon={SearchXIcon}
            title="No categories yet"
            subtitle="Create your first category to start organizing your content"
            action={
              <ButtonGroup>
                <Button onClick={handleOpenDrawer} variant="outline">
                  <Icon as={PlusIcon} color="inherit" />
                  Create Category
                </Button>
              </ButtonGroup>
            }
          />
        </If>
      </PageContent>
    </>
  );
};

export default CategoriesPage;
