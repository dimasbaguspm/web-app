import { ScheduledTransactionModel } from '@dimasbaguspm/interfaces';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';

import { EditScheduledPaymentsFormSchema } from './types';

export const formatDefaultValues = (
  data: ScheduledTransactionModel | null,
  payload?: Record<string, string>,
): EditScheduledPaymentsFormSchema => {
  return {
    id: data?.id || 0,
    type: payload?.type === 'expense' || payload?.type === 'income' ? payload.type : (data?.type ?? 'expense'),
    name: payload?.name ?? data?.name ?? '',
    startDate: payload?.startDate ?? data?.startDate ?? '',
    interval:
      payload?.interval === 'daily' ||
      payload?.interval === 'weekly' ||
      payload?.interval === 'monthly' ||
      payload?.interval === 'yearly'
        ? payload.interval
        : (data?.interval ?? 'monthly'),
    frequency: Number(payload?.frequency) || data?.frequency || 1,
    until: payload?.until ? formatDate(payload?.until, DateFormat.ISO_DATE) : (data?.until ?? undefined),
    amount: (Number(payload?.amount) || data?.amount) ?? 0,
    accountId: payload?.accountId ?? data?.accountId ?? 0,
    categoryId: payload?.categoryId ?? data?.categoryId ?? 0,
    notes: payload?.notes ?? data?.note ?? '',
  } satisfies EditScheduledPaymentsFormSchema;
};
