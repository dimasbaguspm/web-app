import { useApiHiAppQuery, useApiHiUpdateApp } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { AdminGuard } from '@dimasbaguspm/utils/admin-guard';
import { formatHiAppData } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, NoResults, PageLoader, useSnackbars } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { EditAppForm } from './form';
import { formatDefaultValues, formatUpdatePayload } from './helpers';
import { EditAppDrawerFormSchema } from './types';

interface EditAppDrawerProps {
  appId: number;
}

export const EditAppDrawer: FC<EditAppDrawerProps> = ({ appId }) => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [appData, , { isLoading }] = useApiHiAppQuery(appId);
  const [updateApp, , { isPending }] = useApiHiUpdateApp();

  const { name } = formatHiAppData(appData);

  const form = useForm<EditAppDrawerFormSchema>();

  const handleOnSubmit = async (data: EditAppDrawerFormSchema) => {
    await updateApp(formatUpdatePayload(appId, data));
    showSnack('success', 'App updated successfully');
    closeDrawer();
  };

  useEffect(() => {
    if (appData) {
      form.reset(formatDefaultValues(appData));
    }
  }, [appData]);

  return (
    <AdminGuard showWarning>
      <Drawer.Header>Edit {name} App</Drawer.Header>
      <Drawer.Body>
        <If condition={isLoading && !appData}>
          <PageLoader />
        </If>
        <If condition={!isLoading && !appData}>
          <NoResults title="App not found" subtitle="The app you are looking for does not exist" icon={SearchXIcon} />
        </If>
        <If condition={!isLoading && !!appData}>
          <form id="edit-app-form" onSubmit={form.handleSubmit(handleOnSubmit)}>
            <FormProvider {...form}>
              <EditAppForm />
            </FormProvider>
          </form>
        </If>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" disabled={isPending} onClick={closeDrawer}>
            Cancel
          </Button>
          <Button type="submit" form="edit-app-form" disabled={isPending}>
            Update
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </AdminGuard>
  );
};
