import {
  useApiSpenicleCreateBackupRequest,
  useApiSpenicleTransactionsInfiniteQuery,
} from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, DateSinglePickerInput, Drawer, FormLayout, useSnackbars } from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { FC, useEffect } from 'react';
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import { NewBackupRequestFormSchema } from './types';

export const NewBackupRequestDrawer: FC = () => {
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();
  const { isDesktop } = useWindowResize();

  const [firstTransaction] = useApiSpenicleTransactionsInfiniteQuery({ pageSize: 1, sortBy: 'date', sortOrder: 'asc' });

  const [createBackupRequest, , { isPending }] = useApiSpenicleCreateBackupRequest();
  const { handleSubmit, reset, control, formState } = useForm<NewBackupRequestFormSchema>({
    defaultValues: {
      dateFrom: dayjs(firstTransaction?.[0]?.date).format('YYYY-MM-DD'),
      dateTo: dayjs().endOf('day').format('YYYY-MM-DD'),
    },
  });

  useEffect(() => {
    if (firstTransaction?.[0]) {
      reset({
        dateFrom: dayjs(firstTransaction[0].date).format('YYYY-MM-DD'),
        dateTo: dayjs().endOf('day').format('YYYY-MM-DD'),
      });
    }
  }, [firstTransaction]);

  const handleOnValidSubmit: SubmitHandler<FieldValues> = async (data) => {
    await createBackupRequest({
      startDate: data.dateFrom,
      endDate: data.dateTo,
    });
    showSnack('success', 'Backup request created successfully');
    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Create Backup Request</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <form id="new-backup-request-form" onSubmit={handleSubmit(handleOnValidSubmit)}>
          <FormLayout>
            <FormLayout.Column span={6}>
              <Controller
                control={control}
                name="dateFrom"
                rules={{
                  validate: (value) => {
                    if (!value) {
                      return 'Start date is required';
                    }
                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <DateSinglePickerInput {...field} label="Start Date" error={fieldState.error?.message} />
                )}
              />
            </FormLayout.Column>
            <FormLayout.Column span={6}>
              <Controller
                control={control}
                name="dateTo"
                rules={{
                  validate: (value, formValues) => {
                    if (!value) {
                      return 'End date is required';
                    }

                    if (dayjs(value).isBefore(dayjs(formValues.dateFrom))) {
                      return 'End date must be after start date';
                    }

                    if (dayjs(value).isSame(dayjs(formValues.dateFrom))) {
                      return 'End date must be after start date';
                    }

                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <DateSinglePickerInput
                    {...field}
                    label="End Date"
                    error={fieldState.error?.message}
                    max={dayjs().endOf('day').format('YYYY-MM-DD')}
                  />
                )}
              />
            </FormLayout.Column>
          </FormLayout>
        </form>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" onClick={closeDrawer}>
            Cancel
          </Button>
          <Button type="submit" form="new-backup-request-form" disabled={isPending || !formState.isValid}>
            Create
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
