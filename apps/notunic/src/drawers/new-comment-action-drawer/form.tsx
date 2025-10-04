import { DateSinglePickerInput, FormLayout } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { NewCommentActionFormSchema } from './types';

export const NewCommentActionForm: FC = () => {
  const { control } = useFormContext<NewCommentActionFormSchema>();

  return (
    <FormLayout>
      <FormLayout.Column span={12}>
        <Controller
          control={control}
          name="dueDate"
          render={({ field, fieldState }) => (
            <DateSinglePickerInput
              {...field}
              value={field.value ?? ''}
              label="Due Date"
              placeholder="Select due date"
              error={fieldState.error?.message}
            />
          )}
        />
      </FormLayout.Column>
    </FormLayout>
  );
};
