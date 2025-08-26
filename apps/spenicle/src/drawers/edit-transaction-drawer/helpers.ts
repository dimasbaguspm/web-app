import { TransactionModel } from '@dimasbaguspm/interfaces';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import dayjs from 'dayjs';

import { EditTransactionFormSchema } from './types';

export const formatDefaultValues = (
  transaction?: TransactionModel | null,
  payload?: Record<string, unknown>,
): EditTransactionFormSchema => {
  const isPayloadExist = payload && Object.keys(payload).length > 0;

  if (isPayloadExist) {
    return {
      type:
        payload?.type === 'expense' ||
        payload?.type === 'income' ||
        payload?.type === 'transfer'
          ? payload.type
          : 'expense',
      date:
        typeof payload?.date === 'string'
          ? payload?.date
          : formatDate(dayjs(), DateFormat.ISO_DATE),
      time:
        typeof payload?.time === 'string'
          ? payload?.time
          : formatDate(dayjs(), DateFormat.TIME_24H),
      accountId: payload?.accountId ? +payload.accountId : 0,
      destinationAccountId: payload?.destinationAccountId
        ? +payload.destinationAccountId
        : 0,
      categoryId: payload?.categoryId ? +payload.categoryId : 0,
      amount: payload?.amount
        ? isNaN(+payload?.amount)
          ? 0
          : +payload.amount!
        : 0,
      notes: typeof payload?.notes === 'string' ? payload?.notes : '',
    };
  } else {
    return {
      type: transaction?.type ?? 'expense',
      date: formatDate(
        transaction?.date ?? dayjs().toISOString(),
        DateFormat.ISO_DATE,
      ),
      time: formatDate(
        transaction?.date ?? dayjs().toISOString(),
        DateFormat.TIME_24H,
      ),
      accountId: transaction?.accountId ?? 0,
      destinationAccountId: transaction?.destinationAccountId ?? 0,
      categoryId: transaction?.categoryId ?? 0,
      amount: transaction?.amount ? +transaction.amount : 0,
      notes: transaction?.note ?? '',
    };
  }
};
