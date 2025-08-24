import { AccountModel } from '@dimasbaguspm/interfaces';
import { capitalize } from 'lodash';

import { formatDate } from '../date';
import { formatPrice } from '../price';

export const formatSpenicleAccount = (
  account: AccountModel | null | undefined,
) => {
  const isExpense = account?.type === 'expense';

  return {
    capitalizedName: capitalize(account?.name),
    formattedAmount: formatPrice(account?.amount),
    createdAt: account?.createdAt
      ? formatDate(account?.createdAt, 'longDate')
      : '',
    updatedAt: account?.updatedAt
      ? formatDate(account?.updatedAt, 'longDate')
      : '',
    type: capitalize(account?.type),
    isExpense,
  };
};
