import { ThreadCategoryModel } from '@dimasbaguspm/interfaces/notunic-api';

import { DateFormat, formatDate } from '../../date';
import { nameToInitials } from '../../initial';

export const formatNotunicThreadCategory = (thread?: ThreadCategoryModel | null) => {
  return {
    name: thread?.name ?? '',
    initialName: nameToInitials(thread?.name ?? ''),

    createdDateTime: thread?.createdAt ? formatDate(thread.createdAt, DateFormat.MEDIUM_DATETIME) : undefined,
    updatedDateTime: thread?.updatedAt ? formatDate(thread.updatedAt, DateFormat.MEDIUM_DATETIME) : undefined,
  } as const;
};
