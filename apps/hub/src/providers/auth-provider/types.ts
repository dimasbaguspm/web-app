import type { GroupMemberModel, UserModel } from '@dimasbaguspm/hooks/use-api';

export interface AuthProviderModel {
  user: UserModel;
  groupMembers: GroupMemberModel[];
}
