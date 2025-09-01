import { AppProfileModel } from '@dimasbaguspm/interfaces';

export type ActiveAppProfileModel = {
  profile: AppProfileModel;
  toggleSwitchProfile: () => void;
  isSwitchingProfile: boolean;
};
