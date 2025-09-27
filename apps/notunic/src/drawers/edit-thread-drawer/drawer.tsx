import { useApiNotunicThreadQuery, useApiNotunicUpdateThread } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, NoResults, PageLoader, useSnackbars } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { EditThreadForm } from './form';
import { EditThreadFormSchema } from './types';

interface EditThreadDrawerProps {
  threadId: number;
}

export const EditThreadDrawer: FC<EditThreadDrawerProps> = ({ threadId }) => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [thread, , { isLoading }] = useApiNotunicThreadQuery(threadId);

  const [updateThread, , { isPending }] = useApiNotunicUpdateThread();

  const form = useForm<EditThreadFormSchema>();

  const handleOnSubmit = async (data: EditThreadFormSchema) => {
    await updateThread({
      id: threadId,
      content: data.content,
    });
    showSnack('success', 'Thread updated successfully');
    closeDrawer();
  };

  useEffect(() => {
    if (thread) {
      form.reset({
        content: thread.content,
      });
    }
  }, [thread]);

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Edit Thread</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <If condition={isLoading}>
        <Drawer.Body>
          <PageLoader />
        </Drawer.Body>
      </If>
      <If condition={[!isLoading, !!thread]}>
        <Drawer.Body>
          <form id="edit-thread-form" onSubmit={form.handleSubmit(handleOnSubmit)}>
            <FormProvider {...form}>
              <EditThreadForm />
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

      <If condition={[!isLoading, !thread]}>
        <Drawer.Body>
          <NoResults
            icon={SearchXIcon}
            title="Thread Group Not Found"
            subtitle="The thread you are looking for does not exist."
          />
        </Drawer.Body>
      </If>
    </>
  );
};
