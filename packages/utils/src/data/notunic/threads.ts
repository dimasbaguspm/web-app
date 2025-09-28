import { ThreadModel } from '@dimasbaguspm/interfaces/notunic-api';

import { DateFormat, formatDate } from '../../date';
import { nameToInitials } from '../../initial';

export const formatNotunicThread = (thread?: ThreadModel | null) => {
  const description = thread?.content;
  const trimmedDescription = description ? `${description.slice(0, 25) + (description.length > 25 ? '...' : '')}` : '';

  const senderName = thread?.sender?.name || 'Unknown User';
  const hasComments = thread?.commentCount && thread.commentCount > 0;
  const commentsText = hasComments
    ? `${thread?.commentCount} comment${thread?.commentCount > 1 ? 's' : ''}`
    : 'No comments';

  return {
    senderName,
    senderInitial: nameToInitials(senderName),
    description,
    trimmedDescription,
    hasComments,
    commentsText,
    createdDateTime: thread?.createdAt ? formatDate(thread.createdAt, DateFormat.MEDIUM_DATETIME) : undefined,
    updatedDateTime: thread?.updatedAt ? formatDate(thread.updatedAt, DateFormat.MEDIUM_DATETIME) : undefined,
  } as const;
};
