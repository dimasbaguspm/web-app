import { useApiSpenicleCategoryGroupsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  Hr,
  Icon,
  LoadingIndicator,
  NoResults,
  PageContent,
  PageHeader,
  SearchInput,
} from '@dimasbaguspm/versaur';
import { PlusIcon, SearchXIcon } from 'lucide-react';
import { useState } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { CategoryGroupCard } from './components/category-group-card';

const SettingsCategoryGroupsPage = () => {
  const { openDrawer } = useDrawerRoute();

  const [categoryGroupSearch, setCategoryGroupSearch] = useState('');

  const [categoryGroups, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiSpenicleCategoryGroupsInfiniteQuery({
      search: categoryGroupSearch,
      pageSize: 15,
    });

  const handleNewCategoryGroup = () => {
    openDrawer(DRAWER_ROUTES.NEW_CATEGORY_GROUP);
  };

  return (
    <>
      <PageHeader
        title="Category Groups"
        subtitle="Manage your category groups to organize your categories"
        actions={
          <ButtonGroup>
            <Button onClick={handleNewCategoryGroup}>
              <Icon as={PlusIcon} color="inherit" size="sm" />
              New Group
            </Button>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon as={PlusIcon} aria-label="Create category group" onClick={handleNewCategoryGroup} />
          </ButtonGroup>
        }
      />

      <PageContent>
        <SearchInput
          placeholder="Search category groups..."
          value={categoryGroupSearch}
          onChange={(e) => setCategoryGroupSearch(e.target.value)}
          className="mb-4"
        />

        <div className="space-y-4">
          <If condition={isInitialFetching}>
            <LoadingIndicator size="sm" type="bar" />
          </If>
          <If condition={[!isInitialFetching, categoryGroups.length === 0]}>
            <NoResults
              icon={SearchXIcon}
              title="No category groups found"
              subtitle={
                categoryGroupSearch
                  ? 'Try adjusting your search terms'
                  : 'Create your first category group to organize your categories'
              }
              action={
                <ButtonGroup>
                  <Button variant="outline" onClick={handleNewCategoryGroup}>
                    Create
                  </Button>
                </ButtonGroup>
              }
            />
          </If>
          <If condition={[!isInitialFetching, categoryGroups.length > 0]}>
            <ul>
              {categoryGroups.map((categoryGroup, index) => {
                const isLastItem = index === categoryGroups.length - 1;
                return (
                  <li key={categoryGroup.id}>
                    <CategoryGroupCard categoryGroup={categoryGroup} />
                    {!isLastItem && <Hr />}
                  </li>
                );
              })}
            </ul>
            <If condition={hasNextPage}>
              <ButtonGroup>
                <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                  Load More
                </Button>
              </ButtonGroup>
            </If>
          </If>
        </div>
      </PageContent>
    </>
  );
};

export default SettingsCategoryGroupsPage;
