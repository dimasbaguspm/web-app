import { QUERY_KEYS } from '../../query-keys';
import { HI_URL } from '../../url';
import { useApiQuery } from '../../use-api-query';

import { SearchAppsModel, AppsPageModel } from './types';

export const useApiHiAppsPaginatedQuery = (params: SearchAppsModel) => {
  return useApiQuery<AppsPageModel, SearchAppsModel>({
    base: 'HI',
    queryKey: QUERY_KEYS.HI_APPS_PAGINATED(params),
    path: HI_URL.APPS.PAGINATED,
  });
};
