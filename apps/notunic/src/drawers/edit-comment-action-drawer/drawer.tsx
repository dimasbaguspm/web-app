import {
  useApiNotunicCommentActionQuery,
  useApiNotunicCommentQuery,
  useApiNotunicUpdateCommentAction,
} from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, NoResults, PageLoader, useSnackbars } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { CommentCard } from '../../components/comment-card';

import { EditCommentActionForm } from './form';
import { formatDefaultValues } from './helpers';
import { EditCommentActionFormSchema } from './types';

interface EditCommentActionDrawerProps {
  commentId: number;
  commentActionId: number;
}

export const EditCommentActionDrawer: FC<EditCommentActionDrawerProps> = ({ commentId, commentActionId }) => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [comment, , { isLoading: isCommentLoading }] = useApiNotunicCommentQuery(commentId);
  const [parentComment, , { isLoading: isParentCommentLoading }] = useApiNotunicCommentQuery(
    comment?.parentCommentId ?? 0,
    {
      enabled: (comment?.parentCommentId ?? 0) > 0,
    },
  );

  const [commentAction, , { isPending: isQueryCommentActionPending }] = useApiNotunicCommentActionQuery(
    commentActionId,
    {
      enabled: commentActionId > 0,
    },
  );
  const [updateCommentAction, , { isPending: isUpdateCommentActionPending }] = useApiNotunicUpdateCommentAction();

  const form = useForm<EditCommentActionFormSchema>({
    defaultValues: formatDefaultValues(commentAction),
  });

  const handleOnSubmit = async (data: EditCommentActionFormSchema) => {
    await updateCommentAction({
      id: data.commentActionId,
      dueDate: data.dueDate,
      followedUpDate: data.followedUpDate || new Date().toISOString(),
      followUpNote: data.followedUpNote || null,
    });
    showSnack('success', 'Comment action updated successfully');
    closeDrawer();
  };

  useEffect(() => {
    if (commentAction) {
      form.reset(formatDefaultValues(commentAction));
    }
  }, [commentAction]);

  const isPending =
    isQueryCommentActionPending || isUpdateCommentActionPending || isCommentLoading || isParentCommentLoading;

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Edit Comment Action</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <If condition={[isPending]}>
        <Drawer.Body>
          <PageLoader />
        </Drawer.Body>
      </If>

      <If condition={[!isPending]}>
        <Drawer.Body>
          <div className="mb-4">
            <CommentCard comment={comment!} parentComment={parentComment} hideActions />
          </div>

          <If condition={Boolean(commentAction)}>
            <form id="edit-comment-action-form" onSubmit={form.handleSubmit(handleOnSubmit)}>
              <FormProvider {...form}>
                <EditCommentActionForm />
              </FormProvider>
            </form>
          </If>
          <If condition={!commentAction}>
            <NoResults
              icon={SearchXIcon}
              title="Comment Action not found"
              subtitle="The comment action you are looking for does not exist."
            />
          </If>
        </Drawer.Body>
        <Drawer.Footer>
          <ButtonGroup fluid={!isDesktop} alignment="end">
            <Button variant="ghost" disabled={isPending} onClick={closeDrawer}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="edit-comment-action-form" disabled={isPending}>
              Update
            </Button>
          </ButtonGroup>
        </Drawer.Footer>
      </If>
    </>
  );
};
