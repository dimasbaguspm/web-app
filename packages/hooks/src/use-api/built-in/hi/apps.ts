import { QUERY_KEYS } from '../../query-keys';
import { HI_URL } from '../../url';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

import { SearchAppsModel, AppsPageModel, AppModel } from './types';

export const useApiHiAppsPaginatedQuery = (
  params: SearchAppsModel,
  options?: Partial<
    UseApiQueryOptions<AppsPageModel, SearchAppsModel, unknown>
  >,
) => {
  return useApiQuery<AppsPageModel, SearchAppsModel>({
    ...options,
    base: 'HI',
    queryKey: QUERY_KEYS.HI_APPS_PAGINATED(params),
    queryParams: params,
    path: HI_URL.APPS.PAGINATED,
  });
};

export const useApiHiAppQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<AppModel, void, unknown>>,
) => {
  return useApiQuery<AppModel, unknown>({
    ...options,
    base: 'HI',
    path: HI_URL.APPS.BY_ID(id),
    queryKey: QUERY_KEYS.HI_APPS_BY_ID(id),
  });
};
