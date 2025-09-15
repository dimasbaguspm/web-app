import { AppProfileModel } from '@dimasbaguspm/interfaces';

export type ActiveAppProfileModel = {
  hasProfile: boolean;
  profile: AppProfileModel;
  refetchProfile: () => Promise<void>;
  isDifferentApp: boolean;
  shouldVerifyProfileOwnership?: boolean;
};
