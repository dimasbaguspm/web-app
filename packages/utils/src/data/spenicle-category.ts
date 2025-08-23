import { CategoryModel } from '@dimasbaguspm/interfaces';
import { capitalize } from 'lodash';

import { formatDate } from '../date';

export const formatSpenicleCategory = (category: CategoryModel) => {
  return {
    capitalizedName: capitalize(category.name),
    createdAt: formatDate(category.createdAt, 'longDate'),
    updatedAt: formatDate(category.updatedAt, 'longDate'),
  };
};
