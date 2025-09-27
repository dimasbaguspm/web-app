import { FormLayout, TextAreaInput } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { EditThreadFormSchema } from './types';

export const EditThreadForm: FC = () => {
  const { control } = useFormContext<EditThreadFormSchema>();

  return (
    <FormLayout>
      <FormLayout.Column span={12}>
        <Controller
          control={control}
          name="content"
          render={({ field, fieldState }) => (
            <TextAreaInput
              {...field}
              label="Content"
              placeholder="Enter thread content"
              error={fieldState.error?.message}
            />
          )}
        />
      </FormLayout.Column>
    </FormLayout>
  );
};
