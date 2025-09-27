import { useApiNotunicThreadGroupQuery, useApiNotunicUpdateThreadGroup } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, NoResults, PageLoader, useSnackbars } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { EditThreadGroupForm } from './form';
import { EditThreadGroupFormSchema } from './types';

interface EditThreadGroupDrawerProps {
  threadGroupId: number;
}

export const EditThreadGroupDrawer: FC<EditThreadGroupDrawerProps> = ({ threadGroupId }) => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [threadGroup, , { isLoading }] = useApiNotunicThreadGroupQuery(threadGroupId);

  const [updateThreadGroup, , { isPending }] = useApiNotunicUpdateThreadGroup();

  const form = useForm<EditThreadGroupFormSchema>();

  const handleOnSubmit = async (data: EditThreadGroupFormSchema) => {
    await updateThreadGroup({
      id: threadGroupId,
      name: data.name,
    });
    showSnack('success', 'Thread group updated successfully');
    closeDrawer();
  };

  useEffect(() => {
    if (threadGroup) {
      form.reset({
        name: threadGroup.name,
      });
    }
  }, [threadGroup]);

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Edit Thread Group</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <If condition={isLoading}>
        <Drawer.Body>
          <PageLoader />
        </Drawer.Body>
      </If>
      <If condition={[!isLoading, !!threadGroup]}>
        <Drawer.Body>
          <form id="edit-thread-group-form" onSubmit={form.handleSubmit(handleOnSubmit)}>
            <FormProvider {...form}>
              <EditThreadGroupForm />
            </FormProvider>
          </form>
        </Drawer.Body>
        <Drawer.Footer>
          <ButtonGroup fluid={!isDesktop} alignment="end">
            <Button variant="ghost" disabled={isPending} onClick={closeDrawer}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="edit-thread-group-form" disabled={isPending}>
              Update
            </Button>
          </ButtonGroup>
        </Drawer.Footer>
      </If>

      <If condition={[!isLoading, !threadGroup]}>
        <Drawer.Body>
          <NoResults
            icon={SearchXIcon}
            title="Thread Group Not Found"
            subtitle="The thread group you are looking for does not exist."
          />
        </Drawer.Body>
      </If>
    </>
  );
};
