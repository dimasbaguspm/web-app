import { FormLayout, TextAreaInput, TextInput } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { EditAppDrawerFormSchema } from './types';

export const EditAppForm: FC = () => {
  const { control } = useFormContext<EditAppDrawerFormSchema>();

  return (
    <FormLayout>
      <FormLayout.Column span={12}>
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <TextInput {...field} label="Name" placeholder="Enter app name" error={fieldState.error?.message} />
          )}
        />
      </FormLayout.Column>
      <FormLayout.Column span={12}>
        <Controller
          control={control}
          name="outline"
          render={({ field, fieldState }) => (
            <TextInput {...field} label="Outline" placeholder="Enter app outline" error={fieldState.error?.message} />
          )}
        />
      </FormLayout.Column>
      <FormLayout.Column span={12}>
        <Controller
          control={control}
          name="url"
          render={({ field, fieldState }) => (
            <TextInput {...field} label="URL" placeholder="Enter app URL" error={fieldState.error?.message} />
          )}
        />
      </FormLayout.Column>
      <FormLayout.Column span={12}>
        <Controller
          control={control}
          name="documentationUrl"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Documentation URL"
              placeholder="Enter app documentation URL"
              error={fieldState.error?.message}
            />
          )}
        />
      </FormLayout.Column>
      <FormLayout.Column span={12}>
        <Controller
          control={control}
          name="termsOfServiceUrl"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Terms of Service URL"
              placeholder="Enter app terms of service URL"
              error={fieldState.error?.message}
            />
          )}
        />
      </FormLayout.Column>
      <FormLayout.Column span={12}>
        <Controller
          control={control}
          name="privacyPolicyUrl"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Privacy Policy URL"
              placeholder="Enter app privacy policy URL"
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
              placeholder="Enter app description"
              error={fieldState.error?.message}
            />
          )}
        />
      </FormLayout.Column>
    </FormLayout>
  );
};
