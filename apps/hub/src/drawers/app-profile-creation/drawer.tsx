import { Button, Drawer, LoadingIndicator, Text } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { FormProvider } from 'react-hook-form';

import { useDrawerRoute } from '../../hooks/use-drawer-route';

import { AppProfileCreationForm } from './form';
import { useAppProfileData } from './use-app-profile-data';
import { useAppProfileForm } from './use-app-profile-form';

export const AppProfileCreationDrawer: FC = () => {
  const { handleCloseDrawer } = useDrawerRoute();

  const { isDataLoading, app, groups, user } = useAppProfileData();
  const { form, handleOnSubmit, isSubmitting } = useAppProfileForm({ app });

  return (
    <>
      <Drawer.Header>
        <Text as="h2" fontSize="lg" fontWeight="semibold">
          {app?.name ? `${app.name} Profile Creation` : 'Profile Creation'}
        </Text>
      </Drawer.Header>
      {isDataLoading ? (
        <LoadingIndicator size="sm" type="bar" />
      ) : (
        <FormProvider {...form}>
          <Drawer.Body>
            <AppProfileCreationForm user={user} groups={groups} />
          </Drawer.Body>
          <Drawer.Footer>
            <Button variant="ghost" onClick={handleCloseDrawer} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleOnSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Profile'}
            </Button>
          </Drawer.Footer>
        </FormProvider>
      )}
    </>
  );
};
