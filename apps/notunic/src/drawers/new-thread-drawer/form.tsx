import { ThreadCategoryModel } from '@dimasbaguspm/interfaces/notunic-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { FormLayout, TextAreaInput, TextInput, TextInputAsButton } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { NewThreadFormSchema } from './types';

interface NewThreadFormProps {
  selectedCategories: ThreadCategoryModel[];
}

export const NewThreadForm: FC<NewThreadFormProps> = ({ selectedCategories }) => {
  const { control, getValues } = useFormContext<NewThreadFormSchema>();

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
          returnToDrawer: DRAWER_ROUTES.NEW_THREAD,
          returnToDrawerId: {
            spaceId: getValues().spaceId.toString(),
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
              label="Description"
              placeholder="Type description"
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
