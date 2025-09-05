import { ScheduledTransactionQueueModel, SearchScheduledTransactionQueueModel } from '@dimasbaguspm/interfaces';

import { QUERY_KEYS } from '../../query-keys';
import { SPENICLE_URL } from '../../url';
import { useApiInfiniteQuery, UseApiInfiniteQueryOptions } from '../../use-api-infinite-query';

export const useApiSpenicleScheduledTransactionQueuesInfiniteQuery = (
  id: number,
  params?: SearchScheduledTransactionQueueModel,
  options?: Partial<
    UseApiInfiniteQueryOptions<ScheduledTransactionQueueModel, SearchScheduledTransactionQueueModel, unknown>
  >,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_SCHEDULED_TRANSACTION_INFINITE({ id, ...params }),
    queryParams: params,
    path: SPENICLE_URL.SCHEDULED_TRANSACTION.BY_ID(id) + '/queue',
  });
};
