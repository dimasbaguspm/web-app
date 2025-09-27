import { useApiNotunicCreateThreadGroupTag } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, Drawer, useSnackbars } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { NewThreadGroupTagForm } from './form';
import { NewThreadGroupTagFormSchema } from './types';

interface NewThreadGroupTagDrawerProps {
  threadGroupId: number;
}

export const NewThreadGroupTagDrawer: FC<NewThreadGroupTagDrawerProps> = ({ threadGroupId }) => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [createThreadGroup, , { isPending }] = useApiNotunicCreateThreadGroupTag();

  const form = useForm<NewThreadGroupTagFormSchema>();

  const handleOnSubmit = async (data: NewThreadGroupTagFormSchema) => {
    await createThreadGroup({
      name: data.name,
      threadGroupId,
    });
    showSnack('success', 'Tag created successfully');
    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>New Tag</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <form id="new-thread-group-tag-form" onSubmit={form.handleSubmit(handleOnSubmit)}>
          <FormProvider {...form}>
            <NewThreadGroupTagForm />
          </FormProvider>
        </form>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup fluid={!isDesktop} alignment="end">
          <Button variant="ghost" onClick={closeDrawer} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="new-thread-group-tag-form" disabled={isPending}>
            Create
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
