import {
  useApiNotunicCommentQuery,
  useApiNotunicCommentsInfiniteQuery,
  useApiNotunicCreateComment,
  useApiNotunicThreadQuery,
  useApiNotunicUpdateComment,
} from '@dimasbaguspm/hooks/use-api';
import { CommentModel } from '@dimasbaguspm/interfaces/notunic-api';
import { useAuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatNotunicThread } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, FormLayout, Hr, NoResults, PageLoader, TextInput } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

import { CommentCard } from '../../components/comment-card';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { DetailThreadDrawerMode, DetailThreadFormSchema } from './types';

interface DetailThreadDrawerProps {
  threadId: number;
  spaceId: number;
  parentCommentId?: number | null;
}

export const DetailThreadDrawer: FC<DetailThreadDrawerProps> = ({ threadId, spaceId, parentCommentId = null }) => {
  const { user } = useAuthProvider();
  const [mainThread, , { isLoading: isLoadingMainThread }] = useApiNotunicThreadQuery(threadId, {
    enabled: !!threadId && !parentCommentId,
  });
  const [mainComment, , { isLoading: isLoadingMainComment }] = useApiNotunicCommentQuery(parentCommentId!, {
    enabled: !!parentCommentId,
  });
  const [parentMainComment, , { isLoading: isLoadingParentMainComment }] = useApiNotunicCommentQuery(
    mainComment?.parentCommentId ?? 0,
    {
      enabled: !!mainComment?.parentCommentId,
    },
  );

  const { openDrawer } = useDrawerRoute();

  const { register, handleSubmit, reset } = useForm<DetailThreadFormSchema>({
    defaultValues: { mode: DetailThreadDrawerMode.CREATE },
  });

  const [createComment] = useApiNotunicCreateComment();
  const [updateComment] = useApiNotunicUpdateComment();

  const [comments, , { isInitialFetching, hasNextPage, isFetchingNextPage }, { fetchNextPage }] =
    useApiNotunicCommentsInfiniteQuery({
      threadId: threadId,
      parentCommentId: parentCommentId || null,
      sortBy: 'createdAt',
      sortOrder: 'asc',
    });

  const formattedThreadGroup = formatNotunicThread(mainThread);

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
          threadId: threadId,
          content: data.content,
          parentCommentId,
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

  const handleOnClick = (comment: CommentModel) => {
    reset({
      content: '',
      mode: DetailThreadDrawerMode.CREATE,
    });
    openDrawer(DRAWER_ROUTES.DETAIL_THREAD, { threadId, spaceId, parentCommentId: comment.id });
  };

  const isLoading = isLoadingMainThread || isLoadingMainComment || isLoadingParentMainComment;

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>{formattedThreadGroup.title ?? 'Thread Details'}</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <If condition={isLoading}>
          <PageLoader />
        </If>
        <If condition={[!isLoading]}>
          <If condition={[!parentCommentId && !mainThread]}>
            <NoResults
              icon={SearchXIcon}
              title="Thread not found"
              subtitle="The thread you are looking for does not exist."
            />
          </If>
          <If condition={[parentCommentId, !mainComment]}>
            <NoResults
              icon={SearchXIcon}
              title="Comment not found"
              subtitle="The comment you are looking for does not exist."
            />
          </If>

          <If condition={!!mainComment}>
            <div className="mb-4">
              <CommentCard comment={mainComment!} parentComment={parentMainComment} hideDelete variant="detail" />
              <Hr />
            </div>
          </If>
          <If condition={isInitialFetching}>
            <PageLoader />
          </If>
          <If condition={!isInitialFetching}>
            <If condition={[!mainComment, comments.length === 0]}>
              <NoResults icon={SearchXIcon} title="No comments" subtitle="There are no comments for this thread yet." />
            </If>
            <If condition={[comments.length > 0]}>
              <ul className="mb-4">
                {comments.map((comment, index) => {
                  const isLastItem = index === comments.length - 1;

                  return (
                    <li key={comment.id}>
                      <CommentCard comment={comment} onEditClick={handleOnEditClick} onReplyClick={handleOnClick} />
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
