import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Drawer } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../constants/drawer-routes';
import { DetailThreadGroupDrawer } from '../drawers/detail-thread-group-drawer/drawer';
import { EditSpaceDrawer } from '../drawers/edit-space-drawer/drawer';
import { EditThreadDrawer } from '../drawers/edit-thread-drawer/drawer';
import { EditThreadGroupDrawer } from '../drawers/edit-thread-group/drawer';
import { EditThreadGroupTagDrawer } from '../drawers/edit-thread-group-tag-drawer/drawer';
import { ManageThreadGroupDrawer } from '../drawers/manage-thread-groups-drawer/drawer';
import { NewSpaceDrawer } from '../drawers/new-space-drawer/drawer';
import { NewThreadGroupDrawer } from '../drawers/new-thread-group/drawer';
import { NewThreadGroupTagDrawer } from '../drawers/new-thread-group-tag-drawer/drawer';

interface DrawerParams {
  appId?: string;
  spaceId?: number;
  threadId?: number;
  threadGroupId?: number;
  threadGroupTagId?: number;
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
      {is(DRAWER_ROUTES.EDIT_THREAD) && hasParam('threadId') && <EditThreadDrawer threadId={params.threadId!} />}
      {is(DRAWER_ROUTES.MANAGE_THREAD_GROUPS) && <ManageThreadGroupDrawer />}
      {is(DRAWER_ROUTES.NEW_THREAD_GROUP) && <NewThreadGroupDrawer />}
      {is(DRAWER_ROUTES.DETAIL_THREAD_GROUP) && hasParam('threadGroupId') && (
        <DetailThreadGroupDrawer threadGroupId={params.threadGroupId!} />
      )}
      {is(DRAWER_ROUTES.EDIT_THREAD_GROUP) && hasParam('threadGroupId') && (
        <EditThreadGroupDrawer threadGroupId={params.threadGroupId!} />
      )}
      {is(DRAWER_ROUTES.NEW_THREAD_GROUP_TAG) && hasParam('threadGroupId') && (
        <NewThreadGroupTagDrawer threadGroupId={params.threadGroupId!} />
      )}
      {is(DRAWER_ROUTES.EDIT_THREAD_GROUP_TAG) && hasParam('threadGroupId') && hasParam('threadGroupTagId') && (
        <EditThreadGroupTagDrawer threadGroupId={params.threadGroupId!} threadGroupTagId={params.threadGroupTagId!} />
      )}
    </Drawer>
  );
};
