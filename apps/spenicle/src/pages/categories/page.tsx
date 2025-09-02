import { useApiSpenicleCategoriesInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { CategoryModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  Icon,
  LoadingIndicator,
  NoResults,
  PageContent,
  PageHeader,
} from '@dimasbaguspm/versaur';
import { PlusIcon, SearchXIcon } from 'lucide-react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { CategoryCard } from './components';
import { ActionsControl } from './components/actions-control';
import { FilterControl } from './components/filter-control';
import { useCategoryFilter } from './hooks/use-category-filter';

const CategoriesPage = () => {
  const { openDrawer } = useDrawerRoute();

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

  return (
    <>
      <PageHeader
        title="Categories"
        subtitle="Manage your categories"
        actions={
          <ButtonGroup>
            <Button onClick={handleOpenDrawer}>
              <Icon as={PlusIcon} color="inherit" />
              New Category
            </Button>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon as={PlusIcon} aria-label="New Category" onClick={handleOpenDrawer} />
          </ButtonGroup>
        }
      />
      <PageContent>
        <If condition={isInitialFetching}>
          <LoadingIndicator type="bar" size="sm" />
        </If>

        <If condition={[categories]}>
          <ActionsControl />
          <FilterControl />

          <div className="space-y-4">
            <ul className="grid grid-cols-1 mb-4">
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
          </div>
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
