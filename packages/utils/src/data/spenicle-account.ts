import { AccountModel } from '@dimasbaguspm/interfaces';
import { capitalize } from 'lodash';

import { formatDate } from '../date';
import { formatPrice } from '../price';

export const formatSpenicleAccount = (account: AccountModel) => {
  const isExpense = account.type === 'expense';

  return {
    capitalizedName: capitalize(account.name),
    formattedAmount: formatPrice(account.amount),
    createdAt: formatDate(account.createdAt, 'longDate'),
    updatedAt: formatDate(account.updatedAt, 'longDate'),
    type: capitalize(account.type),
    isExpense,
  };
};
