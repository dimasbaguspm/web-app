import { AppModel } from '@dimasbaguspm/interfaces';

import { nameToInitials } from '../initial';

export const formatHiAppData = (data?: AppModel | null) => {
  return {
    name: data?.name,
    initial: nameToInitials(data?.name ?? ''),
    description: data?.description,
  };
};
