import { CommentModel } from '@dimasbaguspm/interfaces/notunic-api';
import dayjs from 'dayjs';

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
  const actionDueDate = comment?.action?.dueDate ? formatDate(comment.action.dueDate, DateFormat.MEDIUM_DATE) : '';
  const actionFollowUpDate = comment?.action?.followedUpDate
    ? formatDate(comment.action.followedUpDate, DateFormat.MEDIUM_DATE)
    : '';
  const isActionOverdue = dayjs().isAfter(dayjs(comment?.action?.dueDate)) && !isActionDone;
  const isActionNearDue =
    comment?.action?.dueDate && dayjs().add(3, 'day').isAfter(dayjs(comment.action.dueDate)) && !isActionDone;

  return {
    senderName,
    senderInitial: nameToInitials(senderName),
    description,
    trimmedDescription,
    categories: comment?.categories?.map((cat) => cat.name) || [],
    repliesCount,
    isParent,
    hasAction,
    isActionDone,
    repliesText,
    isActionOverdue,
    isActionNearDue,
    actionDueDate,
    actionFollowUpDate,
    createdDateTime: comment?.createdAt
      ? formatDate(comment.createdAt, DateFormat.TIME_24H) + ' ' + formatDate(comment.createdAt, DateFormat.MEDIUM_DATE)
      : undefined,
    updatedDateTime: comment?.updatedAt
      ? formatDate(comment.updatedAt, DateFormat.TIME_24H) + ' ' + formatDate(comment.updatedAt, DateFormat.MEDIUM_DATE)
      : undefined,
  } as const;
};
