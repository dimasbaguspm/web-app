import { useApiNotunicThreadCategoryQuery, useApiNotunicUpdateThreadCategory } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, NoResults, PageLoader, useSnackbars } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { EditThreadCategoryForm } from './form';
import { formatDefaultValues } from './helpers';
import { EditThreadCategoryFormSchema } from './types';

interface EditThreadCategoryDrawerProps {
  threadCategoryId: number;
}

export const EditThreadCategoryDrawer: FC<EditThreadCategoryDrawerProps> = ({ threadCategoryId }) => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [threadCategory, , { isPending: isThreadCategoryQueryPending }] =
    useApiNotunicThreadCategoryQuery(threadCategoryId);

  const [updateThreadCategory, , { isPending }] = useApiNotunicUpdateThreadCategory();

  const form = useForm<EditThreadCategoryFormSchema>({
    defaultValues: formatDefaultValues(threadCategory),
  });

  const handleOnSubmit = async (data: EditThreadCategoryFormSchema) => {
    await updateThreadCategory({ ...data, id: threadCategoryId });
    showSnack('success', 'Thread category updated successfully');
    closeDrawer();
  };

  useEffect(() => {
    if (threadCategory) {
      form.reset(formatDefaultValues(threadCategory));
    }
  }, [threadCategory]);
  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Edit Thread Category</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <If condition={isThreadCategoryQueryPending}>
          <PageLoader />
        </If>
        <If condition={!isThreadCategoryQueryPending}>
          <If condition={!threadCategory}>
            <NoResults
              icon={SearchXIcon}
              title="Thread category not found"
              subtitle="The thread category does not exist."
            />
          </If>
          <If condition={Boolean(threadCategory)}>
            <form id="Edit-thread-category-form" onSubmit={form.handleSubmit(handleOnSubmit)}>
              <FormProvider {...form}>
                <EditThreadCategoryForm />
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
          <Button variant="primary" type="submit" form="Edit-thread-category-form" disabled={isPending}>
            Update
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
