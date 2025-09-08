import { BackupRequestModel } from '@dimasbaguspm/interfaces';
import { capitalize } from 'lodash';

import { DateFormat, formatDate } from '../date';

export const formatSpenicleBackupRequest = (data?: BackupRequestModel | null) => {
  const isPending = ['pending', 'processing'].includes(data?.status as string);
  const isFailed = data?.status === 'failed';
  const isReady = data?.status === 'ready';

  const status = capitalize(data?.status || '');
  const variant = isReady ? 'success' : isFailed ? 'danger' : 'warning';

  const dateRange =
    data?.startDate && data?.endDate
      ? formatDate(data?.startDate, DateFormat.WEEKDAY_DATE) +
        ' - ' +
        formatDate(data?.endDate, DateFormat.WEEKDAY_DATE)
      : '';

  return {
    isFailed,
    isReady,
    isFinished: isFailed || isReady,
    isPending,
    dateRange,
    status,
    variant,
    requestedDate: data?.requestedAt ? formatDate(data.requestedAt, DateFormat.WEEKDAY_DATE) : '',
    requestedDateTime: data?.requestedAt ? formatDate(data.requestedAt, DateFormat.SHORT_DATETIME) : '',
    finishedDate: data?.completedAt
      ? formatDate(data.completedAt, DateFormat.WEEKDAY_DATE)
      : data?.errorAt
        ? formatDate(data.errorAt, DateFormat.WEEKDAY_DATE)
        : '',
    finishedDateTime: data?.completedAt
      ? formatDate(data.completedAt, DateFormat.SHORT_DATETIME)
      : data?.errorAt
        ? formatDate(data.errorAt, DateFormat.SHORT_DATETIME)
        : '',
    errorMessage: data?.error || '',
  } as const;
};
