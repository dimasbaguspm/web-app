import { useApiNotunicCreateSpace } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, Drawer, useSnackbars } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { FieldValues, FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { NewSpaceForm } from './form';
import { NewSpaceFormSchema } from './types';

export const NewSpaceDrawer: FC = () => {
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();
  const { isDesktop } = useWindowResize();

  const [createSpace, , { isPending }] = useApiNotunicCreateSpace();
  const form = useForm<NewSpaceFormSchema>({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const handleOnValidSubmit: SubmitHandler<FieldValues> = async (data) => {
    await createSpace({
      name: data.name,
    });
    showSnack('success', 'Space created successfully');
    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Create Space</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <form id="new-space-form" onSubmit={form.handleSubmit(handleOnValidSubmit)}>
          <FormProvider {...form}>
            <NewSpaceForm />
          </FormProvider>
        </form>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" onClick={closeDrawer}>
            Cancel
          </Button>
          <Button type="submit" form="new-space-form" disabled={isPending || !form.formState.isValid}>
            Create
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
