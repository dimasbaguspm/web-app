import { FormLayout, TextInput } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { EditThreadGroupFormSchema } from './types';

export const EditThreadGroupForm: FC = () => {
  const { control } = useFormContext<EditThreadGroupFormSchema>();

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
    </FormLayout>
  );
};
