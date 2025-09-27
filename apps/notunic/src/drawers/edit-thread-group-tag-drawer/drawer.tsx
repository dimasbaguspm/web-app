import { useApiNotunicThreadGroupTagQuery, useApiNotunicUpdateThreadGroupTag } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, NoResults, PageLoader, useSnackbars } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { EditThreadGroupTagForm } from './form';
import { EditThreadGroupTagFormSchema } from './types';

interface EditThreadGroupTagDrawerProps {
  threadGroupId: number;
  threadGroupTagId: number;
}

export const EditThreadGroupTagDrawer: FC<EditThreadGroupTagDrawerProps> = ({ threadGroupId, threadGroupTagId }) => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [threadGroupTag, , { isLoading }] = useApiNotunicThreadGroupTagQuery(threadGroupTagId);

  const [createThreadGroup, , { isPending }] = useApiNotunicUpdateThreadGroupTag();

  const form = useForm<EditThreadGroupTagFormSchema>();

  const handleOnSubmit = async (data: EditThreadGroupTagFormSchema) => {
    await createThreadGroup({
      id: threadGroupTagId,
      name: data.name,
      threadGroupId,
    });
    showSnack('success', 'Tag updated successfully');
    closeDrawer();
  };

  useEffect(() => {
    if (threadGroupTag) {
      form.reset({
        name: threadGroupTag.name,
      });
    }
  }, [threadGroupTag]);

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Edit Tag</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <If condition={isLoading}>
          <PageLoader />
        </If>
        <If condition={[!isLoading, !!threadGroupTag]}>
          <form id="edit-thread-group-tag-form" onSubmit={form.handleSubmit(handleOnSubmit)}>
            <FormProvider {...form}>
              <EditThreadGroupTagForm />
            </FormProvider>
          </form>
        </If>
        <If condition={[!isLoading, !threadGroupTag]}>
          <NoResults icon={SearchXIcon} title="Tag not found" subtitle="The tag you are looking for does not exist." />
        </If>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup fluid={!isDesktop} alignment="end">
          <Button variant="ghost" onClick={closeDrawer} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="edit-thread-group-tag-form" disabled={isPending}>
            Update
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
