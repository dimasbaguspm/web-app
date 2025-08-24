import { AuthMeModel } from '@dimasbaguspm/interfaces';

export type ActiveAppProfileModel =
  AuthMeModel['tokenPayload']['activeProfile'] & {
    toggleSwitchProfile: () => void;
    isSwitchingProfile: boolean;
  };
