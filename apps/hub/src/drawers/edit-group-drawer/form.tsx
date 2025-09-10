import { FormLayout, TextInput } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { EditGroupFormSchema } from './types';

interface EditGroupFormProps {
  defaultValues?: EditGroupFormSchema;
  handleOnSubmit: (data: EditGroupFormSchema) => void;
}

export const EditGroupForm: FC<EditGroupFormProps> = ({ defaultValues, handleOnSubmit }) => {
  const form = useForm<EditGroupFormSchema>({
    defaultValues,
  });

  return (
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
  );
};
