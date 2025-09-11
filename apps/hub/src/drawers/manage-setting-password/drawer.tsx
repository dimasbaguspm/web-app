import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, Drawer, FormLayout, TextInput } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { ManageSettingPasswordFormSchema } from './types';

export const ManageSettingPasswordDrawer: FC = () => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();

  const { control, handleSubmit } = useForm<ManageSettingPasswordFormSchema>();

  const handleOnSubmit = (data: ManageSettingPasswordFormSchema) => {
    console.log(data);
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Change Password</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <form id="manage-setting-password-form" onSubmit={handleSubmit(handleOnSubmit)}>
          <FormLayout>
            <FormLayout.Column span={12}>
              <Controller
                control={control}
                name="currentPassword"
                rules={{
                  required: 'Current password is required',
                }}
                render={({ field, fieldState }) => (
                  <TextInput
                    label="Current Password"
                    type="password"
                    placeholder="Enter current password"
                    {...field}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </FormLayout.Column>
            <FormLayout.Column span={12}>
              <Controller
                control={control}
                name="newPassword"
                rules={{
                  required: 'New password is required',
                  deps: ['confirmNewPassword'],
                  validate: (value, formValues) => {
                    if (value.length < 6) {
                      return 'Password must be at least 6 characters';
                    }

                    if (value === formValues.currentPassword) {
                      return 'New password must be different from current password';
                    }

                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextInput
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                    {...field}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </FormLayout.Column>
            <FormLayout.Column span={12}>
              <Controller
                control={control}
                name="confirmNewPassword"
                rules={{
                  required: 'Please confirm your new password',
                  deps: ['newPassword'],
                  validate: (value, formValues) => {
                    if (value.length < 6) {
                      return 'Password must be at least 6 characters';
                    }

                    if (value !== formValues.newPassword) {
                      return 'Passwords do not match';
                    }

                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextInput
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm new password"
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
          <Button variant="ghost" onClick={closeDrawer}>
            Cancel
          </Button>
          <Button variant="primary" form="manage-setting-password-form" type="submit">
            Save
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
