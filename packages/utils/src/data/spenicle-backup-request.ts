import { BackupRequestModel } from '@dimasbaguspm/interfaces';
import dayjs from 'dayjs';
import { capitalize } from 'lodash';

import { DateFormat, formatDate } from '../date';

export const formatSpenicleBackupRequest = (data?: BackupRequestModel | null) => {
  const isPending = ['pending', 'processing'].includes(data?.status as string);
  const isFailed = data?.status === 'failed';
  const isReady = data?.status === 'ready';

  const status = capitalize(data?.status || '');
  const variant = isReady ? 'success' : isFailed ? 'danger' : 'warning';

  const isYearDifferent = dayjs(data?.startDate).year() !== dayjs(data?.endDate).year();
  const isMonthDifferent = dayjs(data?.startDate).month() !== dayjs(data?.endDate).month();

  const dateRange = (() => {
    if (!data?.startDate || !data?.endDate) return '';

    if (isYearDifferent) {
      return (
        formatDate(data.startDate, DateFormat.DAY_MONTH_YEAR) +
        ' - ' +
        formatDate(data.endDate, DateFormat.DAY_MONTH_YEAR)
      );
    }

    if (isMonthDifferent) {
      return (
        formatDate(data.startDate, DateFormat.DAY_MONTH) + ' - ' + formatDate(data.endDate, DateFormat.DAY_MONTH_YEAR)
      );
    }

    return (
      formatDate(data.startDate, DateFormat.NUMERIC_DAY) + ' - ' + formatDate(data.endDate, DateFormat.DAY_MONTH_YEAR)
    );
  })();

  return {
    isFailed,
    isReady,
    isFinished: isFailed || isReady,
    isPending,
    dateRange,
    status,
    variant,
    requestedDate: data?.requestedAt ? formatDate(data.requestedAt, DateFormat.DAY_MONTH) : '',
    requestedDateTime: data?.requestedAt
      ? formatDate(data.requestedAt, DateFormat.DAY_MONTH_YEAR) +
        ' ' +
        formatDate(data.requestedAt, DateFormat.TIME_24H)
      : '',
    finishedDate: data?.completedAt
      ? formatDate(data.completedAt, DateFormat.DAY_MONTH_YEAR)
      : data?.errorAt
        ? formatDate(data.errorAt, DateFormat.WEEKDAY_DATE)
        : '',
    finishedDateTime: data?.completedAt
      ? formatDate(data.completedAt, DateFormat.DAY_MONTH_YEAR) +
        ' ' +
        formatDate(data.completedAt, DateFormat.TIME_24H)
      : data?.errorAt
        ? formatDate(data.errorAt, DateFormat.SHORT_DATETIME) + ' ' + formatDate(data.errorAt, DateFormat.TIME_24H)
        : '',
    errorMessage: data?.error || '',
  } as const;
};
