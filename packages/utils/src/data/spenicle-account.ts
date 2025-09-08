import { AccountModel } from '@dimasbaguspm/interfaces';
import { capitalize } from 'lodash';

import { formatDate } from '../date';
import { nameToInitials } from '../initial';
import { formatPrice } from '../price';

export const formatSpenicleAccount = (account: AccountModel | null | undefined) => {
  const { accountGroups } = account?.embed || {};

  const isExpense = account?.type === 'expense';
  const variant = isExpense ? 'primary' : 'secondary';

  const trimmedNotes = account?.note ? `${account.note.slice(0, 25) + (account.note.length > 25 ? '...' : '')}` : '';
  const note = account?.note;

  const groups = accountGroups || [];
  const hasGroup = !!groups?.length;

  return {
    name: account?.name,
    initialName: nameToInitials(account?.name ?? ''),
    capitalizedName: capitalize(account?.name),
    formattedAmount: formatPrice(account?.amount ?? 0),
    createdAt: account?.createdAt ? formatDate(account?.createdAt, 'longDate') : '',
    updatedAt: account?.updatedAt ? formatDate(account?.updatedAt, 'longDate') : '',
    type: capitalize(account?.type),
    isExpense,
    variant,
    notes: note,
    trimmedNotes,
    hasGroup,
    groups,
  } as const;
};
