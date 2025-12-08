import { CreateReportGenerateModel, ReportRequestsModel, UpdateReportRequestsModel } from '@dimasbaguspm/interfaces';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '../../query-keys';
import { SPENICLE_URL } from '../../url';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiSpenicleReportsSettingsQuery = (
  options?: Partial<UseApiQueryOptions<ReportRequestsModel, unknown, unknown>>,
) => {
  return useApiQuery<ReportRequestsModel, unknown>({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_REPORTS_SETTINGS(),
    path: SPENICLE_URL.REPORTS.SETTINGS,
  });
};

export const useApiSpenicleCreateReportsSettings = () => {
  const queryClient = useQueryClient();

  return useApiMutate<ReportRequestsModel, CreateReportGenerateModel>({
    path: '/reports/settings',
    method: 'POST',
    base: 'SPENICLE',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_REPORTS_SETTINGS().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.SPENICLE_REPORTS_SETTINGS(), data);
    },
  });
};

export const useApiSpenicleUpdateReportsSettings = () => {
  const queryClient = useQueryClient();

  return useApiMutate<ReportRequestsModel, UpdateReportRequestsModel>({
    path: '/reports/settings',
    method: 'PATCH',
    base: 'SPENICLE',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_REPORTS_SETTINGS().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.SPENICLE_REPORTS_SETTINGS(), data);
    },
  });
};

export const useApiSpenicleDeleteReportsSettings = () => {
  const queryClient = useQueryClient();

  return useApiMutate<void, void>({
    path: '/reports/settings',
    method: 'DELETE',
    base: 'SPENICLE',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SPENICLE_REPORTS_SETTINGS().slice(0, 3),
        exact: false,
      });
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.SPENICLE_REPORTS_SETTINGS(),
      });
    },
  });
};
