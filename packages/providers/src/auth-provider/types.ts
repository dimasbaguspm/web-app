import type { AuthMeModel, UserModel } from '@dimasbaguspm/interfaces';

export enum AuthUserRole {
  Admin = 'admin',
  Member = 'member',
  Guest = 'guest',
  Unknown = 'unknown',
}

export interface AuthProviderModel {
  user: UserModel;
  role: AuthUserRole;
  isAdmin: boolean;
  isMember: boolean;
  isGuest: boolean;
  activeProfile: AuthMeModel['tokenPayload']['activeProfile'];
  refetch: () => Promise<void>;
  logout: () => Promise<void>;
}
