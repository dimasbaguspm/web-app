import { useApiHiUpsertAppProfileAuthById } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, Drawer, FormLayout, TextInput, useSnackbars } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { ManageAppProfilePinFormSchema } from './types';

interface ManageAppProfilePinDrawerProps {
  appProfileId: number;
}

export const ManageAppProfilePinDrawer: FC<ManageAppProfilePinDrawerProps> = ({ appProfileId }) => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { control, handleSubmit } = useForm<ManageAppProfilePinFormSchema>();
  const { showSnack } = useSnackbars();

  const [upsertAppProfileAuth] = useApiHiUpsertAppProfileAuthById();

  const handleOnSubmit = async (data: ManageAppProfilePinFormSchema) => {
    await upsertAppProfileAuth({
      id: appProfileId,
      pin: data.newPin,
    });
    showSnack('success', 'PIN has been updated successfully');
    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>Manage App Profile PIN</Drawer.Header>
      <Drawer.Body>
        <form id="manage-app-profile-pin-form" onSubmit={handleSubmit(handleOnSubmit)}>
          <FormLayout>
            <FormLayout.Column span={12}>
              <Controller
                control={control}
                name="newPin"
                rules={{
                  validate: (value, formValues) => {
                    if (!value) {
                      return 'New PIN is required';
                    }

                    if (formValues.confirmPin && value !== formValues.confirmPin) {
                      return 'New PIN and Confirm PIN do not match';
                    }
                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
                    label="New PIN"
                    type="password"
                    placeholder="Enter your new PIN"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </FormLayout.Column>
            <FormLayout.Column span={12}>
              <Controller
                control={control}
                name="confirmPin"
                rules={{
                  validate: (value, formValues) => {
                    if (!value) {
                      return 'Confirm PIN is required';
                    }

                    if (formValues.newPin && value !== formValues.newPin) {
                      return 'New PIN and Confirm PIN do not match';
                    }
                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
                    label="Confirm PIN"
                    type="password"
                    placeholder="Confirm your new PIN"
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
          <Button variant="ghost" onClick={closeDrawer}>
            Cancel
          </Button>
          <Button type="submit" form="manage-app-profile-pin-form">
            Save
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
