import type { AuthMeModel, UserModel } from '@dimasbaguspm/interfaces';

export interface AuthProviderModel {
  user: UserModel;
  activeProfile: AuthMeModel['tokenPayload']['activeProfile'];
  refetch: () => Promise<void>;
  logout: () => Promise<void>;
}
