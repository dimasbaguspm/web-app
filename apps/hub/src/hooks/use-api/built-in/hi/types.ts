import { operations } from '../../../../types/hi.openapi';

export type SearchUsersModel = operations['getUser']['parameters']['query'];
export type UsersPageModel =
  operations['getUser']['responses']['200']['content']['application/json'];
export type UserModel =
  operations['getUserById']['responses']['200']['content']['application/json'];
export type UpdateUserModel =
  operations['patchUserById']['requestBody']['content']['application/json'] &
    operations['patchUserById']['parameters']['path'];

export type AuthMeModel =
  operations['getAuthMe']['responses']['200']['content']['application/json'];

export type SearchAppsModel = operations['getApps']['parameters']['query'];
export type AppsPageModel =
  operations['getApps']['responses']['200']['content']['application/json'];

export type SearchGroupsModel = operations['getGroups']['parameters']['query'];
export type GroupPageModel =
  operations['getGroups']['responses']['200']['content']['application/json'];
export type GroupModel =
  operations['getGroupsById']['responses']['200']['content']['application/json'];
export type CreateGroupModel =
  operations['postGroups']['requestBody']['content']['application/json'];
export type UpdateGroupModel =
  operations['patchGroupsById']['requestBody']['content']['application/json'] &
    operations['patchGroupsById']['parameters']['path'];

export type SearchGroupMembersModel =
  operations['getGroup-members']['parameters']['query'];
export type GroupMembersPageModel =
  operations['getGroup-members']['responses']['200']['content']['application/json'];
export type GroupMemberModel =
  operations['getGroup-membersById']['responses']['200']['content']['application/json'];
export type CreateGroupMemberModel =
  operations['postGroup-members']['requestBody']['content']['application/json'];
export type UpdateGroupMemberModel =
  operations['patchGroup-membersById']['requestBody']['content']['application/json'] &
    operations['patchGroup-membersById']['parameters']['path'];
export type DeleteGroupMemberModel =
  operations['deleteGroup-membersById']['parameters']['path'];

export type SearchGroupAppsModel =
  operations['getGroup-apps']['parameters']['query'];
export type GroupAppsPageModel =
  operations['getGroup-apps']['responses']['200']['content']['application/json'];
export type GroupAppModel =
  operations['getGroup-appsById']['responses']['200']['content']['application/json'];
export type CreateGroupAppModel =
  operations['postGroup-apps']['requestBody']['content']['application/json'];
export type DeleteGroupAppModel =
  operations['deleteGroup-appsById']['parameters']['path'];
