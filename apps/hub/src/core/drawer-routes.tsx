import { Drawer } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../constants/drawer-routes';
import { AppProfileCreationDrawer } from '../drawers/app-profile-creation/drawer';
import { useDrawerRoute } from '../hooks/use-drawer-route';

export const DrawerRoutes: FC = () => {
  const { isDrawerOpen, handleCloseDrawer, drawerRoute, additionalParams } =
    useDrawerRoute();

  return (
    <Drawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} size="md">
      {drawerRoute === DRAWER_ROUTES.APP_PROFILE_CREATION &&
        additionalParams?.appId && <AppProfileCreationDrawer />}
    </Drawer>
  );
};
