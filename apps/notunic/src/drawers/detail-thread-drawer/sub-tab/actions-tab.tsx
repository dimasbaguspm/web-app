import { useApiNotunicCommentsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { CommentModel, SearchCommentsModel, ThreadModel } from '@dimasbaguspm/interfaces/notunic-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  ButtonMenu,
  ChipSingleInput,
  Drawer,
  Hr,
  Icon,
  NoResults,
  PageLoader,
} from '@dimasbaguspm/versaur';
import { ChevronDownIcon, FileCheckIcon, FileClockIcon, SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { CommentActionCard } from '../../../components/comment-action-card';
import { DRAWER_ROUTES } from '../../../constants/drawer-routes';

interface ActionsTabProps {
  thread: ThreadModel;
}

export const ActionsTab: FC<ActionsTabProps> = ({ thread }) => {
  const { openDrawer } = useDrawerRoute();
  const [actionStatus, setActionStatus] = useDebouncedState<SearchCommentsModel['actionStatus']>({
    defaultValue: 'todo',
    debounceTime: 0,
  });
  const [comments, , { isInitialFetching, hasNextPage, isFetchingNextPage }, { fetchNextPage }] =
    useApiNotunicCommentsInfiniteQuery({
      threadId: thread.id,
      actionStatus,
    });

  const handleOnCommentClick = (comment: CommentModel) => {
    if (!comment.action) return;
    openDrawer(DRAWER_ROUTES.EDIT_COMMENT_ACTION, { commentId: comment.id, commentActionId: comment.action.id });
  };

  return (
    <>
      <Drawer.Body>
        <ButtonGroup hasMargin alignment="between">
          <ButtonMenu
            label={
              <>
                <Icon as={ChevronDownIcon} size="sm" color="inherit" />
                All the time
              </>
            }
            variant="outline"
            size="sm"
          >
            <ButtonMenu.Item>All the time</ButtonMenu.Item>
            <ButtonMenu.Item>Overdue</ButtonMenu.Item>
            <ButtonMenu.Item>Last 7 days</ButtonMenu.Item>
            <ButtonMenu.Item>Last 30 days</ButtonMenu.Item>
          </ButtonMenu>
          <ChipSingleInput
            className="w-auto"
            name="actionStatus"
            value={actionStatus}
            onChange={(value) => setActionStatus(value as SearchCommentsModel['actionStatus'])}
            size="sm"
          >
            <ChipSingleInput.Option value="todo">
              <Icon as={FileClockIcon} size="sm" color="inherit" />
              To Do
            </ChipSingleInput.Option>
            <ChipSingleInput.Option value="done">
              <Icon as={FileCheckIcon} size="sm" color="inherit" />
              Done
            </ChipSingleInput.Option>
          </ChipSingleInput>
        </ButtonGroup>

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
