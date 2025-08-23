import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Drawer } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../constants/drawer-routes';
import { DetailAccountDrawer } from '../drawers/detail-account-drawer/drawer';
import { EditAccountDrawer } from '../drawers/edit-account-drawer/drawer';
import { NewAccountDrawer } from '../drawers/new-account-drawer/drawer';

export const DrawerRoutes: FC = () => {
  const { isDesktop } = useWindowResize();
  const { isOpen, drawerId, params, closeDrawer } = useDrawerRoute<{
    appId?: string;
    accountId?: number;
  }>();

  const is = (id: string) => drawerId === id;
  const hasParam = (param: keyof typeof params) => param in params;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeDrawer}
      size={isDesktop ? 'md' : 'full'}
    >
      {is(DRAWER_ROUTES.NEW_ACCOUNT) && <NewAccountDrawer />}
      {is(DRAWER_ROUTES.ACCOUNT_DETAIL) && hasParam('accountId') && (
        <DetailAccountDrawer accountId={params.accountId!} />
      )}
      {is(DRAWER_ROUTES.EDIT_ACCOUNT) && hasParam('accountId') && (
        <EditAccountDrawer accountId={params.accountId!} />
      )}
    </Drawer>
  );
};
