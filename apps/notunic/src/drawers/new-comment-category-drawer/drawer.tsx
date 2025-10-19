import { useApiNotunicCreateCommentCategory } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, Drawer, useSnackbars } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { NewCommentCategoryForm } from './form';
import { NewCommentCategoryFormSchema } from './types';

export const NewCommentCategoryDrawer: FC = () => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [createCommentCategory, , { isPending }] = useApiNotunicCreateCommentCategory();

  const form = useForm<NewCommentCategoryFormSchema>();

  const handleOnSubmit = async (data: NewCommentCategoryFormSchema) => {
    await createCommentCategory({ ...data });
    showSnack('success', 'Comment category created successfully');
    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>New Comment Category</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <form id="new-thread-category-form" onSubmit={form.handleSubmit(handleOnSubmit)}>
          <FormProvider {...form}>
            <NewCommentCategoryForm />
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
