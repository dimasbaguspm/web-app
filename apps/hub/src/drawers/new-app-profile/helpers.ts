import { NewAppProfileFormSchema } from './types';

export const formatDefaultValues = (payload: Record<string, unknown> | undefined): NewAppProfileFormSchema => {
  return {
    appId: typeof payload?.appId === 'number' ? payload.appId : 0,
    name: typeof payload?.name === 'string' ? payload.name : '',
    type: payload?.type === 'group' ? 'group' : 'personal',
    relatedId: typeof payload?.relatedId === 'number' ? payload.relatedId : 0,
  };
};
