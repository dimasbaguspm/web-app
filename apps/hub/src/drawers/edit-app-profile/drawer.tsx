import { useApiHiAppProfileQuery, useApiHiUpdateAppProfile } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Drawer, PageLoader } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { EditAppProfileForm } from './form';
import { formatDefaultValues } from './helpers';
import { EditAppProfileFormSchema } from './types';

interface EditAppProfileDrawerProps {
  appId: number;
  appProfileId: number;
}

export const EditAppProfileDrawer: FC<EditAppProfileDrawerProps> = ({ appId, appProfileId }) => {
  const [updateAppProfile] = useApiHiUpdateAppProfile();
  const { closeDrawer } = useDrawerRoute();

  const [appProfile, , { isLoading }] = useApiHiAppProfileQuery(appProfileId);
  const handleOnSubmit = async (data: EditAppProfileFormSchema) => {
    await updateAppProfile({
      id: +appProfileId,
      name: data.name.trim(),
    });

    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>Edit App Profile</Drawer.Header>
      <If condition={isLoading}>
        <PageLoader />
      </If>
      <If condition={[!isLoading, appProfile]}>
        <EditAppProfileForm
          defaultValues={formatDefaultValues({ appId, name: appProfile?.name })}
          onSubmit={handleOnSubmit}
        />
      </If>
    </>
  );
};
