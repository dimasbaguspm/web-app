import { TransactionModel } from '@dimasbaguspm/interfaces';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import dayjs from 'dayjs';

import { NewTransactionFormSchema } from '../new-transaction-drawer/types';

export const generatePayloadCopyTransaction = (
  transactionData: TransactionModel,
): Partial<NewTransactionFormSchema> => {
  return {
    type: transactionData?.type,
    date: formatDate(dayjs(), DateFormat.ISO_DATE),
    time: formatDate(dayjs(), DateFormat.TIME_24H),
    accountId:
      typeof transactionData?.accountId === 'number'
        ? transactionData?.accountId
        : undefined,
    destinationAccountId:
      typeof transactionData?.destinationAccountId === 'number'
        ? transactionData?.destinationAccountId
        : undefined,
    categoryId:
      typeof transactionData?.categoryId === 'number'
        ? transactionData?.categoryId
        : undefined,
    amount:
      typeof transactionData?.amount === 'number'
        ? transactionData?.amount
        : undefined,
    notes: transactionData?.note ?? undefined,
  };
};
