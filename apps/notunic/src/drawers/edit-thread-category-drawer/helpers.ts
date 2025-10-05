import { ThreadCategoryModel } from '@dimasbaguspm/interfaces/notunic-api';

import { EditThreadCategoryFormSchema } from './types';

export const formatDefaultValues = (data: ThreadCategoryModel | null): EditThreadCategoryFormSchema => ({
  name: data?.name || '',
  description: data?.description || '',
});
