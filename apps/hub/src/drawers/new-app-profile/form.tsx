import { useApiHiGroupQuery } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  ChipSingleInput,
  Drawer,
  FormLayout,
  TextInput,
  TextInputAsButton,
} from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { NewAppProfileFormSchema } from './types';

export interface NewAppProfileFormProps {
  defaultValues?: Partial<NewAppProfileFormSchema>;
  onSubmit: (data: NewAppProfileFormSchema) => void;
}

export const NewAppProfileForm: FC<NewAppProfileFormProps> = ({ defaultValues, onSubmit }) => {
  const { openDrawer, closeDrawer } = useDrawerRoute();
  const { isDesktop } = useWindowResize();

  const { control, watch, handleSubmit } = useForm<NewAppProfileFormSchema>({
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
          returnToDrawerPayload: { appId: watch('appId')?.toString() || '' },
        },
      },
    );
  };

  const [group] = useApiHiGroupQuery(watch('relatedId') || 0, {
    enabled: watch('type') === 'group' && !!watch('relatedId') && watch('relatedId') > 0,
  });

  return (
    <>
      <Drawer.Body>
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
                  label="Name"
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
                rules={{
                  validate: (value, formValues) => {
                    if (formValues.type === 'group' && (!value || value <= 0)) {
                      return 'Group is required';
                    }
                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextInputAsButton
                    label="Related ID"
                    placeholder="Select Group"
                    onClick={handleOnSelectGroupClick}
                    error={fieldState.error?.message}
                    displayValue={field.value.toString() && group ? group.name : ''}
                    {...field}
                  />
                )}
              />
            </FormLayout.Column>
          </If>
        </FormLayout>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup fluid={!isDesktop} alignment="end">
          <Button variant="ghost" onClick={closeDrawer}>
            Cancel
          </Button>
          <Button form="new-app-profile-form" onClick={handleSubmit(onSubmit)}>
            Create
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
