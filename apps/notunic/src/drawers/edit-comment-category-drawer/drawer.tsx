import { useApiNotunicCommentCategoryQuery, useApiNotunicUpdateCommentCategory } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, NoResults, PageLoader, useSnackbars } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { EditCommentCategoryForm } from './form';
import { formatDefaultValues } from './helpers';
import { EditCommentCategoryFormSchema } from './types';

interface EditCommentCategoryDrawerProps {
  commentCategoryId: number;
}

export const EditCommentCategoryDrawer: FC<EditCommentCategoryDrawerProps> = ({ commentCategoryId }) => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [commentCategory, , { isPending: isCommentCategoryQueryPending }] =
    useApiNotunicCommentCategoryQuery(commentCategoryId);

  const [updateCommentCategory, , { isPending }] = useApiNotunicUpdateCommentCategory();

  const form = useForm<EditCommentCategoryFormSchema>({
    defaultValues: formatDefaultValues(commentCategory),
  });

  const handleOnSubmit = async (data: EditCommentCategoryFormSchema) => {
    await updateCommentCategory({ ...data, id: commentCategoryId });
    showSnack('success', 'Comment category updated successfully');
    closeDrawer();
  };

  useEffect(() => {
    if (commentCategory) {
      form.reset(formatDefaultValues(commentCategory));
    }
  }, [commentCategory]);
  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Edit Comment Category</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <If condition={isCommentCategoryQueryPending}>
          <PageLoader />
        </If>
        <If condition={!isCommentCategoryQueryPending}>
          <If condition={!commentCategory}>
            <NoResults
              icon={SearchXIcon}
              title="Comment category not found"
              subtitle="The comment category does not exist"
            />
          </If>
          <If condition={Boolean(commentCategory)}>
            <form id="edit-comment-category-form" onSubmit={form.handleSubmit(handleOnSubmit)}>
              <FormProvider {...form}>
                <EditCommentCategoryForm />
              </FormProvider>
            </form>
          </If>
        </If>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup fluid={!isDesktop} alignment="end">
          <Button variant="ghost" onClick={closeDrawer} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="edit-comment-category-form" disabled={isPending}>
            Update
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
