import { CommentActionModel } from '@dimasbaguspm/interfaces/notunic-api';

import { EditCommentActionFormSchema } from './types';

export const formatDefaultValues = (data: CommentActionModel | null): EditCommentActionFormSchema => {
  return {
    commentActionId: data?.id || 0,
    dueDate: data?.dueDate || undefined,
    followedUpDate: data?.followedUpDate || '',
    followedUpNote: data?.followUpNote || '',
  };
};
