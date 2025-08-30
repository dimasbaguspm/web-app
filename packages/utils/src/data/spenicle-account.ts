import { AccountModel } from '@dimasbaguspm/interfaces';
import { capitalize } from 'lodash';

import { formatDate } from '../date';
import { formatPrice } from '../price';

export const formatSpenicleAccount = (
  account: AccountModel | null | undefined,
) => {
  const isExpense = account?.type === 'expense';
  const variant = isExpense ? 'primary' : 'secondary';

  const trimmedNotes = account?.note
    ? account.note.slice(0, 100) + (account.note.length > 100 ? '...' : '')
    : '';
  const note = account?.note;

  return {
    name: account?.name,
    capitalizedName: capitalize(account?.name),
    formattedAmount: formatPrice(account?.amount ?? 0),
    createdAt: account?.createdAt
      ? formatDate(account?.createdAt, 'longDate')
      : '',
    updatedAt: account?.updatedAt
      ? formatDate(account?.updatedAt, 'longDate')
      : '',
    type: capitalize(account?.type),
    isExpense,
    variant,
    notes: note,
    trimmedNotes,
  } as const;
};
