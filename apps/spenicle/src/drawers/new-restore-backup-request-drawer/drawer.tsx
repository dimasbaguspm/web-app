import { useApiSpenicleBackupRequestRestore } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, Drawer, FormLayout, TextInput, useSnackbars } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { NewRestoreBackupRequestFormSchema } from './types';

export const NewRestoreBackupRequestDrawer: FC = () => {
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();
  const { isDesktop } = useWindowResize();

  const [restoreBackup, , { isPending }] = useApiSpenicleBackupRequestRestore();
  const { handleSubmit, control, formState } = useForm<NewRestoreBackupRequestFormSchema>({
    defaultValues: {
      file: null,
    },
  });

  const handleOnValidSubmit: SubmitHandler<NewRestoreBackupRequestFormSchema> = async (data) => {
    await restoreBackup({
      encryptedBackup: data.file ?? '',
    });
    showSnack('success', 'Backup restored successfully');
    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Restore Backup</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <form id="restore-backup-request-form" onSubmit={handleSubmit(handleOnValidSubmit)}>
          <FormLayout>
            <FormLayout.Column span={12}>
              <Controller
                control={control}
                name="file"
                rules={{
                  validate: (value) => {
                    if (!value) {
                      return 'File is required';
                    }
                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
                    label="File"
                    type="file"
                    value={typeof field.value === 'string' ? field.value : ''}
                    error={fieldState.error?.message}
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
          <Button type="submit" form="restore-backup-request-form" disabled={isPending || !formState.isValid}>
            Restore
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
