import { ThreadGroupModel } from '@dimasbaguspm/interfaces/notunic-api';

import { DateFormat, formatDate } from '../../date';
import { nameToInitials } from '../../initial';

export const formatNotunicThreadGroup = (thread?: ThreadGroupModel | null) => {
  const tagsCount = thread?.tags?.length ?? 0;
  const tagsText = tagsCount > 0 ? `${tagsCount} Tag${tagsCount > 1 ? 's' : ''}` : 'No Tags';

  return {
    name: thread?.name ?? '',
    initialName: nameToInitials(thread?.name ?? ''),
    subtitle: tagsText,
    createdDateTime: thread?.createdAt ? formatDate(thread.createdAt, DateFormat.MEDIUM_DATETIME) : undefined,
    updatedDateTime: thread?.updatedAt ? formatDate(thread.updatedAt, DateFormat.MEDIUM_DATETIME) : undefined,
  } as const;
};
