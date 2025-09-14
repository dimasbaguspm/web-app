import { AppModel, UpdateAppModel } from '@dimasbaguspm/interfaces';

import { EditAppDrawerFormSchema } from './types';

export const formatDefaultValues = (data: AppModel): EditAppDrawerFormSchema => {
  return {
    name: data.name,
    outline: data.outline,
    url: data.url,
    description: data.description ?? undefined,
    documentationUrl: data.documentationUrl ?? undefined,
    termsOfServiceUrl: data.termsOfServiceUrl ?? undefined,
    privacyPolicyUrl: data.privacyPolicyUrl ?? undefined,
  };
};

export const formatUpdatePayload = (id: number, data: EditAppDrawerFormSchema): UpdateAppModel => {
  return {
    id,
    name: data.name,
    outline: data.outline,
    url: data.url,
    description: data.description ?? undefined,
    documentationUrl: data.documentationUrl ?? undefined,
    termsOfServiceUrl: data.termsOfServiceUrl ?? undefined,
    privacyPolicyUrl: data.privacyPolicyUrl ?? undefined,
  };
};
