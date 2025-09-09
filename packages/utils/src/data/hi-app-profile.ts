import { AppProfileModel } from '@dimasbaguspm/interfaces';

import { DateFormat, formatDate } from '../date';
import { nameToInitials } from '../initial';

export const formatHiAppProfile = (data?: AppProfileModel | null) => {
  const isGroupRelated = data?.groupId !== null;

  const groupRelatedVariant = isGroupRelated ? 'accent_1' : 'accent_3';

  return {
    name: data?.name,
    initial: nameToInitials(data?.name ?? ''),
    isGroupRelated,
    type: isGroupRelated ? 'Group' : 'Personal',
    groupRelatedVariant,
    createdDateTime: data?.createdAt ? formatDate(data.createdAt, DateFormat.MEDIUM_DATETIME) : '',
  } as const;
};
