import { useApiNotunicCreateThreadCategory } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, Drawer, useSnackbars } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { NewThreadCategoryForm } from './form';
import { NewThreadCategoryFormSchema } from './types';

export const NewThreadCategoryDrawer: FC = () => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [createThreadCategory, , { isPending }] = useApiNotunicCreateThreadCategory();

  const form = useForm<NewThreadCategoryFormSchema>();

  const handleOnSubmit = async (data: NewThreadCategoryFormSchema) => {
    await createThreadCategory({ ...data });
    showSnack('success', 'Thread category created successfully');
    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>New Thread Category</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <form id="new-thread-category-form" onSubmit={form.handleSubmit(handleOnSubmit)}>
          <FormProvider {...form}>
            <NewThreadCategoryForm />
          </FormProvider>
        </form>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup fluid={!isDesktop} alignment="end">
          <Button variant="ghost" onClick={closeDrawer} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="new-thread-category-form" disabled={isPending}>
            Create
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
