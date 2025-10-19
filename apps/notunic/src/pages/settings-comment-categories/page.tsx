import { useApiNotunicCommentCategoriesInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { CommentCategoryModel } from '@dimasbaguspm/interfaces/notunic-api';
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

import { CommentCategoryCard } from '../../components/comment-category-card';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';

const SettingsCommentCategoriesPage = () => {
  const { openDrawer } = useDrawerRoute();

  const [commentCategories, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiNotunicCommentCategoriesInfiniteQuery({});

  const handleOnNewCategoryClick = () => {
    openDrawer(DRAWER_ROUTES.NEW_COMMENT_CATEGORY);
  };

  const handleOnCategoryClick = (commentCategoryId: CommentCategoryModel) => {
    openDrawer(DRAWER_ROUTES.MANAGE_COMMENT_CATEGORIES, { commentCategoryId: commentCategoryId.id });
  };

  return (
    <>
      <PageHeader
        title="Comment Categories"
        subtitle="Manage categories for organizing comments"
        size="wide"
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
      <PageContent size="wide">
        <If condition={isInitialFetching}>
          <PageLoader />
        </If>
        <If condition={!isInitialFetching}>
          <If condition={commentCategories.length === 0}>
            <NoResults
              icon={SearchXIcon}
              title="No Comment Categories"
              subtitle="You have not created any comment categories yet."
            />
          </If>
          <If condition={commentCategories.length > 0}>
            <ul className="flex flex-col gap-4 mb-4">
              {commentCategories.map((category, index) => (
                <li key={category.id}>
                  <CommentCategoryCard commentCategory={category} onClick={handleOnCategoryClick} />
                  {index !== commentCategories.length - 1 && <Hr />}
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

export default SettingsCommentCategoriesPage;
