import {
  useApiNotunicCommentQuery,
  useApiNotunicCommentsInfiniteQuery,
  useApiNotunicCreateComment,
  useApiNotunicUpdateComment,
} from '@dimasbaguspm/hooks/use-api';
import { CommentModel, ThreadModel } from '@dimasbaguspm/interfaces/notunic-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, NoResults, PageLoader } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { CommentCard } from '../../../components/comment-card';
import { ThreadCard } from '../../../components/thread-card';
import { DRAWER_ROUTES } from '../../../constants/drawer-routes';
import { MODAL_ROUTES } from '../../../constants/modal-routes';
import { ReplyBar } from '../components/reply-bar';
import { DetailThreadDrawerMode, DetailThreadFormSchema } from '../types';

interface CommentsTabProps {
  thread: ThreadModel;
  parentCommentId?: number | null;
}

export const CommentsTab: FC<CommentsTabProps> = ({ thread, parentCommentId = null }) => {
  const { openDrawer } = useDrawerRoute();
  const { openModal } = useModalRoute();

  const [mainComment, , { isLoading: isLoadingMainComment }] = useApiNotunicCommentQuery(parentCommentId ?? 0, {
    enabled: (parentCommentId ?? 0) > 0,
  });

  const [repliedComments, , { isLoading: isLoadingParentMainComment }] = useApiNotunicCommentsInfiniteQuery(
    {
      id: mainComment?.conversationCommentIds || [],
      sortBy: 'createdAt',
      sortOrder: 'asc',
      pageSize: 100,
    },
    {
      enabled: !!mainComment?.conversationCommentIds?.length,
    },
  );

  const form = useForm<DetailThreadFormSchema>({
    defaultValues: { mode: DetailThreadDrawerMode.CREATE },
  });

  const [createComment] = useApiNotunicCreateComment();
  const [updateComment] = useApiNotunicUpdateComment();

  const [comments, , { isInitialFetching, hasNextPage, isFetchingNextPage }, { fetchNextPage }] =
    useApiNotunicCommentsInfiniteQuery({
      threadId: [thread.id],
      isMainComment: parentCommentId ? false : true,
      parentCommentId: parentCommentId || undefined,
      sortBy: 'createdAt',
      sortOrder: 'asc',
    });

  const handleOnSubmit = async (data: DetailThreadFormSchema) => {
    if (!data.content) return;

    switch (data.mode) {
      case DetailThreadDrawerMode.EDIT:
        if (!data.commentId) return;
        await updateComment({
          id: data.commentId,
          content: data.content,
        });
        break;
      case DetailThreadDrawerMode.CREATE:
        await createComment({
          threadId: thread.id,
          content: data.content,
          parentCommentId: parentCommentId || null,
        });
        break;
      default:
        break;
    }

    form.reset({ content: '', mode: DetailThreadDrawerMode.CREATE });
  };

  const handleOnEditClick = (comment: CommentModel) => {
    form.reset({ content: comment.content, commentId: comment.id, mode: DetailThreadDrawerMode.EDIT });
  };

  const handleOnReplyClick = (comment: CommentModel) => {
    form.reset({
      content: '',
      mode: DetailThreadDrawerMode.CREATE,
    });
    openDrawer(DRAWER_ROUTES.DETAIL_THREAD, {
      threadId: thread.id,
      spaceId: thread.spaceId,
      parentCommentId: comment.id,
    });
  };

  const handleOnDeleteClick = (comment: CommentModel) => {
    form.reset({
      content: '',
      mode: DetailThreadDrawerMode.CREATE,
    });
    openModal(MODAL_ROUTES.DELETE_COMMENT, { threadId: thread.id, spaceId: thread.spaceId, commentId: comment.id });
  };

  const handleOnAssignActionClick = (comment: CommentModel) => {
    openDrawer(DRAWER_ROUTES.NEW_COMMENT_ACTION, { threadId: thread.id, commentId: comment.id });
  };

  const handleOnFollowUpActionClick = (comment: CommentModel) => {
    if (!comment.action) return;
    openDrawer(DRAWER_ROUTES.EDIT_COMMENT_ACTION, { commentId: comment.id, commentActionId: comment.action.id });
  };

  const isLoading = isLoadingMainComment || isLoadingParentMainComment;

  return (
    <>
      <Drawer.Body>
        <If condition={[!isLoading]}>
          <If condition={[parentCommentId, !mainComment]}>
            <NoResults
              icon={SearchXIcon}
              title="Comment not found"
              subtitle="The comment you are looking for does not exist."
            />
          </If>

          <If condition={!!mainComment}>
            <div className="flex flex-col">
              <ThreadCard thread={thread!} hideAction hideCommentsBadge />
              {repliedComments.map((comment, index) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  onEditClick={handleOnEditClick}
                  onAssignActionClick={handleOnAssignActionClick}
                  onFollowUpActionClick={handleOnFollowUpActionClick}
                  hideHorizontalLine={index === repliedComments.length - 1}
                  hideActions
                />
              ))}
            </div>
          </If>
          <If condition={isInitialFetching}>
            <PageLoader />
          </If>
          <If condition={!isInitialFetching}>
            <If condition={[!mainComment, !comments.length]}>
              <NoResults icon={SearchXIcon} title="No comments" subtitle="There are no comments for this thread yet." />
            </If>

            <If condition={[comments.length]}>
              <ul className={`mb-4 flex flex-col ${mainComment ? 'ml-12' : ''} `}>
                {comments.map((comment) => {
                  return (
                    <li key={comment.id} className="flex flex-col">
                      <CommentCard
                        comment={comment}
                        hideHorizontalLine
                        onEditClick={handleOnEditClick}
                        onReplyClick={handleOnReplyClick}
                        onDeleteClick={handleOnDeleteClick}
                        onAssignActionClick={handleOnAssignActionClick}
                        onFollowUpActionClick={handleOnFollowUpActionClick}
                      />
                    </li>
                  );
                })}
              </ul>
              <If condition={hasNextPage}>
                <ButtonGroup alignment="center">
                  <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                    Load More
                  </Button>
                </ButtonGroup>
              </If>
            </If>
          </If>
        </If>
      </Drawer.Body>

      <Drawer.Footer>
        <form onSubmit={form.handleSubmit(handleOnSubmit)}>
          <FormProvider {...form}>
            <ReplyBar isReplying={!!parentCommentId} />
          </FormProvider>
        </form>
      </Drawer.Footer>
    </>
  );
};
