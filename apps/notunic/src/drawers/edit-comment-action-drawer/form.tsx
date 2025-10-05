import { DateSinglePickerInput, FormLayout, TextAreaInput } from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
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
          rules={{
            validate: (value) => {
              if (!value) return 'Due date is required';
              return true;
            },
          }}
          render={({ field, fieldState }) => (
            <DateSinglePickerInput
              {...field}
              min={dayjs().toISOString()}
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
            rules={{
              validate: (value) => {
                if (!value) return 'Followed Up Date is required';

                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <DateSinglePickerInput
                {...field}
                min={field.value}
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
          rules={{
            validate: (value) => {
              if (!value) return 'Followed Up Note is required';

              return true;
            },
          }}
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
