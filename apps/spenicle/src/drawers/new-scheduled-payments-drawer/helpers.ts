import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import dayjs from 'dayjs';

import { NewScheduledPaymentsFormSchema } from './types';

export const formatDefaultValues = (payload?: Record<string, string>): NewScheduledPaymentsFormSchema => {
  return {
    type: payload?.type === 'expense' || payload?.type === 'income' ? payload.type : 'expense',
    name: payload?.name ?? '',
    startDate: payload?.startDate ?? formatDate(dayjs(), DateFormat.ISO_DATE),
    interval:
      payload?.interval === 'daily' ||
      payload?.interval === 'weekly' ||
      payload?.interval === 'monthly' ||
      payload?.interval === 'yearly'
        ? payload.interval
        : 'monthly',
    frequency: Number(payload?.frequency) || 1,
    until: payload?.until ? formatDate(payload?.until, DateFormat.ISO_DATE) : undefined,
    amount: Number(payload?.amount) || 0,
    accountId: payload?.accountId ?? '',
    categoryId: payload?.categoryId ?? '',
    notes: payload?.notes ?? '',
  } satisfies NewScheduledPaymentsFormSchema;
};
