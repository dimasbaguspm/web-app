import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Drawer } from '@dimasbaguspm/versaur';
import { FC } from 'react';

export const DrawerRoutes: FC = () => {
  const { isOpen, closeDrawer } = useDrawerRoute<{
    appId?: string;
  }>();

  return (
    <Drawer isOpen={isOpen} onClose={closeDrawer} size="md">
      {null}
    </Drawer>
  );
};
