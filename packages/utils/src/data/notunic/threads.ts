import { ThreadModel } from '@dimasbaguspm/interfaces/notunic-api';

import { DateFormat, formatDate } from '../../date';
import { nameToInitials } from '../../initial';

export const formatNotunicThread = (thread?: ThreadModel | null) => {
  const description = thread?.content;
  const trimmedDescription = description ? `${description.slice(0, 25) + (description.length > 25 ? '...' : '')}` : '';

  const senderName = thread?.sender?.name || 'Unknown User';
  return {
    senderName,
    senderInitial: nameToInitials(senderName),
    description,
    trimmedDescription,
    createdDateTime: thread?.createdAt ? formatDate(thread.createdAt, DateFormat.MEDIUM_DATETIME) : undefined,
    updatedDateTime: thread?.updatedAt ? formatDate(thread.updatedAt, DateFormat.MEDIUM_DATETIME) : undefined,
  } as const;
};
