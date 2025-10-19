import {
  useApiNotunicCommentCategoryQuery,
  useApiNotunicCommentsInfiniteQuery,
  useApiNotunicUpdateCommentCategoryMember,
} from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatNotunicComment } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  Drawer,
  NoResults,
  PageLoader,
  SelectableSingleInput,
  useSnackbars,
} from '@dimasbaguspm/versaur';
import { noop } from 'lodash';
import { SearchXIcon } from 'lucide-react';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { ManageCommentCategoryMembersFormSchema } from './types';

export interface ManageCommentCategoryMembersDrawerProps {
  commentCategoryId: number;
}

export const ManageCommentCategoryMembersDrawer: FC<ManageCommentCategoryMembersDrawerProps> = ({
  commentCategoryId,
}) => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [commentCategory, , { isLoading: isCommentCategoryQueryLoading }] =
    useApiNotunicCommentCategoryQuery(commentCategoryId);

  const [threads, , { isLoading: isCommentQueryLoading }] = useApiNotunicCommentsInfiniteQuery({});

  const form = useForm<ManageCommentCategoryMembersFormSchema>({
    defaultValues: {
      commentIds: [],
    },
  });

  useEffect(() => {
    if (commentCategory) {
      form.reset({
        commentIds: commentCategory.memberIds.map((id) => id.toString()),
      });
    }
  }, [commentCategory]);

  const [updateCommentCategoryMember, , { isPending: isUpdateCommentCategoryMember }] =
    useApiNotunicUpdateCommentCategoryMember();

  const isLoading = isCommentCategoryQueryLoading || isCommentQueryLoading;
  const selectedCommentIds = form.watch('commentIds');

  const handleOnSubmit = async (data: ManageCommentCategoryMembersFormSchema) => {
    await updateCommentCategoryMember({
      id: commentCategoryId,
      commentIds: data.commentIds,
    });
    showSnack('success', 'Comment category members updated successfully');
    closeDrawer();
  };

  return (
    <>
      <If condition={isLoading}>
        <PageLoader />
      </If>
      <If condition={!isLoading}>
        <If condition={!commentCategory}>
          <Drawer.Header>
            <Drawer.Title>Manage Comment Category Members</Drawer.Title>
            <Drawer.CloseButton />
          </Drawer.Header>

          <Drawer.Body>
            <NoResults
              icon={SearchXIcon}
              title="Comment category not found"
              subtitle="The thread category does not exist"
            />
          </Drawer.Body>
        </If>
        <If condition={Boolean(commentCategory)}>
          <Drawer.Header>
            <Drawer.Title>Manage Members for {commentCategory?.name || 'Comment'} Category</Drawer.Title>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>
            <If condition={threads.length === 0}>
              <NoResults
                icon={SearchXIcon}
                title="No Comments Found"
                subtitle="There are no threads available to add to this category"
              />
            </If>
            <If condition={threads.length > 0}>
              <ul className="flex flex-col gap-4 mb-4">
                {threads.map((thread) => (
                  <li key={thread.id}>
                    <SelectableSingleInput
                      value={thread.id.toString()}
                      name="threads"
                      checked={selectedCommentIds.includes(thread.id.toString())}
                      onChange={noop}
                      onClick={() => {
                        const currentValues = form.getValues('commentIds');
                        if (currentValues.includes(thread.id.toString())) {
                          form.setValue(
                            'commentIds',
                            currentValues.filter((id) => id !== thread.id.toString()),
                          );
                        } else {
                          form.setValue('commentIds', [...currentValues, thread.id.toString()]);
                        }
                      }}
                    >
                      {formatNotunicComment(thread).description}
                    </SelectableSingleInput>
                  </li>
                ))}
              </ul>
            </If>
          </Drawer.Body>
          <Drawer.Footer>
            <ButtonGroup alignment="end" fluid={!isDesktop}>
              <Button variant="ghost" onClick={closeDrawer} disabled={isUpdateCommentCategoryMember}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={form.handleSubmit(handleOnSubmit)}
                disabled={isUpdateCommentCategoryMember}
              >
                Save
              </Button>
            </ButtonGroup>
          </Drawer.Footer>
        </If>
      </If>
    </>
  );
};
