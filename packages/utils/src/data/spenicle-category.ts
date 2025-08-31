import { CategoryModel } from '@dimasbaguspm/interfaces';
import { capitalize } from 'lodash';

import { DateFormat, formatDate } from '../date';
import { nameToInitials } from '../initial';

export const formatSpenicleCategory = (category: CategoryModel | null | undefined) => {
  const isIncome = category?.type === 'income';
  const isExpense = category?.type === 'expense';
  const isTransfer = category?.type === 'transfer';

  const variant = isExpense ? 'primary' : isIncome ? 'secondary' : 'tertiary';

  const trimmedNotes = category?.note ? category.note.slice(0, 100) + (category.note.length > 100 ? +'...' : '') : '';
  const note = category?.note;

  return {
    initialName: nameToInitials(category?.name ?? ''),
    name: category?.name ?? '',
    capitalizedName: capitalize(category?.name ?? ''),
    createdAt: category?.createdAt ? formatDate(category?.createdAt, DateFormat.LONG_DATE) : '',
    updatedAt: category?.updatedAt ? formatDate(category?.updatedAt, DateFormat.LONG_DATE) : '',
    variant,
    type: capitalize(category?.type),
    isIncome,
    isExpense,
    isTransfer,
    trimmedNotes,
    note,
  } as const;
};
