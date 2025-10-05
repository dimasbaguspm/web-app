import { ThreadModel } from '@dimasbaguspm/interfaces/notunic-api';

import { EditThreadFormSchema } from './types';

export const formatDefaultValues = (
  data: ThreadModel | null,
  payload?: Record<string, unknown>,
): EditThreadFormSchema => {
  return {
    title: (payload?.title as string) || data?.title || '',
    content: (payload?.content as string) || data?.content || '',
    spaceId: (payload?.spaceId as number) || 0,
    threadId: (payload?.threadId as number) || 0,
    categoryIds: Array.isArray(payload?.categoryIds)
      ? (payload?.categoryIds as number[])
      : data?.categories.map((category) => category.id) || [],
  };
};
