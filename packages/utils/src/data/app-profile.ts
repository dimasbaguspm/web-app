import { AppProfileModel } from '@dimasbaguspm/interfaces';

import { nameToInitials } from '../initial';

export const formatAppProfile = (data: AppProfileModel) => {
  const isGroupRelated = data.groupId !== null;
  return {
    name: data.name,
    initial: nameToInitials(data.name),
    isGroupRelated,
  };
};
