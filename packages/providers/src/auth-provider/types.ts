import type {
  AppProfileModel,
  AuthMeModel,
  GroupMemberModel,
  UserModel,
} from '@dimasbaguspm/interfaces';

export interface AuthProviderModel {
  user: UserModel;
  groupMembers: GroupMemberModel[];
  appProfiles: AppProfileModel[];
  activeProfile: AuthMeModel['tokenPayload']['activeProfile'];
  refetch: () => Promise<void>;
}
