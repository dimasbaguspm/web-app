import { useApiSpenicleCategoriesPaginatedQuery } from '@dimasbaguspm/hooks/use-api';
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
import { PlusIcon } from 'lucide-react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { CategoryCard } from './components';

const CategoriesPage = () => {
  const { openDrawer } = useDrawerRoute();

  const [categories, , { isLoading }] = useApiSpenicleCategoriesPaginatedQuery({
    pageSize: 15,
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
            <ButtonIcon
              as={PlusIcon}
              aria-label="New Category"
              onClick={handleOpenDrawer}
            />
          </ButtonGroup>
        }
      />
      <PageContent>
        <If condition={isLoading}>
          <LoadingIndicator type="bar" size="sm" />
        </If>

        <If condition={[categories, categories?.items]}>
          <div className="space-y-4">
            <ul className="grid grid-cols-1">
              {categories?.items.map((category) => (
                <li key={category.id} className="border-b border-border">
                  <CategoryCard
                    category={category}
                    onClick={handleCategoryClick}
                  />
                </li>
              ))}
            </ul>
          </div>
        </If>

        <If condition={[!isLoading, categories?.items.length === 0]}>
          <NoResults
            icon={PlusIcon}
            title="No categories yet"
            subtitle="Create your first category to start organizing your content"
            action={
              <ButtonGroup>
                <Button onClick={handleOpenDrawer}>
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
