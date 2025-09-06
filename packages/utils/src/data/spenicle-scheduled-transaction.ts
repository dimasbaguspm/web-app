import { ScheduledTransactionModel } from '@dimasbaguspm/interfaces';
import dayjs from 'dayjs';
import { capitalize } from 'lodash';
import { CalendarRangeIcon, CalendarSyncIcon } from 'lucide-react';

import { DateFormat, formatDate } from '../date';
import { formatPrice } from '../price';

const calculateOccurrences = (
  scheduledTransaction: ScheduledTransactionModel,
  nextRunDate: dayjs.Dayjs | null,
  isPending: boolean,
): {
  pastOccurrences: number | null;
  totalOccurrences: number | null;
  remainingOccurrences: number | null;
} => {
  if (!scheduledTransaction.until) {
    return {
      pastOccurrences: null,
      totalOccurrences: null,
      remainingOccurrences: null,
    };
  }

  const startDate = dayjs(scheduledTransaction.startDate);
  const untilDate = dayjs(scheduledTransaction.until);
  const currentDate = dayjs();
  const { frequency, interval } = scheduledTransaction;

  if (untilDate.isBefore(startDate) || frequency <= 0) {
    return {
      pastOccurrences: 0,
      totalOccurrences: 0,
      remainingOccurrences: 0,
    };
  }

  // Calculate total occurrences from start to until
  let iterationDate = startDate;
  let totalOccurrences = 0;

  while (iterationDate.isBefore(untilDate) || iterationDate.isSame(untilDate)) {
    totalOccurrences++;

    switch (interval) {
      case 'daily':
        iterationDate = iterationDate.add(frequency, 'day');
        break;
      case 'weekly':
        iterationDate = iterationDate.add(frequency, 'week');
        break;
      case 'monthly':
        iterationDate = iterationDate.add(frequency, 'month');
        break;
      case 'yearly':
        iterationDate = iterationDate.add(frequency, 'year');
        break;
      default:
        return {
          pastOccurrences: null,
          totalOccurrences: null,
          remainingOccurrences: null,
        };
    }
  }

  // Calculate past occurrences using the existing nextRunDate logic
  let pastOccurrences = 0;

  // CRON execution buffer - account for up to 1 hour delay in execution
  const CRON_BUFFER_HOURS = 1;

  if (scheduledTransaction.lastRunAt) {
    // If we have lastRunAt, calculate how many occurrences happened from start to lastRunAt
    iterationDate = startDate;
    const lastRunDate = dayjs(scheduledTransaction.lastRunAt);

    while (iterationDate.isBefore(lastRunDate) || iterationDate.isSame(lastRunDate)) {
      pastOccurrences++;

      switch (interval) {
        case 'daily':
          iterationDate = iterationDate.add(frequency, 'day');
          break;
        case 'weekly':
          iterationDate = iterationDate.add(frequency, 'week');
          break;
        case 'monthly':
          iterationDate = iterationDate.add(frequency, 'month');
          break;
        case 'yearly':
          iterationDate = iterationDate.add(frequency, 'year');
          break;
        default:
          return {
            pastOccurrences: null,
            totalOccurrences: null,
            remainingOccurrences: null,
          };
      }

      // Break if we've reached the until date
      if (iterationDate.isAfter(untilDate)) {
        break;
      }
    }

    // If the next run is pending AND has passed the CRON execution window,
    // count it as a past occurrence
    if (isPending && nextRunDate) {
      const cronExecutionDeadline = nextRunDate.add(CRON_BUFFER_HOURS, 'hour');
      if (currentDate.isAfter(cronExecutionDeadline)) {
        pastOccurrences++;
      }
    }
  } else {
    // If no lastRunAt, check if the first occurrence should have happened
    // by using the nextRunDate logic (which uses createdAt when no lastRunAt)
    if (isPending && nextRunDate) {
      const cronExecutionDeadline = nextRunDate.add(CRON_BUFFER_HOURS, 'hour');
      if (currentDate.isAfter(cronExecutionDeadline)) {
        pastOccurrences = 1;
      }
    }
  }

  // Ensure past occurrences doesn't exceed total occurrences
  pastOccurrences = Math.min(pastOccurrences, totalOccurrences);
  const remainingOccurrences = totalOccurrences - pastOccurrences;

  return {
    pastOccurrences,
    totalOccurrences,
    remainingOccurrences,
  };
};

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

  const nextRunDate = (() => {
    if (scheduledTransaction === null) return null;
    if (scheduledTransaction.status === 'completed' || scheduledTransaction.status === 'paused') {
      return null;
    }

    if (!scheduledTransaction.lastRunAt) {
      return dayjs(scheduledTransaction.startDate);
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

  const occurrences = scheduledTransaction
    ? calculateOccurrences(scheduledTransaction, nextRunDate, isPending)
    : {
        pastOccurrences: null,
        totalOccurrences: null,
        remainingOccurrences: null,
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
    untilDateTime: scheduledTransaction?.until ? formatDate(scheduledTransaction.until, DateFormat.MEDIUM_DATE) : null,
    nextRunDateTime: nextRunDate
      ? formatDate(nextRunDate.toDate(), DateFormat.MEDIUM_DATE) +
        ' ' +
        formatDate(nextRunDate.toDate(), DateFormat.TIME_24H)
      : '',
    lastRunAtDateTime: scheduledTransaction?.lastRunAt
      ? formatDate(scheduledTransaction.lastRunAt, DateFormat.MEDIUM_DATE)
      : '',
    createdAt: scheduledTransaction?.createdAt ? formatDate(scheduledTransaction.createdAt, DateFormat.LONG_DATE) : '',
    updatedAt: scheduledTransaction?.updatedAt ? formatDate(scheduledTransaction.updatedAt, DateFormat.LONG_DATE) : '',
  } as const;
};
