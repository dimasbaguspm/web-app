import { FormLayout, TextAreaInput, TextInput } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { EditThreadCategoryFormSchema } from './types';

export const EditThreadCategoryForm: FC = () => {
  const { control } = useFormContext<EditThreadCategoryFormSchema>();

  return (
    <FormLayout>
      <FormLayout.Column span={12}>
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Name"
              placeholder="Enter thread group name"
              error={fieldState.error?.message}
            />
          )}
        />
      </FormLayout.Column>
      <FormLayout.Column span={12}>
        <Controller
          control={control}
          name="description"
          render={({ field, fieldState }) => (
            <TextAreaInput
              {...field}
              label="Description"
              placeholder="Enter thread group description"
              error={fieldState.error?.message}
              rows={4}
            />
          )}
        />
      </FormLayout.Column>
    </FormLayout>
  );
};
