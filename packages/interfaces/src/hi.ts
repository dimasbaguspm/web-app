import { operations } from './generated/hi.openapi';

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
export type AppModel =
  operations['getAppsById']['responses']['200']['content']['application/json'];

export type SearchAppProfilesModel =
  operations['getApp-profiles']['parameters']['query'];
export type AppProfilesPageModel =
  operations['getApp-profiles']['responses']['200']['content']['application/json'];
export type AppProfileModel =
  operations['getApp-profilesById']['responses']['200']['content']['application/json'];
export type CreateAppProfileModel =
  operations['postApp-profiles']['requestBody']['content']['application/json'];
export type UpdateAppProfileModel =
  operations['patchApp-profilesById']['requestBody']['content']['application/json'] &
    operations['patchApp-profilesById']['parameters']['path'];
export type DeleteAppProfileModel =
  operations['deleteApp-profilesById']['parameters']['path'];

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
