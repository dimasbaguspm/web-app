import { CommentCategoryModel } from '@dimasbaguspm/interfaces/notunic-api';

import { EditCommentCategoryFormSchema } from './types';

export const formatDefaultValues = (data: CommentCategoryModel | null): EditCommentCategoryFormSchema => ({
  name: data?.name || '',
  description: data?.description || '',
});
