import { ThreadCategoryModel } from '@dimasbaguspm/interfaces/notunic-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { FormLayout, TextAreaInput, TextInput, TextInputAsButton } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { EditThreadFormSchema } from './types';

interface EditThreadFormProps {
  selectedCategories: ThreadCategoryModel[];
}

export const EditThreadForm: FC<EditThreadFormProps> = ({ selectedCategories }) => {
  const { control, getValues } = useFormContext<EditThreadFormSchema>();
  const { openDrawer } = useDrawerRoute();

  const handleOnCategoryInputFocus = () => {
    openDrawer(
      DRAWER_ROUTES.SELECT_MULTIPLE_THREAD_CATEGORIES,
      {
        payloadId: 'categoryIds',
      },
      {
        replace: true,
        state: {
          payload: getValues(),
          returnToDrawer: DRAWER_ROUTES.EDIT_THREAD,
          returnToDrawerId: {
            spaceId: getValues().spaceId.toString(),
            threadId: getValues().threadId.toString(),
          },
        },
      },
    );
  };

  return (
    <FormLayout>
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
              label="Message"
              placeholder="Type message"
              error={fieldState.error?.message}
              row={6}
            />
          )}
        />
      </FormLayout.Column>
      <FormLayout.Column span={12}>
        <Controller
          control={control}
          name="categoryIds"
          render={({ field, fieldState }) => (
            <TextInputAsButton
              label="Categories"
              placeholder="Select categories"
              error={fieldState.error?.message}
              onClick={handleOnCategoryInputFocus}
              displayValue={selectedCategories.map((category) => category.name).join(', ')}
              {...field}
            />
          )}
        />
      </FormLayout.Column>
    </FormLayout>
  );
};
