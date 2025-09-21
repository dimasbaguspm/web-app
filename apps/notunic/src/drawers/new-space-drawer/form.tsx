import { FormLayout, TextAreaInput, TextInput } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { NewSpaceFormSchema } from './types';

export const NewSpaceForm: FC = () => {
  const { control } = useFormContext<NewSpaceFormSchema>();

  return (
    <FormLayout>
      <FormLayout.Column span={12}>
        <Controller
          control={control}
          name="name"
          rules={{
            validate: (value) => {
              if (!value || value.trim() === '') {
                return 'Name is required';
              }
              return true;
            },
          }}
          render={({ field, fieldState }) => (
            <TextInput label="Name" placeholder="Enter space name" {...field} error={fieldState.error?.message} />
          )}
        />
      </FormLayout.Column>
      <FormLayout.Column span={12}>
        <Controller
          control={control}
          name="description"
          render={({ field, fieldState }) => (
            <TextAreaInput
              label="Description"
              placeholder="Enter space description"
              {...field}
              error={fieldState.error?.message}
            />
          )}
        />
      </FormLayout.Column>
    </FormLayout>
  );
};
