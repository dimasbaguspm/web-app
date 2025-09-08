import { useApiHiCreateAppProfile } from '@dimasbaguspm/hooks/use-api';
import { AppModel, CreateAppProfileModel } from '@dimasbaguspm/interfaces';
import { useAuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useSnackbars } from '@dimasbaguspm/versaur';
import { useForm } from 'react-hook-form';

import { AppProfileCreationFormData } from './types';

interface Props {
  app: AppModel;
}

export const useAppProfileForm = (options: Props) => {
  const { app } = options ?? {};

  const { user } = useAuthProvider();
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const form = useForm<AppProfileCreationFormData>({
    defaultValues: {
      profileType: 'user',
      selectedId: user.id,
    },
  });

  const [createAppProfile, , { isPending: isSubmitting }] = useApiHiCreateAppProfile();

  const handleOnSubmit = form.handleSubmit(async (data: AppProfileCreationFormData) => {
    try {
      const payload: CreateAppProfileModel = {
        appId: app.id,
        name: data.name,
        userId: data.profileType === 'user' ? +data.selectedId : undefined,
        groupId: data.profileType === 'group' ? +data.selectedId : undefined,
      };

      await createAppProfile(payload);
      form.reset();
      showSnack('success', 'App profile created successfully');

      return payload;
    } finally {
      closeDrawer();
    }
  });

  return {
    form,
    isSubmitting,
    handleOnSubmit,
  };
};
