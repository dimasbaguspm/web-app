import { CommentCategoryModel } from '@dimasbaguspm/interfaces/notunic-api';

import { DateFormat, formatDate } from '../../date';
import { nameToInitials } from '../../initial';

export const formatNotunicCommentCategory = (commentCategory?: CommentCategoryModel | null) => {
  const description = commentCategory?.name;
  const trimmedDescription = description ? `${description.slice(0, 25) + (description.length > 25 ? '...' : '')}` : '';

  const name = commentCategory?.name || '';

  return {
    name,
    initial: nameToInitials(name),
    description,
    trimmedDescription,
    createdDateTime: commentCategory?.createdAt
      ? formatDate(commentCategory.createdAt, DateFormat.MEDIUM_DATETIME)
      : undefined,
    updatedDateTime: commentCategory?.updatedAt
      ? formatDate(commentCategory.updatedAt, DateFormat.MEDIUM_DATETIME)
      : undefined,
  } as const;
};
