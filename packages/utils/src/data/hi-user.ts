import { UserModel } from '@dimasbaguspm/interfaces';

import { DateFormat, formatDate } from '../date';
import { nameToInitials } from '../initial';

export const formatHiUserData = (data?: UserModel | null) => {
  return {
    name: data?.name,
    initial: nameToInitials(data?.name ?? ''),
    createdDateTime: data?.createdAt ? formatDate(data.createdAt, DateFormat.MEDIUM_DATETIME) : undefined,
  };
};
