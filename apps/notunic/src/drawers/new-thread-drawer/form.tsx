import { ThreadGroupModel } from '@dimasbaguspm/interfaces/notunic-api';
import { ButtonGroup, FormLayout, TextAreaInput, TextInput } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { ThreadGroupMenuField } from '../../components/thread-group-menu-field';

import { NewThreadFormSchema } from './types';

interface NewThreadFormProps {
  threadGroups: ThreadGroupModel[];
}

export const NewThreadForm: FC<NewThreadFormProps> = ({ threadGroups }) => {
  const { control } = useFormContext<NewThreadFormSchema>();

  return (
    <FormLayout>
      <FormLayout.Column span={12}>
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <ButtonGroup>
              {threadGroups?.map((group) => (
                <ThreadGroupMenuField
                  key={group.id}
                  threadGroup={group}
                  selectedTags={field.value}
                  onTagSelect={(tags) => {
                    field.onChange(tags);
                  }}
                />
              ))}
            </ButtonGroup>
          )}
        />
      </FormLayout.Column>
      <FormLayout.Column span={12}>
        <Controller
          control={control}
          name="title"
          render={({ field, fieldState }) => (
            <TextInput {...field} label="Title" placeholder="Thread title" error={fieldState.error?.message} />
          )}
        />
      </FormLayout.Column>
      <FormLayout.Column span={12}>
        <Controller
          control={control}
          name="content"
          render={({ field, fieldState }) => (
            <TextAreaInput
              {...field}
              label="Description"
              placeholder="Type description"
              error={fieldState.error?.message}
              fieldSizing="content"
            />
          )}
        />
      </FormLayout.Column>
    </FormLayout>
  );
};
