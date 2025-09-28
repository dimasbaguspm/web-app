import { ThreadGroupModel } from '@dimasbaguspm/interfaces/notunic-api';
import { ButtonGroup, FormLayout, TextAreaInput } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { ThreadGroupMenuField } from '../../components/thread-group-menu-field';

import { EditThreadFormSchema } from './types';

interface EditThreadFormProps {
  threadGroups: ThreadGroupModel[];
}

export const EditThreadForm: FC<EditThreadFormProps> = ({ threadGroups }) => {
  const { control } = useFormContext<EditThreadFormSchema>();

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
          name="content"
          render={({ field, fieldState }) => (
            <TextAreaInput
              {...field}
              label="Message"
              placeholder="Type message"
              error={fieldState.error?.message}
              fieldSizing="content"
            />
          )}
        />
      </FormLayout.Column>
    </FormLayout>
  );
};
