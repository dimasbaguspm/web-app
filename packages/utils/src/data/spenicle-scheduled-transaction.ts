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

  const statusVariant = isActive ? 'secondary' : isPaused ? 'warning' : isCompleted && 'success';

  const isRecurring = scheduledTransaction?.until === null;

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

  const nextRunDate = scheduledTransaction?.nextRunAt ? dayjs(scheduledTransaction.nextRunAt) : null;
  const isPending = nextRunDate ? nextRunDate.isBefore(dayjs()) : false;

  const humanizedFrequency = (() => {
    if (scheduledTransaction === null) return '';
    if (scheduledTransaction.frequency <= 0) return '';

    let label = '';
    switch (scheduledTransaction.interval) {
      case 'daily':
        label = scheduledTransaction.frequency === 1 ? 'Every day' : `Every ${scheduledTransaction.frequency} days`;
        break;
      case 'weekly':
        label = scheduledTransaction.frequency === 1 ? 'Every week' : `Every ${scheduledTransaction.frequency} weeks`;
        break;
      case 'monthly':
        label = scheduledTransaction.frequency === 1 ? 'Every month' : `Every ${scheduledTransaction.frequency} months`;
        break;
      case 'yearly':
        label = scheduledTransaction.frequency === 1 ? 'Every year' : `Every ${scheduledTransaction.frequency} years`;
        break;
      default:
        label = '';
    }

    return label;
  })();

  const pastOccurrences = scheduledTransaction?.totalRuns ?? 0;
  const totalOccurrences = scheduledTransaction?.totalOccurences ?? 0;
  const remainingOccurrences = totalOccurrences ? totalOccurrences - pastOccurrences : null;

  const occurrences = {
    pastOccurrences,
    totalOccurrences,
    remainingOccurrences,
  };

  return {
    name: scheduledTransaction?.name || '',
    isIncome,
    isExpense,
    isActive,
    isPaused,
    isPending,
    isCompleted,
    isRecurring,
    trimmedNotes,
    variant,
    capitalizedType,
    capitalizedStatus: capitalize(scheduledTransaction?.status ?? ''),
    humanizedFrequency,
    statusVariant,
    amount,
    note,
    intervalName,
    IntervalIcon,
    pastOccurrences: occurrences.pastOccurrences,
    totalOccurrences: occurrences.totalOccurrences,
    remainingOccurrences: occurrences.remainingOccurrences,
    installmentProgress:
      occurrences.totalOccurrences && occurrences.pastOccurrences !== null
        ? `${occurrences.pastOccurrences}/${occurrences.totalOccurrences}`
        : null,
    untilDateTime: scheduledTransaction?.until
      ? formatDate(scheduledTransaction.until, DateFormat.MEDIUM_DATETIME)
      : '',
    nextRunDateTime: nextRunDate ? formatDate(nextRunDate.toDate(), DateFormat.MEDIUM_DATETIME) : '',
    lastRunAtDateTime: scheduledTransaction?.lastRunAt
      ? formatDate(scheduledTransaction.lastRunAt, DateFormat.MEDIUM_DATETIME)
      : '',
    createdAt: scheduledTransaction?.createdAt ? formatDate(scheduledTransaction.createdAt, DateFormat.LONG_DATE) : '',
    updatedAt: scheduledTransaction?.updatedAt ? formatDate(scheduledTransaction.updatedAt, DateFormat.LONG_DATE) : '',
  } as const;
};
