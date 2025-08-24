import { CategoryModel } from '@dimasbaguspm/interfaces';
import { capitalize } from 'lodash';

import { formatDate } from '../date';

export const formatSpenicleCategory = (
  category: CategoryModel | null | undefined,
) => {
  return {
    capitalizedName: capitalize(category?.name),
    createdAt: category?.createdAt
      ? formatDate(category?.createdAt, 'longDate')
      : '',
    updatedAt: category?.updatedAt
      ? formatDate(category?.updatedAt, 'longDate')
      : '',
  };
};
