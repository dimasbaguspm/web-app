import { DateSinglePickerInput, FormLayout, TextAreaInput } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { EditCommentActionFormSchema } from './types';

export const EditCommentActionForm: FC = () => {
  const { control, watch } = useFormContext<EditCommentActionFormSchema>();

  const isFollowedUpDateSet = Boolean(watch('followedUpDate'));

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
      {isFollowedUpDateSet && (
        <FormLayout.Column span={12}>
          <Controller
            control={control}
            name="followedUpDate"
            render={({ field, fieldState }) => (
              <DateSinglePickerInput
                {...field}
                value={field.value ?? ''}
                label="Followed Up Date"
                placeholder="Select followed up date"
                error={fieldState.error?.message}
              />
            )}
          />
        </FormLayout.Column>
      )}
      <FormLayout.Column span={12}>
        <Controller
          control={control}
          name="followedUpNote"
          render={({ field, fieldState }) => (
            <TextAreaInput
              {...field}
              value={field.value ?? ''}
              label="Followed Up Note"
              placeholder="Select followed up note"
              error={fieldState.error?.message}
            />
          )}
        />
      </FormLayout.Column>
    </FormLayout>
  );
};
