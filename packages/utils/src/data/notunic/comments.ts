import { CommentModel } from '@dimasbaguspm/interfaces/notunic-api';

import { DateFormat, formatDate } from '../../date';
import { nameToInitials } from '../../initial';

export const formatNotunicComment = (comment?: CommentModel | null) => {
  const description = comment?.content;
  const trimmedDescription = description ? `${description.slice(0, 25) + (description.length > 25 ? '...' : '')}` : '';

  const senderName = comment?.sender?.name || 'Unknown User';
  return {
    senderName,
    senderInitial: nameToInitials(senderName),
    description,
    trimmedDescription,
    createdDateTime: comment?.createdAt ? formatDate(comment.createdAt, DateFormat.MEDIUM_DATETIME) : undefined,
    updatedDateTime: comment?.updatedAt ? formatDate(comment.updatedAt, DateFormat.MEDIUM_DATETIME) : undefined,
  } as const;
};
