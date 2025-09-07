import {
  CreateBackupRequestModel,
  BackupRequestModel,
  SearchBackupRequestsModel,
  BackupRequestsPageModel,
  DownloadBackupRequestModel,
} from '@dimasbaguspm/interfaces';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '../../query-keys';
import { SPENICLE_URL } from '../../url';
import { useApiInfiniteQuery, UseApiInfiniteQueryOptions } from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiSpenicleBackupRequestsInfiniteQuery = (
  params: SearchBackupRequestsModel,
  options?: Partial<UseApiInfiniteQueryOptions<BackupRequestModel, SearchBackupRequestsModel, unknown>>,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_BACKUP_REQUESTS_INFINITE(params),
    queryParams: params,
    path: SPENICLE_URL.BACKUP_REQUESTS.PAGINATED,
  });
};

export const useApiSpenicleBackupRequestsPaginatedQuery = (
  params: SearchBackupRequestsModel,
  options?: Partial<UseApiQueryOptions<BackupRequestsPageModel, SearchBackupRequestsModel, unknown>>,
) => {
  return useApiQuery<BackupRequestsPageModel, SearchBackupRequestsModel>({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_BACKUP_REQUESTS_PAGINATED(params),
    queryParams: params,
    path: SPENICLE_URL.BACKUP_REQUESTS.PAGINATED,
  });
};

export const useApiSpenicleBackupRequestQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<BackupRequestModel, unknown, unknown>>,
) => {
  return useApiQuery<BackupRequestModel, unknown>({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_BACKUP_REQUESTS_BY_ID(id),
    path: SPENICLE_URL.BACKUP_REQUESTS.BY_ID(id),
  });
};

export const useApiSpenicleCreateBackupRequest = () => {
  const queryClient = useQueryClient();
  return useApiMutate<BackupRequestModel, CreateBackupRequestModel>({
    path: '/backup-requests',
    method: 'POST',
    base: 'SPENICLE',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_BACKUP_REQUESTS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_BACKUP_REQUESTS_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.SPENICLE_BACKUP_REQUESTS_BY_ID(data.id), data);
    },
  });
};

export const useApiSpenicleBackupRequestDownload = () => {
  return useApiMutate<void, DownloadBackupRequestModel>({
    path: '/backup-requests/:id/download',
    method: 'GET',
    base: 'SPENICLE',
  });
};
