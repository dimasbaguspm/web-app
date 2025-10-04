import {
  useApiNotunicCommentQuery,
  useApiNotunicCommentsInfiniteQuery,
  useApiNotunicCreateComment,
  useApiNotunicUpdateComment,
} from '@dimasbaguspm/hooks/use-api';
import { CommentModel, ThreadModel } from '@dimasbaguspm/interfaces/notunic-api';
import { useAuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, FormLayout, Hr, NoResults, PageLoader, TextInput } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

import { CommentCard } from '../../../components/comment-card';
import { DRAWER_ROUTES } from '../../../constants/drawer-routes';
import { MODAL_ROUTES } from '../../../constants/modal-routes';
import { DetailThreadDrawerMode, DetailThreadFormSchema } from '../types';

interface CommentsTabProps {
  thread: ThreadModel;
  parentCommentId?: number | null;
}

export const CommentsTab: FC<CommentsTabProps> = ({ thread, parentCommentId = null }) => {
  const { openDrawer } = useDrawerRoute();
  const { openModal } = useModalRoute();

  const { user } = useAuthProvider();

  const [mainComment, , { isLoading: isLoadingMainComment }] = useApiNotunicCommentQuery(parentCommentId ?? 0, {
    enabled: (parentCommentId ?? 0) > 0,
  });
  const [parentMainComment, , { isLoading: isLoadingParentMainComment }] = useApiNotunicCommentQuery(
    mainComment?.parentCommentId ?? 0,
    {
      enabled: (mainComment?.parentCommentId ?? 0) > 0,
    },
  );

  const { register, handleSubmit, reset } = useForm<DetailThreadFormSchema>({
    defaultValues: { mode: DetailThreadDrawerMode.CREATE },
  });

  const [createComment] = useApiNotunicCreateComment();
  const [updateComment] = useApiNotunicUpdateComment();

  const [comments, , { isInitialFetching, hasNextPage, isFetchingNextPage }, { fetchNextPage }] =
    useApiNotunicCommentsInfiniteQuery({
      threadId: thread.id,
      parentCommentId: parentCommentId || null,
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
          userId: user.id,
          threadId: thread.id,
          content: data.content,
          parentCommentId: parentCommentId || null,
        });
        break;
      default:
        break;
    }

    reset({ content: '', mode: DetailThreadDrawerMode.CREATE });
  };

  const handleOnEditClick = (comment: CommentModel) => {
    reset({ content: comment.content, commentId: comment.id, mode: DetailThreadDrawerMode.EDIT });
  };

  const handleOnReplyClick = (comment: CommentModel) => {
    reset({
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
    reset({
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
            <div className="flex flex-col space-y-4 mb-4">
              <CommentCard comment={mainComment!} parentComment={parentMainComment} hideActions />
              <Hr />
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
              <ul className={`mb-4 flex flex-col gap-4 ${mainComment ? 'ml-4' : ''}`}>
                {comments.map((comment, index) => {
                  const isLastItem = index === comments.length - 1;

                  return (
                    <li key={comment.id} className="flex flex-col space-y-4">
                      <CommentCard
                        comment={comment}
                        onEditClick={handleOnEditClick}
                        onReplyClick={handleOnReplyClick}
                        onDeleteClick={handleOnDeleteClick}
                        onAssignActionClick={handleOnAssignActionClick}
                        onFollowUpActionClick={handleOnFollowUpActionClick}
                      />
                      {!isLastItem && <Hr />}
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
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <FormLayout>
            <FormLayout.Column span={12}>
              <TextInput
                placeholder={mainComment ? 'Write reply' : 'Add a comment'}
                {...register('content')}
                autoComplete="off"
                autoCapitalize="sentences"
              />
              <TextInput type="submit" className="hidden" />
            </FormLayout.Column>
          </FormLayout>
        </form>
      </Drawer.Footer>
    </>
  );
};
