import { useApiHiCreateGroup } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, Drawer, FormLayout, TextInput, useSnackbars } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { NewGroupFormSchema } from './types';

export const NewGroupDrawer: FC = () => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const form = useForm<NewGroupFormSchema>();

  const [createGroup, , { isPending: isPendingCreateGroup }] = useApiHiCreateGroup();

  const handleOnSubmit = async (data: NewGroupFormSchema) => {
    await createGroup({ name: data.name });
    showSnack('success', 'Group created successfully');

    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>New Group</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <form id="new-group-form" onSubmit={form.handleSubmit(handleOnSubmit)}>
          <FormLayout>
            <FormLayout.Column span={12}>
              <Controller
                name="name"
                control={form.control}
                rules={{
                  validate: (value) => value.trim().length > 0 || 'Name is required',
                }}
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
                    label="Name"
                    placeholder="Enter group name"
                    required
                    error={fieldState.error?.message}
                  />
                )}
              />
            </FormLayout.Column>
          </FormLayout>
        </form>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" disabled={isPendingCreateGroup}>
            Cancel
          </Button>
          <Button type="submit" form="new-group-form" disabled={isPendingCreateGroup}>
            Create
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
