import { SpaceModel } from '@dimasbaguspm/interfaces/notunic-api';

import { DateFormat, formatDate } from '../../date';
import { nameToInitials } from '../../initial';

export const formatNotunicSpace = (space?: SpaceModel | null) => {
  const description = space?.description;
  const trimmedDescription = description ? `${description.slice(0, 25) + (description.length > 25 ? '...' : '')}` : '';

  return {
    name: space?.name ?? '',
    initial: nameToInitials(space?.name ?? ''),
    description,
    trimmedDescription,
    createdDateTime: space?.createdAt ? formatDate(space.createdAt, DateFormat.MEDIUM_DATETIME) : undefined,
    updatedDateTime: space?.updatedAt ? formatDate(space.updatedAt, DateFormat.MEDIUM_DATETIME) : undefined,
  } as const;
};
