import { useApiNotunicThreadCategoriesInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { ThreadCategoryModel } from '@dimasbaguspm/interfaces/notunic-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  Hr,
  Icon,
  NoResults,
  PageContent,
  PageHeader,
  PageLoader,
} from '@dimasbaguspm/versaur';
import { PlusIcon, SearchXIcon } from 'lucide-react';

import { ThreadCategoryCard } from '../../components/thread-category-card';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';

const SettingsThreadCategoriesPage = () => {
  const { openDrawer } = useDrawerRoute();

  const [threadCategories, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiNotunicThreadCategoriesInfiniteQuery({});

  const handleOnNewCategoryClick = () => {
    openDrawer(DRAWER_ROUTES.NEW_THREAD_CATEGORY);
  };

  const handleOnCategoryClick = (threadCategoryId: ThreadCategoryModel) => {
    openDrawer(DRAWER_ROUTES.MANAGE_THREAD_CATEGORIES, { threadCategoryId: threadCategoryId.id });
  };

  return (
    <>
      <PageHeader
        title="Thread Categories"
        subtitle="Manage categories for organizing threads"
        actions={
          <ButtonGroup>
            <Button variant="primary" onClick={handleOnNewCategoryClick}>
              <Icon as={PlusIcon} size="sm" color="inherit" />
              New Category
            </Button>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon as={PlusIcon} variant="primary" aria-label="New Category" onClick={handleOnNewCategoryClick} />
          </ButtonGroup>
        }
      />
      <PageContent>
        <If condition={isInitialFetching}>
          <PageLoader />
        </If>
        <If condition={!isInitialFetching}>
          <If condition={threadCategories.length === 0}>
            <NoResults
              icon={SearchXIcon}
              title="No Thread Categories"
              subtitle="You have not created any thread categories yet."
            />
          </If>
          <If condition={threadCategories.length > 0}>
            <ul className="flex flex-col gap-4 mb-4">
              {threadCategories.map((category, index) => (
                <li key={category.id}>
                  <ThreadCategoryCard threadCategory={category} onClick={handleOnCategoryClick} />
                  {index !== threadCategories.length - 1 && <Hr />}
                </li>
              ))}
            </ul>
            <If condition={hasNextPage}>
              <ButtonGroup alignment="center">
                <Button variant="outline" disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
                  Load More
                </Button>
              </ButtonGroup>
            </If>
          </If>
        </If>
      </PageContent>
    </>
  );
};

export default SettingsThreadCategoriesPage;
