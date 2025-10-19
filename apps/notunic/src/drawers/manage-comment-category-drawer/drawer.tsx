import { useApiNotunicCommentCategoryQuery, useApiNotunicCommentsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatNotunicCommentCategory } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, Icon, NoResults, PageLoader } from '@dimasbaguspm/versaur';
import { BoltIcon, Edit2Icon, SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { CommentCard } from '../../components/comment-card';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';

interface ManageCommentCategoryDrawerProps {
  commentCategoryId: number;
}

export const ManageCommentCategoryDrawer: FC<ManageCommentCategoryDrawerProps> = ({ commentCategoryId }) => {
  const { openDrawer } = useDrawerRoute();
  const [commentCategory, , { isLoading: isCommentCategoryLoading }] =
    useApiNotunicCommentCategoryQuery(commentCategoryId);

  const [comments, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiNotunicCommentsInfiniteQuery(
      {
        id: commentCategory?.memberIds || [],
        pageSize: commentCategory?.memberIds.length || 15,
      },
      {
        enabled: Boolean(commentCategory?.memberIds.length),
      },
    );

  const handleOnEditClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_COMMENT_CATEGORY, { commentCategoryId });
  };

  const handleOnManageMembersClick = () => {
    openDrawer(DRAWER_ROUTES.MANAGE_COMMENT_CATEGORY_MEMBERS, { commentCategoryId });
  };

  const { name } = formatNotunicCommentCategory(commentCategory);
  const isLoading = isCommentCategoryLoading || isInitialFetching;

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Manage {name || 'Comment'} Category</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <If condition={isLoading}>
          <PageLoader />
        </If>
        <If condition={!isLoading}>
          <If condition={!commentCategory}>
            <NoResults
              icon={SearchXIcon}
              title="Comment category not found"
              subtitle="The comment category does not exist"
            />
          </If>
          <If condition={Boolean(commentCategory)}>
            <ButtonGroup hasMargin>
              <Button variant="outline" onClick={handleOnEditClick}>
                <Icon as={Edit2Icon} size="sm" color="inherit" />
                Edit
              </Button>
              <Button variant="outline" onClick={handleOnManageMembersClick}>
                <Icon as={BoltIcon} size="sm" color="inherit" />
                Manage Members
              </Button>
            </ButtonGroup>
            <If condition={comments.length === 0}>
              <NoResults
                icon={SearchXIcon}
                title="No members"
                subtitle="There are no members in this comment category"
              />
            </If>
            <If condition={comments.length > 0}>
              <ul className="mb-4">
                {comments.map((comment) => (
                  <li key={comment.id}>
                    <CommentCard comment={comment} hideActions hideHorizontalLine />
                  </li>
                ))}
              </ul>
              <If condition={hasNextPage}>
                <ButtonGroup alignment="center">
                  <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                    Load more
                  </Button>
                </ButtonGroup>
              </If>
            </If>
          </If>
        </If>
      </Drawer.Body>
    </>
  );
};
