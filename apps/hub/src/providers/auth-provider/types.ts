import type { AppProfileModel, GroupMemberModel, UserModel } from '@dimasbaguspm/interfaces';

export interface AuthProviderModel {
  user: UserModel;
  groupMembers: GroupMemberModel[];
  appProfiles: AppProfileModel[];
}
