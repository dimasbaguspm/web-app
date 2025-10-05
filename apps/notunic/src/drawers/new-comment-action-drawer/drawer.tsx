import {
  useApiNotunicCommentQuery,
  useApiNotunicCommentsInfiniteQuery,
  useApiNotunicCreateCommentAction,
  useApiNotunicThreadQuery,
} from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, Hr, NoResults, PageLoader, useSnackbars } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { CommentCard } from '../../components/comment-card';
import { ThreadCard } from '../../components/thread-card';

import { NewCommentActionForm } from './form';
import { NewCommentActionFormSchema } from './types';

interface NewCommentActionDrawerProps {
  threadId: number;
  commentId: number;
}

export const NewCommentActionDrawer: FC<NewCommentActionDrawerProps> = ({ threadId, commentId }) => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [comment, , { isLoading: isLoadingComment }] = useApiNotunicCommentQuery(commentId);
  const [repliedComments, , { isLoading: isLoadingParentMainComment }] = useApiNotunicCommentsInfiniteQuery(
    {
      id: comment?.conversationCommentIds || [],
      sortBy: 'createdAt',
      sortOrder: 'asc',
      pageSize: 100,
    },
    {
      enabled: !!comment?.conversationCommentIds?.length,
    },
  );
  const [thread, , { isLoading: isLoadingThread }] = useApiNotunicThreadQuery(comment?.threadId || 0, {
    enabled: (comment?.threadId || 0) > 0,
  });

  const [createCommentAction, , { isPending }] = useApiNotunicCreateCommentAction();

  const form = useForm<NewCommentActionFormSchema>({
    defaultValues: {
      commentId,
      threadId,
      dueDate: undefined,
    },
  });

  const handleOnSubmit = async (data: NewCommentActionFormSchema) => {
    await createCommentAction({
      threadId,
      commentId,
      dueDate: data.dueDate,
    });
    showSnack('success', 'Comment action created successfully');
    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>New Action</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <If condition={[isLoadingComment, isLoadingParentMainComment, isLoadingThread]}>
        <Drawer.Body>
          <PageLoader />
        </Drawer.Body>
      </If>

      <If condition={[!isLoadingComment, !isLoadingParentMainComment, !isLoadingThread]}>
        <Drawer.Body>
          <If condition={Boolean(comment)}>
            <div className="flex flex-col mb-4">
              <ThreadCard thread={thread!} hideAction hideCommentsBadge />

              {repliedComments.map((comment, index) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  hideActions
                  hideHorizontalLine={index === repliedComments.length - 1}
                />
              ))}

              <Hr />
            </div>

            <form id="new-comment-action-form" onSubmit={form.handleSubmit(handleOnSubmit)}>
              <FormProvider {...form}>
                <NewCommentActionForm />
              </FormProvider>
            </form>
          </If>
          <If condition={!comment}>
            <NoResults
              icon={SearchXIcon}
              title="Comment not found"
              subtitle="The comment you are looking for does not exist."
            />
          </If>
        </Drawer.Body>
        <Drawer.Footer>
          <ButtonGroup fluid={!isDesktop} alignment="end">
            <Button variant="ghost" disabled={isPending} onClick={closeDrawer}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="new-comment-action-form" disabled={isPending}>
              Create
            </Button>
          </ButtonGroup>
        </Drawer.Footer>
      </If>
    </>
  );
};
