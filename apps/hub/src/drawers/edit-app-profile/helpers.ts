import { EditAppProfileFormSchema } from './types';

export const formatDefaultValues = (payload: Record<string, unknown> | undefined): EditAppProfileFormSchema => {
  return {
    appId: typeof payload?.appId === 'number' ? payload.appId : 0,
    name: typeof payload?.name === 'string' ? payload.name : '',
  };
};
