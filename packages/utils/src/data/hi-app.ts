import { AppId } from '@dimasbaguspm/constants';
import { AppModel } from '@dimasbaguspm/interfaces';

import { DateFormat, formatDate } from '../date';
import { nameToInitials } from '../initial';

import type { BrandProps } from '@dimasbaguspm/versaur';

export const formatHiAppData = (data?: AppModel | null) => {
  const brandName = (() => {
    switch (data?.id) {
      case AppId.Spenicle:
        return 'spenicle';
      case AppId.Notunic:
        return 'notunic';
      default:
        return 'spenicle';
    }
  })() as BrandProps['name'];

  return {
    name: data?.name,
    brandName,
    initial: nameToInitials(data?.name ?? ''),
    description: data?.description,
    createdDateTime: data?.createdAt ? formatDate(data?.createdAt, DateFormat.MEDIUM_DATETIME) : undefined,
  };
};
