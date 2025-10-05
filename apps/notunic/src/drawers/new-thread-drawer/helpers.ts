import { NewThreadFormSchema } from './types';

export const formatDefaultValues = (payload?: Record<string, unknown>): NewThreadFormSchema => {
  console.log('payload in formatDefaultValues', payload?.categoryIds);
  return {
    title: (payload?.title as string) || '',
    content: (payload?.content as string) || '',
    spaceId: (payload?.spaceId as number) || 0,
    categoryIds: Array.isArray(payload?.categoryIds)
      ? (payload?.categoryIds as number[])
      : typeof payload?.categoryIds === 'number'
        ? [payload.categoryIds as number]
        : [],
  };
};
