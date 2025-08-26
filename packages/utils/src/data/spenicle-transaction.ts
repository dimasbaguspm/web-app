import { TransactionModel } from '@dimasbaguspm/interfaces';
import { capitalize } from 'lodash';

import { DateFormat, formatDate } from '../date';
import { formatPrice } from '../price';

export const formatSpenicleTransaction = (
  transaction: TransactionModel | null,
) => {
  const isIncome = transaction?.type === 'income';
  const isExpense = transaction?.type === 'expense';
  const isTransfer = transaction?.type === 'transfer';

  const trimmedNotes = transaction?.note
    ? transaction.note.slice(0, 100) +
      (transaction.note.length > 100 ? +'...' : '')
    : '';
  const note = transaction?.note;

  const variant = isIncome ? 'secondary' : isExpense ? 'primary' : 'tertiary';
  const capitalizedType = capitalize(transaction?.type);
  const amount = formatPrice(transaction?.amount);

  return {
    isIncome,
    isExpense,
    isTransfer,
    trimmedNotes,
    variant,
    capitalizedType,
    amount,
    note,
    time: transaction?.date
      ? formatDate(transaction.date, DateFormat.TIME_24H)
      : '',
    date: transaction?.date
      ? formatDate(transaction.date, DateFormat.LONG_DATE)
      : '',
    createdAt: transaction?.createdAt
      ? formatDate(transaction.createdAt, DateFormat.LONG_DATE)
      : '',
    updatedAt: transaction?.updatedAt
      ? formatDate(transaction.updatedAt, DateFormat.LONG_DATE)
      : '',
  } as const;
};
