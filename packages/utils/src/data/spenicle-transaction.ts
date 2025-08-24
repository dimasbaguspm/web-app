import { TransactionModel } from '@dimasbaguspm/interfaces';
import { capitalize } from 'lodash';

import { DateFormat, formatDate } from '../date';

export const formatSpenicleTransaction = (transaction: TransactionModel) => {
  const isIncome = transaction.type === 'income';
  const isExpense = transaction.type === 'expense';
  const isTransfer = transaction.type === 'transfer';

  const trimmedNotes = transaction.note
    ? transaction.note.slice(0, 100) +
      (transaction.note.length > 100 ? +'...' : '')
    : '';

  const variant = isIncome ? 'secondary' : isExpense ? 'primary' : 'tertiary';
  const capitalizedType = capitalize(transaction.type);

  return {
    isIncome,
    isExpense,
    isTransfer,
    trimmedNotes,
    variant,
    capitalizedType,
    date: formatDate(transaction.date, DateFormat.TIME_24H),
    createdAt: formatDate(transaction.createdAt, DateFormat.LONG_DATE),
    updatedAt: formatDate(transaction.updatedAt, DateFormat.LONG_DATE),
  } as const;
};
