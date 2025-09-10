import { UserModel } from '@dimasbaguspm/interfaces';

import { nameToInitials } from '../initial';

export const formatHiUserData = (data?: UserModel | null) => {
  return {
    name: data?.name,
    initial: nameToInitials(data?.name ?? ''),
  };
};
