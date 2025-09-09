import { useApiHiCreateAppProfile } from '@dimasbaguspm/hooks/use-api';
import { useAuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Drawer } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { NewAppProfileForm } from './form';
import { formatDefaultValues } from './helpers';
import { NewAppProfileFormSchema } from './types';

interface NewAppProfileDrawerProps {
  appId: number;
  payload?: Record<string, unknown>;
}

export const NewAppProfileDrawer: FC<NewAppProfileDrawerProps> = ({ appId, payload }) => {
  const [createAppProfile] = useApiHiCreateAppProfile();
  const { closeDrawer } = useDrawerRoute();

  const { user } = useAuthProvider();

  const handleOnSubmit = async (data: NewAppProfileFormSchema) => {
    await createAppProfile({
      appId: +appId,
      name: data.name.trim(),
      userId: data.type === 'personal' ? +user.id : undefined,
      groupId: data.type === 'group' ? +data.relatedId : undefined,
    });

    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>New App Profile</Drawer.Header>

      <NewAppProfileForm defaultValues={formatDefaultValues({ ...payload, appId })} onSubmit={handleOnSubmit} />
    </>
  );
};
