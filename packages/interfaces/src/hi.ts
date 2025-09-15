import { operations } from './generated/hi.openapi';

export type SearchUsersModel = NonNullable<operations['getUser']['parameters']['query']>;
export type UsersPageModel = operations['getUser']['responses']['200']['content']['application/json'];
export type UserModel = operations['getUserMe']['responses']['200']['content']['application/json'];
export type UpdateUserModel = operations['patchUserMe']['requestBody']['content']['application/json'];
export type UpdateUserPasswordModel = operations['patchUserMePassword']['requestBody']['content']['application/json'];

export type AuthMeModel = operations['getAuthMe']['responses']['200']['content']['application/json'];
export type SetActiveProfileModel =
  operations['postAuthSet-active-profile']['requestBody']['content']['application/json'];

export type SearchAppsModel = NonNullable<operations['getApps']['parameters']['query']>;
export type AppsPageModel = operations['getApps']['responses']['200']['content']['application/json'];
export type AppModel = operations['getAppsById']['responses']['200']['content']['application/json'];
export type UpdateAppModel = operations['patchAppsById']['requestBody']['content']['application/json'] &
  operations['patchAppsById']['parameters']['path'];

export type SearchAppProfilesModel = NonNullable<operations['getApp-profiles']['parameters']['query']>;
export type AppProfilesPageModel = operations['getApp-profiles']['responses']['200']['content']['application/json'];
export type AppProfileModel = operations['getApp-profilesById']['responses']['200']['content']['application/json'];
export type CreateAppProfileModel = operations['postApp-profiles']['requestBody']['content']['application/json'];
export type UpdateAppProfileModel = operations['patchApp-profilesById']['requestBody']['content']['application/json'] &
  operations['patchApp-profilesById']['parameters']['path'];
export type DeleteAppProfileModel = operations['deleteApp-profilesById']['parameters']['path'];

export type UpsertAppProfileAuthByIdModel =
  operations['patchApp-profiles-authById']['requestBody']['content']['application/json'] &
    operations['patchApp-profiles-authById']['parameters']['path'];
export type UpsertAppProfileAuthModel =
  operations['patchApp-profiles-auth']['requestBody']['content']['application/json'];
export type VerifyAppProfileAuthModel =
  operations['postApp-profiles-authVerify-pin']['requestBody']['content']['application/json'];
export type VerifyAppProfileAuthResponseModel =
  operations['postApp-profiles-authVerify-pin']['responses']['200']['content']['application/json'];

export type SearchGroupsModel = NonNullable<operations['getGroups']['parameters']['query']>;
export type GroupPageModel = operations['getGroups']['responses']['200']['content']['application/json'];
export type GroupModel = operations['getGroupsById']['responses']['200']['content']['application/json'];
export type AddBulkGroupMemberModel = operations['postGroupsByIdBulk']['requestBody']['content']['application/json'] &
  operations['postGroupsByIdBulk']['parameters']['path'];
export type RemoveBulkGroupMemberModel =
  operations['deleteGroupsByIdBulk']['requestBody']['content']['application/json'] &
    operations['deleteGroupsByIdBulk']['parameters']['path'];
export type CreateGroupModel = operations['postGroups']['requestBody']['content']['application/json'];
export type UpdateGroupModel = operations['patchGroupsById']['requestBody']['content']['application/json'] &
  operations['patchGroupsById']['parameters']['path'];

export type SearchGroupMembersModel = NonNullable<operations['getGroup-members']['parameters']['query']>;
export type GroupMembersPageModel = operations['getGroup-members']['responses']['200']['content']['application/json'];
export type GroupMemberModel = operations['getGroup-membersById']['responses']['200']['content']['application/json'];
export type CreateGroupMemberModel = operations['postGroup-members']['requestBody']['content']['application/json'];
export type UpdateGroupMemberModel =
  operations['patchGroup-membersById']['requestBody']['content']['application/json'] &
    operations['patchGroup-membersById']['parameters']['path'];
export type DeleteGroupMemberModel = operations['deleteGroup-membersById']['parameters']['path'];
