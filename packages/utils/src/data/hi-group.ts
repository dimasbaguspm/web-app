import { GroupModel } from '@dimasbaguspm/interfaces';

import { DateFormat, formatDate } from '../date';
import { nameToInitials } from '../initial';

export const formatHiGroup = (data?: GroupModel | null) => {
  return {
    initialName: nameToInitials(data?.name || ''),
    name: data?.name || '',
    createdDateTime: formatDate(data?.createdAt || '', DateFormat.MEDIUM_DATETIME),
    createdDate: formatDate(data?.createdAt || '', DateFormat.MEDIUM_DATETIME),
  };
};
