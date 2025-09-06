import { ScheduledTransactionModel } from '@dimasbaguspm/interfaces';
import dayjs from 'dayjs';
import { capitalize } from 'lodash';
import { CalendarRangeIcon, CalendarSyncIcon } from 'lucide-react';

import { DateFormat, formatDate } from '../date';
import { formatPrice } from '../price';

export const formatSpenicleScheduledTransaction = (scheduledTransaction: ScheduledTransactionModel | null) => {
  const isIncome = scheduledTransaction?.type === 'income';
  const isExpense = scheduledTransaction?.type === 'expense';

  const isActive = scheduledTransaction?.status === 'active';
  const isPaused = scheduledTransaction?.status === 'paused';
  const isCompleted = scheduledTransaction?.status === 'completed';

  const trimmedNotes = scheduledTransaction?.note
    ? scheduledTransaction.note.slice(0, 100) + (scheduledTransaction.note.length > 100 ? +'...' : '')
    : '';
  const note = scheduledTransaction?.note;

  const variant = isIncome ? 'secondary' : 'primary';
  const capitalizedType = capitalize(scheduledTransaction?.type);
  const amount = formatPrice(scheduledTransaction?.amount ?? 0);

  const intervalName = capitalize(scheduledTransaction?.interval || 'recurring');
  const IntervalIcon = (() => {
    switch (scheduledTransaction?.interval) {
      case 'daily':
      case 'monthly':
      case 'weekly':
      case 'yearly':
        return CalendarRangeIcon;
      default:
        return CalendarSyncIcon;
    }
  })();

  const nextRunDate = (() => {
    if (scheduledTransaction === null) return null;
    if (scheduledTransaction.status === 'completed' || scheduledTransaction.status === 'paused') {
      return null;
    }

    if (!scheduledTransaction.lastRunAt) {
      return dayjs(scheduledTransaction.createdAt);
    }

    const lastRun = dayjs(scheduledTransaction.lastRunAt);
    switch (scheduledTransaction.interval) {
      case 'daily':
        return lastRun.add(scheduledTransaction.frequency, 'day');
      case 'weekly':
        return lastRun.add(scheduledTransaction.frequency, 'week');
      case 'monthly':
        return lastRun.add(scheduledTransaction.frequency, 'month');
      case 'yearly':
        return lastRun.add(scheduledTransaction.frequency, 'year');
      default:
        return null;
    }
  })();

  return {
    isIncome,
    isExpense,
    isActive,
    isPaused,
    isCompleted,
    trimmedNotes,
    variant,
    capitalizedType,
    capitalizedStatus: capitalize(scheduledTransaction?.status ?? ''),
    amount,
    note,
    intervalName,
    IntervalIcon,
    nextRunTime: nextRunDate ? formatDate(nextRunDate.toDate(), DateFormat.TIME_24H) : '',
    nextRunDate: nextRunDate ? formatDate(nextRunDate.toDate(), DateFormat.LONG_DATE) : '',
    nextRunDateTime: nextRunDate ? formatDate(nextRunDate.toDate(), DateFormat.SHORT_DATETIME) : '',
    lastRunAtTime: scheduledTransaction?.lastRunAt
      ? formatDate(scheduledTransaction.lastRunAt, DateFormat.TIME_24H)
      : '',
    lastRunAtDate: scheduledTransaction?.lastRunAt
      ? formatDate(scheduledTransaction.lastRunAt, DateFormat.LONG_DATE)
      : '',
    lastRunAtDateTime: scheduledTransaction?.lastRunAt
      ? formatDate(scheduledTransaction.lastRunAt, DateFormat.SHORT_DATETIME)
      : '',
    createdAt: scheduledTransaction?.createdAt ? formatDate(scheduledTransaction.createdAt, DateFormat.LONG_DATE) : '',
    updatedAt: scheduledTransaction?.updatedAt ? formatDate(scheduledTransaction.updatedAt, DateFormat.LONG_DATE) : '',
  } as const;
};
