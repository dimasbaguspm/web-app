import { FormLayout, TextAreaInput, TextInput } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { EditCommentCategoryFormSchema } from './types';

export const EditCommentCategoryForm: FC = () => {
  const { control } = useFormContext<EditCommentCategoryFormSchema>();

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
              placeholder="Enter comment group name"
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
              placeholder="Enter comment group description"
              error={fieldState.error?.message}
              row={6}
            />
          )}
        />
      </FormLayout.Column>
    </FormLayout>
  );
};
