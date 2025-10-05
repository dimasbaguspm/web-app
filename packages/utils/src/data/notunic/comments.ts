import { CommentModel } from '@dimasbaguspm/interfaces/notunic-api';

import { DateFormat, formatDate } from '../../date';
import { nameToInitials } from '../../initial';

export const formatNotunicComment = (comment?: CommentModel | null) => {
  const description = comment?.content;
  const trimmedDescription = description ? `${description.slice(0, 25) + (description.length > 25 ? '...' : '')}` : '';

  const senderName = comment?.sender?.name || 'Unknown User';

  const repliesCount = comment?.repliesCommentIds?.length || 0;
  const repliesText = repliesCount > 0 ? `${repliesCount} repl${repliesCount > 1 ? 'ies' : 'y'}` : 'No reply';

  const isParent = !comment?.parentCommentId;

  const hasAction = Boolean(comment?.action);
  const isActionDone = comment?.action?.status === 'done';
  const actionDueDateTime = comment?.action?.dueDate
    ? formatDate(comment.action.dueDate, DateFormat.MEDIUM_DATETIME)
    : '';
  const actionFollowUpDateTime = comment?.action?.followedUpDate
    ? formatDate(comment.action.followedUpDate, DateFormat.MEDIUM_DATETIME)
    : '';

  return {
    senderName,
    senderInitial: nameToInitials(senderName),
    description,
    trimmedDescription,
    repliesCount,
    isParent,
    hasAction,
    isActionDone,
    repliesText,
    actionDueDateTime,
    actionFollowUpDateTime,
    createdDateTime: comment?.createdAt
      ? formatDate(comment.createdAt, DateFormat.TIME_24H) + ' ' + formatDate(comment.createdAt, DateFormat.MEDIUM_DATE)
      : undefined,
    updatedDateTime: comment?.updatedAt
      ? formatDate(comment.updatedAt, DateFormat.TIME_24H) + ' ' + formatDate(comment.updatedAt, DateFormat.MEDIUM_DATE)
      : undefined,
  } as const;
};
