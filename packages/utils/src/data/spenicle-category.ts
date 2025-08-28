import { CategoryModel } from '@dimasbaguspm/interfaces';
import { capitalize } from 'lodash';

import { DateFormat, formatDate } from '../date';

export const formatSpenicleCategory = (
  category: CategoryModel | null | undefined,
) => {
  const isIncome = category?.type === 'income';
  const isExpense = category?.type === 'expense';
  const isTransfer = category?.type === 'transfer';

  const variant = isExpense ? 'primary' : isIncome ? 'secondary' : 'tertiary';

  return {
    capitalizedName: capitalize(category?.name),
    createdAt: category?.createdAt
      ? formatDate(category?.createdAt, DateFormat.LONG_DATE)
      : '',
    updatedAt: category?.updatedAt
      ? formatDate(category?.updatedAt, DateFormat.LONG_DATE)
      : '',
    variant,
    type: capitalize(category?.type),
    isIncome,
    isExpense,
    isTransfer,
  } as const;
};
