import { UserModel } from '@dimasbaguspm/interfaces';

import { AuthUserRole } from './types';

export const getUserRole = (user: UserModel): AuthUserRole => {
  switch (user.role) {
    case 'admin':
      return AuthUserRole.Admin;
    case 'member':
      return AuthUserRole.Member;
    case 'guest':
      return AuthUserRole.Guest;
  }
  return AuthUserRole.Unknown;
};
