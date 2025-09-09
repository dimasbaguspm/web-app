import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { ChipSingleInput, FormLayout, TextInput } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { NewAppProfileFormSchema } from './types';

export interface NewAppProfileFormProps {
  defaultValues?: Partial<NewAppProfileFormSchema>;
}

export const NewAppProfileForm: FC<NewAppProfileFormProps> = ({ defaultValues }) => {
  const { openDrawer } = useDrawerRoute();
  const { control, watch } = useForm<NewAppProfileFormSchema>({
    defaultValues,
  });

  const handleOnSelectGroupClick = () => {
    openDrawer(
      DRAWER_ROUTES.SELECT_GROUP,
      {
        payloadId: 'relatedId',
      },
      {
        replace: true,
        state: {
          payload: watch(),
          returnToDrawer: DRAWER_ROUTES.NEW_APP_PROFILE,
        },
      },
    );
  };

  return (
    <FormLayout>
      <FormLayout.Column span={12}>
        <Controller
          control={control}
          name="name"
          rules={{
            validate: (value) => (value.trim() === '' ? 'Name is required' : true),
          }}
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Profile Name"
              placeholder="Enter profile name"
              error={fieldState.error?.message}
              required
            />
          )}
        />
      </FormLayout.Column>
      <FormLayout.Column span={12}>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <ChipSingleInput {...field} label="Type">
              <ChipSingleInput.Option value="personal">Personal</ChipSingleInput.Option>
              <ChipSingleInput.Option value="group">Group</ChipSingleInput.Option>
            </ChipSingleInput>
          )}
        />
      </FormLayout.Column>
      <If condition={[watch('type') === 'group']}>
        <FormLayout.Column span={12}>
          <Controller
            control={control}
            name="relatedId"
            render={({ field }) => (
              <>
                <TextInput
                  {...field}
                  readOnly
                  label="Related ID"
                  placeholder="Select Group"
                  onClick={handleOnSelectGroupClick}
                />
                <input type="hidden" {...field} />
              </>
            )}
          />
        </FormLayout.Column>
      </If>
    </FormLayout>
  );
};
