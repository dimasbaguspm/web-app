import {
  useApiNotunicThreadCategoriesInfiniteQuery,
  useApiNotunicThreadQuery,
  useApiNotunicUpdateThread,
} from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, NoResults, PageLoader, useSnackbars } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { EditThreadForm } from './form';
import { formatDefaultValues } from './helpers';
import { EditThreadFormSchema } from './types';

interface EditThreadDrawerProps {
  spaceId: number;
  threadId: number;
  payload?: Record<string, unknown>;
}

export const EditThreadDrawer: FC<EditThreadDrawerProps> = ({ threadId, spaceId, payload }) => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [thread, , { isLoading: isLoadingThread }] = useApiNotunicThreadQuery(threadId);

  const [updateThread, , { isPending }] = useApiNotunicUpdateThread();

  const form = useForm<EditThreadFormSchema>({
    defaultValues: formatDefaultValues(thread, { ...payload, spaceId, threadId }),
  });

  const handleOnSubmit = async (data: EditThreadFormSchema) => {
    await updateThread({
      id: threadId,
      title: data.title,
      content: data.content,
      categoryIds: data.categoryIds,
    });
    showSnack('success', 'Thread updated successfully');
    closeDrawer();
  };

  useEffect(() => {
    if (thread) {
      form.reset(formatDefaultValues(thread, { ...payload, spaceId, threadId }));
    }
  }, [thread, payload, spaceId, threadId]);

  const selectedCategoryIds = form.watch('categoryIds');

  const [threadCategories] = useApiNotunicThreadCategoriesInfiniteQuery(
    {
      id: selectedCategoryIds,
      pageSize: selectedCategoryIds?.length || 1,
    },
    { enabled: !!selectedCategoryIds?.length },
  );

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Edit Thread</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <If condition={[isLoadingThread]}>
        <Drawer.Body>
          <PageLoader />
        </Drawer.Body>
      </If>
      <If condition={[!isLoadingThread, !!thread]}>
        <Drawer.Body>
          <form id="edit-thread-form" onSubmit={form.handleSubmit(handleOnSubmit)}>
            <FormProvider {...form}>
              <EditThreadForm selectedCategories={threadCategories} />
            </FormProvider>
          </form>
        </Drawer.Body>
        <Drawer.Footer>
          <ButtonGroup fluid={!isDesktop} alignment="end">
            <Button variant="ghost" disabled={isPending} onClick={closeDrawer}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="edit-thread-form" disabled={isPending}>
              Update
            </Button>
          </ButtonGroup>
        </Drawer.Footer>
      </If>

      <If condition={[!isLoadingThread, !thread]}>
        <Drawer.Body>
          <NoResults
            icon={SearchXIcon}
            title="Thread Not Found"
            subtitle="The thread you are looking for does not exist."
          />
        </Drawer.Body>
      </If>
    </>
  );
};
