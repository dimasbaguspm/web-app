import { useApiNotunicCreateThreadGroup } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, Drawer, useSnackbars } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { NewThreadGroupForm } from './form';
import { NewThreadGroupFormSchema } from './types';

export const NewThreadGroupDrawer: FC = () => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [createThreadGroup, , { isPending }] = useApiNotunicCreateThreadGroup();

  const form = useForm<NewThreadGroupFormSchema>();

  const handleOnSubmit = async (data: NewThreadGroupFormSchema) => {
    await createThreadGroup(data);
    showSnack('success', 'Thread group created successfully');
    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>New Thread Group</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <form id="new-thread-group-form" onSubmit={form.handleSubmit(handleOnSubmit)}>
          <FormProvider {...form}>
            <NewThreadGroupForm />
          </FormProvider>
        </form>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup fluid={!isDesktop} alignment="end">
          <Button variant="ghost" onClick={closeDrawer} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="new-thread-group-form" disabled={isPending}>
            Create
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
