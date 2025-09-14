import { SearchAppsModel, AppsPageModel, AppModel, UpdateAppModel } from '@dimasbaguspm/interfaces';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '../../query-keys';
import { HI_URL } from '../../url';
import { useApiInfiniteQuery, UseApiInfiniteQueryOptions } from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiHiAppsInfiniteQuery = (
  params: SearchAppsModel,
  options?: Partial<UseApiInfiniteQueryOptions<AppModel, SearchAppsModel, unknown>>,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'HI',
    queryKey: QUERY_KEYS.HI_APPS_INFINITE(params),
    queryParams: params,
    path: HI_URL.APPS.PAGINATED,
  });
};

export const useApiHiAppsPaginatedQuery = (
  params: SearchAppsModel,
  options?: Partial<UseApiQueryOptions<AppsPageModel, SearchAppsModel, unknown>>,
) => {
  return useApiQuery<AppsPageModel, SearchAppsModel>({
    ...options,
    base: 'HI',
    queryKey: QUERY_KEYS.HI_APPS_PAGINATED(params),
    queryParams: params,
    path: HI_URL.APPS.PAGINATED,
  });
};

export const useApiHiAppQuery = (id: number, options?: Partial<UseApiQueryOptions<AppModel, void, unknown>>) => {
  return useApiQuery<AppModel, unknown>({
    ...options,
    base: 'HI',
    path: HI_URL.APPS.BY_ID(id),
    queryKey: QUERY_KEYS.HI_APPS_BY_ID(id),
  });
};

export const useApiHiUpdateApp = () => {
  const queryClient = useQueryClient();

  return useApiMutate<AppModel, UpdateAppModel>({
    path: '/apps/:id',
    method: 'PATCH',
    base: 'HI',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HI_APPS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HI_APPS_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.HI_APPS_BY_ID(data.id), data);
    },
  });
};
