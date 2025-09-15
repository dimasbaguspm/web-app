import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Drawer } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../constants/drawer-routes';
import { DetailAppDrawer } from '../drawers/detail-app-drawer/drawer';
import { DetailAppProfileDrawer } from '../drawers/detail-app-profile-drawer/drawer';
import { DetailGroupDrawer } from '../drawers/detail-group-drawer/drawer';
import { EditAppDrawer } from '../drawers/edit-app-drawer/drawer';
import { EditAppProfileDrawer } from '../drawers/edit-app-profile-drawer/drawer';
import { EditGroupDrawer } from '../drawers/edit-group-drawer/drawer';
import { ManageAppProfilePinDrawer } from '../drawers/manage-app-profile-pin-drawer/drawer';
import { ManageGroupMemberDrawer } from '../drawers/manage-group-member-drawer/drawer';
import { ManageSettingPasswordDrawer } from '../drawers/manage-setting-password/drawer';
import { ManageSettingProfileDrawer } from '../drawers/manage-setting-profile/drawer';
import { NewAppProfileDrawer } from '../drawers/new-app-profile/drawer';
import { NewGroupDrawer } from '../drawers/new-group-drawer/drawer';
import { SelectGroupDrawer } from '../drawers/select-group-drawer/drawer';

interface DrawerParams {
  appId?: number;
  appProfileId?: number;
  groupId?: number;
  payloadId?: string;
  tabId?: string;
}

interface DrawerState {
  payload?: Record<string, string>;
  returnToDrawer?: string;
  returnToDrawerPayload?: Record<string, string> | null;
}

export const DrawerRoutes: FC = () => {
  const { isDesktop } = useWindowResize();
  const { isOpen, drawerId, params, state, closeDrawer } = useDrawerRoute<DrawerParams, DrawerState>();

  const is = (id: string) => drawerId === id;
  const hasParam = (param: keyof typeof params) => (params && typeof params === 'object' ? param in params : false);
  const hasState = (stateKey: keyof typeof state) => (state && typeof state === 'object' ? stateKey in state : false);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeDrawer}
      size={isDesktop ? 'lg' : 'full'}
      transitionType={isDesktop ? 'slide' : 'fade'}
    >
      {is(DRAWER_ROUTES.DETAIL_APP) && hasParam('appId') && (
        <DetailAppDrawer appId={params.appId!} tabId={params?.tabId} />
      )}
      {is(DRAWER_ROUTES.EDIT_APP) && hasParam('appId') && <EditAppDrawer appId={params.appId!} />}
      {is(DRAWER_ROUTES.NEW_APP_PROFILE) && hasParam('appId') && (
        <NewAppProfileDrawer appId={params.appId!} payload={{ ...state?.returnToDrawerPayload, ...state?.payload }} />
      )}
      {is(DRAWER_ROUTES.DETAIL_APP_PROFILE) && hasParam('appProfileId') && (
        <DetailAppProfileDrawer appProfileId={params.appProfileId!} tabId={params.tabId} />
      )}
      {is(DRAWER_ROUTES.EDIT_APP_PROFILE) && hasParam('appProfileId') && hasParam('appId') && (
        <EditAppProfileDrawer appProfileId={params.appProfileId!} appId={params.appId!} />
      )}
      {is(DRAWER_ROUTES.MANAGE_APP_PROFILE_PIN) && hasParam('appProfileId') && (
        <ManageAppProfilePinDrawer appProfileId={params.appProfileId!} />
      )}

      {is(DRAWER_ROUTES.SELECT_GROUP) && hasState('payload') && hasState('returnToDrawer') && hasParam('payloadId') && (
        <SelectGroupDrawer
          payloadId={params.payloadId!}
          payload={state.payload!}
          returnToDrawer={state.returnToDrawer!}
          returnToDrawerPayload={state.returnToDrawerPayload!}
        />
      )}
      {is(DRAWER_ROUTES.NEW_GROUP) && <NewGroupDrawer />}
      {is(DRAWER_ROUTES.DETAIL_GROUP) && hasParam('groupId') && (
        <DetailGroupDrawer groupId={params.groupId!} tabId={params?.tabId} />
      )}
      {is(DRAWER_ROUTES.EDIT_GROUP) && hasParam('groupId') && <EditGroupDrawer groupId={params.groupId!} />}
      {is(DRAWER_ROUTES.MANAGE_GROUP_MEMBERS) && hasParam('groupId') && (
        <ManageGroupMemberDrawer groupId={params.groupId!} />
      )}

      {is(DRAWER_ROUTES.MANAGE_SETTING_PROFILE) && <ManageSettingProfileDrawer />}
      {is(DRAWER_ROUTES.MANAGE_SETTING_PASSWORD) && <ManageSettingPasswordDrawer />}
    </Drawer>
  );
};
