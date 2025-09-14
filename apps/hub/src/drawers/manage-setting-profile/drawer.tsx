import { useApiHiUpdateWhoAmI } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useAuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, Drawer, FormLayout, TextInput, useSnackbars } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { ManageSettingProfileFormSchema } from './types';

export const ManageSettingProfileDrawer: FC = () => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { user } = useAuthProvider();
  const { showSnack } = useSnackbars();

  const { control, handleSubmit } = useForm<ManageSettingProfileFormSchema>({
    defaultValues: {
      name: user?.name || '',
    },
  });

  const [updateWhoAmI, , { isPending }] = useApiHiUpdateWhoAmI();

  const handleOnSubmit = async (data: ManageSettingProfileFormSchema) => {
    await updateWhoAmI({ name: data.name });
    showSnack('success', 'Profile updated successfully');
    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Edit Profile</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <form id="manage-setting-profile-form" onSubmit={handleSubmit(handleOnSubmit)}>
          <FormLayout>
            <FormLayout.Column span={12}>
              <Controller
                control={control}
                name="name"
                rules={{
                  required: 'Name is required',
                }}
                render={({ field, fieldState }) => (
                  <TextInput
                    label="Name"
                    type="text"
                    placeholder="Enter your name"
                    {...field}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </FormLayout.Column>
          </FormLayout>
        </form>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup fluid={!isDesktop} alignment="end">
          <Button variant="ghost" onClick={closeDrawer} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="primary" form="manage-setting-profile-form" type="submit" disabled={isPending}>
            Save
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
