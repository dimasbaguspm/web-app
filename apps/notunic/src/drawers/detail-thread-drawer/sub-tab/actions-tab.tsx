import { useApiNotunicCommentsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { CommentModel, ThreadModel } from '@dimasbaguspm/interfaces/notunic-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, Hr, NoResults, PageLoader } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { CommentActionCard } from '../../../components/comment-action-card';
import { CommentActionFiltersControl } from '../../../components/comment-action-filter-control';
import { DRAWER_ROUTES } from '../../../constants/drawer-routes';
import { useCommentActionFilter } from '../../../hooks/use-comment-action-filter';

interface ActionsTabProps {
  thread: ThreadModel;
}

export const ActionsTab: FC<ActionsTabProps> = ({ thread }) => {
  const { openDrawer } = useDrawerRoute();
  const config = useCommentActionFilter({ adapter: 'state' });

  const [comments, , { isInitialFetching, hasNextPage, isFetchingNextPage }, { fetchNextPage }] =
    useApiNotunicCommentsInfiniteQuery({
      threadId: [thread.id],
      actionStatus: config.appliedFilters.status,
    });

  const handleOnCommentClick = (comment: CommentModel) => {
    if (!comment.action) return;
    openDrawer(DRAWER_ROUTES.EDIT_COMMENT_ACTION, { commentId: comment.id, commentActionId: comment.action.id });
  };

  return (
    <>
      <Drawer.Body>
        <CommentActionFiltersControl config={config} />

        <If condition={isInitialFetching}>
          <PageLoader />
        </If>
        <If condition={!isInitialFetching}>
          <If condition={comments.length === 0}>
            <NoResults icon={SearchXIcon} title="No Actions Found" subtitle="There are no actions for this thread." />
          </If>
          <If condition={comments.length > 0}>
            <ul className="flex flex-col gap-4 mb-4">
              {comments.map((comment, index) => {
                const isLastItem = index === comments.length - 1;

                return (
                  <li key={comment.id} className="flex flex-col space-y-4">
                    <CommentActionCard comment={comment} onClick={handleOnCommentClick} />
                    {!isLastItem && <Hr />}
                  </li>
                );
              })}
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
      </Drawer.Body>
    </>
  );
};
