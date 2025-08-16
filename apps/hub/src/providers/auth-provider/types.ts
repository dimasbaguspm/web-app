import type {
  AppProfileModel,
  GroupMemberModel,
  UserModel,
} from '@dimasbaguspm/hooks/use-api';

export interface AuthProviderModel {
  user: UserModel;
  groupMembers: GroupMemberModel[];
  appProfiles: AppProfileModel[];
}
