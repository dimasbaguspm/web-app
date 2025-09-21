import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Drawer } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../constants/drawer-routes';
import { EditSpaceDrawer } from '../drawers/edit-space-drawer/drawer';
import { NewSpaceDrawer } from '../drawers/new-space-drawer/drawer';

interface DrawerParams {
  appId?: string;
  spaceId?: number;
  threadId?: number;
  commentId?: number;
  actionId?: number;
  actionLinkId?: number;
  payloadId?: string;
  tabId?: string;
}

interface DrawerState {
  payload?: Record<string, string>;
  returnToDrawer?: string;
  returnToDrawerId?: Record<string, string> | null;
}

export const DrawerRoutes: FC = () => {
  const { isDesktop } = useWindowResize();
  const { isOpen, drawerId, params, closeDrawer } = useDrawerRoute<DrawerParams, DrawerState>();

  const is = (id: string) => drawerId === id;
  const hasParam = (param: keyof typeof params) => (params && typeof params === 'object' ? param in params : false);
  // const hasState = (stateKey: keyof typeof state) => (state && typeof state === 'object' ? stateKey in state : false);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeDrawer}
      size={isDesktop ? 'lg' : 'full'}
      transitionType={isDesktop ? 'slide' : 'fade'}
    >
      {is(DRAWER_ROUTES.NEW_SPACE) && <NewSpaceDrawer />}
      {is(DRAWER_ROUTES.EDIT_SPACE) && hasParam('spaceId') && <EditSpaceDrawer spaceId={params.spaceId!} />}
    </Drawer>
  );
};
