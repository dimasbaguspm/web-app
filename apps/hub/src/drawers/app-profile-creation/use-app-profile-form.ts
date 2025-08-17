import {
  AppModel,
  CreateAppProfileModel,
  useApiHiCreateAppProfile,
} from '@dimasbaguspm/hooks/use-api';
import { useSnackbars } from '@dimasbaguspm/versaur';
import { useForm } from 'react-hook-form';

import { useDrawerRoute } from '../../hooks/use-drawer-route';
import { useAuthProvider } from '../../providers/auth-provider';

import { AppProfileCreationFormData } from './types';

interface Props {
  app: AppModel;
}

export const useAppProfileForm = (options: Props) => {
  const { app } = options ?? {};

  const { user } = useAuthProvider();
  const { handleCloseDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const form = useForm<AppProfileCreationFormData>({
    defaultValues: {
      profileType: 'user',
      selectedId: user.id,
    },
  });

  const [createAppProfile, , { isPending: isSubmitting }] =
    useApiHiCreateAppProfile();

  const handleOnSubmit = form.handleSubmit(
    async (data: AppProfileCreationFormData) => {
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
        handleCloseDrawer();
      }
    },
  );

  return {
    form,
    isSubmitting,
    handleOnSubmit,
  };
};
