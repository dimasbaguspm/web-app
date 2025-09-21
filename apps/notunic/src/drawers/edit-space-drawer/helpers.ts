import { SpaceModel, UpdateSpaceModel } from '@dimasbaguspm/interfaces/notunic-api';

import { EditSpaceFormSchema } from './types';

export const formatToPayload = (spaceId: number, formData: EditSpaceFormSchema): UpdateSpaceModel => {
  return {
    id: spaceId,
    name: formData.name,
    description: formData.description,
  };
};

export const formatToFormValue = (data?: SpaceModel | null): EditSpaceFormSchema => {
  return {
    name: data?.name || '',
    description: data?.description || '',
  };
};
