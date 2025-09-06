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
  const startDate = dayjs(scheduledTransaction.startDate);
  const currentDate = dayjs();
  const { frequency, interval } = scheduledTransaction;

  if (frequency <= 0) {
    return {
      pastOccurrences: null,
      totalOccurrences: null,
      remainingOccurrences: null,
    };
  }

  // For recurring schedules (until is null), we only calculate pastOccurrences
  if (!scheduledTransaction.until) {
    let pastOccurrences = 0;

    // CRON execution buffer - account for up to 1 hour delay in execution
    const CRON_BUFFER_HOURS = 1;

    if (scheduledTransaction.lastRunAt) {
      // Count how many scheduled occurrences have actually been executed
      let iterationDate = startDate;
      const lastRunDate = dayjs(scheduledTransaction.lastRunAt);

      // Count occurrences from startDate until we find the one that matches or exceeds lastRunAt
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
      // using the backend's nextRunAt as source of truth
      if (isPending && nextRunDate) {
        const cronExecutionDeadline = nextRunDate.add(CRON_BUFFER_HOURS, 'hour');
        if (currentDate.isAfter(cronExecutionDeadline)) {
          pastOccurrences = 1;
        }
      }
    }

    return {
      pastOccurrences,
      totalOccurrences: null, // Infinite schedule
      remainingOccurrences: null, // Infinite schedule
    };
  }

  // For finite schedules (until is defined)
  const untilDate = dayjs(scheduledTransaction.until);

  if (untilDate.isBefore(startDate)) {
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

  // Calculate past occurrences using backend's nextRunAt as source of truth
  let pastOccurrences = 0;

  // CRON execution buffer - account for up to 1 hour delay in execution
  const CRON_BUFFER_HOURS = 1;

  if (scheduledTransaction.lastRunAt) {
    // If we have lastRunAt, count how many scheduled occurrences have actually been executed
    iterationDate = startDate;
    const lastRunDate = dayjs(scheduledTransaction.lastRunAt);

    // Count occurrences from startDate until we find the one that matches or exceeds lastRunAt
    while (iterationDate.isBefore(untilDate) || iterationDate.isSame(untilDate)) {
      // If this scheduled occurrence is before or at the lastRunAt time, it has been executed
      if (iterationDate.isBefore(lastRunDate) || iterationDate.isSame(lastRunDate)) {
        pastOccurrences++;
      } else {
        // Stop counting once we reach future occurrences
        break;
      }

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
    // using the backend's nextRunAt as source of truth
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
