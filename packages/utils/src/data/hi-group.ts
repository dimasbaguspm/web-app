import { GroupModel } from '@dimasbaguspm/interfaces';

import { DateFormat, formatDate } from '../date';
import { nameToInitials } from '../initial';

export const formatHiGroup = (data?: GroupModel | null) => {
  return {
    initialName: nameToInitials(data?.name || ''),
    name: data?.name || '',
    createdDateTime: data?.createdAt ? formatDate(data?.createdAt || '', DateFormat.MEDIUM_DATETIME) : '',
    createdDate: data?.createdAt ? formatDate(data?.createdAt || '', DateFormat.MEDIUM_DATETIME) : '',
  };
};
