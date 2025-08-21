import { AppModel } from '@dimasbaguspm/interfaces';

import { nameToInitials } from '../initial';

export const formatAppData = (data: AppModel) => {
  return {
    name: data.name,
    initial: nameToInitials(data.name),
    description: data.description,
  };
};
