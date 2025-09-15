import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, Drawer, FormLayout, TextInput } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { EditAppProfileFormSchema } from './types';

export interface EditAppProfileFormProps {
  defaultValues?: Partial<EditAppProfileFormSchema>;
  onSubmit: (data: EditAppProfileFormSchema) => void;
}

export const EditAppProfileForm: FC<EditAppProfileFormProps> = ({ defaultValues, onSubmit }) => {
  const { closeDrawer } = useDrawerRoute();
  const { isDesktop } = useWindowResize();

  const { control, handleSubmit } = useForm<EditAppProfileFormSchema>({
    defaultValues,
  });

  return (
    <>
      <Drawer.Body>
        <FormLayout>
          <FormLayout.Column span={12}>
            <Controller
              control={control}
              name="name"
              rules={{
                validate: (value) => (value.trim() === '' ? 'Name is required' : true),
              }}
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label="Name"
                  placeholder="Enter profile name"
                  error={fieldState.error?.message}
                  required
                />
              )}
            />
          </FormLayout.Column>
        </FormLayout>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup fluid={!isDesktop} alignment="end">
          <Button variant="ghost" onClick={closeDrawer}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)}>Update</Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
