import { FormLayout, TextInput } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { EditThreadGroupTagFormSchema } from './types';

export const EditThreadGroupTagForm: FC = () => {
  const { control } = useFormContext<EditThreadGroupTagFormSchema>();

  return (
    <FormLayout>
      <FormLayout.Column span={12}>
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <TextInput {...field} label="Name" placeholder="Enter tag name" error={fieldState.error?.message} />
          )}
        />
      </FormLayout.Column>
    </FormLayout>
  );
};
