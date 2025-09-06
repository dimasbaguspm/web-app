import { useApiSpenicleCategoriesInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { CategoryModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  Icon,
  NoResults,
  PageContent,
  PageHeader,
  PageLoader,
} from '@dimasbaguspm/versaur';
import { BoltIcon, PlusIcon, SearchXIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

import { CategoryCard } from '../../components/category-card';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { DEEP_LINKS } from '../../constants/page-routes';

import { ActionsControl } from './components/actions-control';
import { FilterControl } from './components/filter-control';
import { useCategoryFilter } from './hooks/use-category-filter';

const CategoriesPage = () => {
  const { openDrawer } = useDrawerRoute();
  const navigate = useNavigate();

  const { appliedFilters } = useCategoryFilter();

  const [categories, , { isInitialFetching, hasNextPage, isFetchingNextPage }, { fetchNextPage }] =
    useApiSpenicleCategoriesInfiniteQuery({
      pageSize: 15,
      search: appliedFilters.q,
      type: appliedFilters.type,
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
        actions={
          <ButtonGroup>
            <Button variant="outline" aria-label="Manage Groups" onClick={handleManageGroupClick}>
              <Icon as={BoltIcon} color="inherit" size="sm" />
              Manage Group
            </Button>
            <Button onClick={handleOpenDrawer}>
              <Icon as={PlusIcon} color="inherit" />
              New Category
            </Button>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon as={BoltIcon} variant="outline" aria-label="Manage Groups" onClick={handleManageGroupClick} />
            <ButtonIcon as={PlusIcon} aria-label="New Category" onClick={handleOpenDrawer} />
          </ButtonGroup>
        }
      />
      <PageContent>
        <If condition={isInitialFetching}>
          <PageLoader />
        </If>

        <If condition={[!isInitialFetching, categories]}>
          <ActionsControl />
          <FilterControl />

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
